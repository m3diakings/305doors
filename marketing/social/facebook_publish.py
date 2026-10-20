#!/usr/bin/env python3
"""Conservative Facebook Page publisher for 305 Doors. Never retries a POST.

  python3 marketing/social/facebook_publish.py preflight
  python3 marketing/social/facebook_publish.py publish marketing/runs/facebook/YYYY-MM-DD-posts.json
  python3 marketing/social/facebook_publish.py verify --date YYYY-MM-DD     (read-only on Facebook)
  python3 marketing/social/facebook_publish.py recent [--limit 10]          (read-only)
  (global flag --runs DIR overrides marketing/runs, for tests)

Manifest: {"date": "...", "post": {"message", "link", "review": {"approved": true, "notes": "..."}}}
Also hosts HTTP/ledger/lock helpers shared by the Instagram and Google publishers.
"""
from __future__ import annotations

import argparse
import fcntl
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import config  # noqa: E402

DOMAIN = "305doors.com"
CHANNEL = "facebook"


class ApiError(RuntimeError):
    """HTTP/API failure. Message never contains URLs, bodies or tokens."""


class MissingConfig(RuntimeError):
    def __init__(self, keys: list[str]):
        super().__init__("missing configuration: " + ", ".join(keys))
        self.keys = keys


# ---------- shared helpers ----------

def http_json(method: str, url: str, headers: dict | None = None, body: bytes | None = None, timeout: int = 30) -> dict:
    """The only network call in the publishers; tests replace it."""
    req = urllib.request.Request(url, data=body, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read()
    except urllib.error.HTTPError as exc:
        code = ""
        try:
            err = json.loads(exc.read().decode("utf-8", "ignore")).get("error", {})
            if isinstance(err, dict):
                code = f", api code {int(err['code'])}" if isinstance(err.get("code"), int) else ""
                if isinstance(err.get("status"), str) and re.fullmatch(r"[A-Z_]{3,40}", err["status"]):
                    code += f", {err['status']}"
        except Exception:
            pass
        raise ApiError(f"{method} failed (HTTP {exc.code}{code})") from None
    except Exception:
        raise ApiError(f"{method} failed or timed out") from None
    try:
        payload = json.loads(raw.decode("utf-8") or "{}")
    except Exception:
        raise ApiError(f"{method} returned a non-JSON response") from None
    if not isinstance(payload, dict) or payload.get("error"):
        raise ApiError(f"{method} returned an error payload")
    return payload


def write_json(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    with tmp.open("w", encoding="utf-8") as fh:
        json.dump(value, fh, ensure_ascii=False, indent=2)
        fh.flush()
        os.fsync(fh.fileno())
    os.chmod(tmp, 0o600)
    os.replace(tmp, path)
    fd = os.open(path.parent, os.O_RDONLY)
    try:
        os.fsync(fd)
    finally:
        os.close(fd)


def locked(folder: Path):
    folder.mkdir(parents=True, exist_ok=True)
    lock = (folder / ".publisher.lock").open("a+")
    fcntl.flock(lock.fileno(), fcntl.LOCK_EX)
    return lock


def check_day(day: object) -> str:
    if not isinstance(day, str):
        raise ValueError("date must be YYYY-MM-DD")
    try:
        ok = date.fromisoformat(day).isoformat() == day
    except ValueError:
        ok = False
    if not ok:
        raise ValueError("date must be YYYY-MM-DD")
    return day


def load_manifest(path: Path) -> tuple[str, dict]:
    try:
        manifest = json.loads(Path(path).read_text(encoding="utf-8"))
        day = check_day(manifest["date"])
        post = manifest["post"]
    except Exception:
        raise ValueError("manifest must be JSON with a valid date and a post object") from None
    if not isinstance(post, dict):
        raise ValueError("post must be an object")
    review = post.get("review")
    if not isinstance(review, dict) or review.get("approved") is not True:
        raise ValueError("review approval missing (review.approved must be true)")
    return day, post


def on_site(url: object, require_https: bool = True) -> bool:
    if not isinstance(url, str):
        return False
    u = urllib.parse.urlsplit(url)
    try:
        host = (u.hostname or "").lower().rstrip(".")
    except ValueError:
        return False
    return (u.scheme == "https" or not require_https) and not u.username and not u.password \
        and host in (DOMAIN, "www." + DOMAIN)


def cfg_from_env(keys: tuple[str, ...]) -> dict:
    values = config.load()
    missing = [k for k in keys if not values.get(k)]
    if missing:
        raise MissingConfig(missing)
    out = {k: values[k] for k in keys}
    version = values.get("META_GRAPH_API_VERSION") or "v24.0"
    if not re.fullmatch(r"v[0-9]+\.[0-9]+", version):
        raise ValueError("META_GRAPH_API_VERSION is invalid")
    out["version"] = version
    return out


def graph(cfg: dict, endpoint: str, method: str = "GET", data: dict | None = None) -> dict:
    url = f"https://graph.facebook.com/{cfg['version']}/{urllib.parse.quote(endpoint, safe='/')}"
    headers = {"Authorization": f"Bearer {cfg['META_PAGE_ACCESS_TOKEN']}", "User-Agent": "305doors-social/1.0"}
    body = None
    if method == "POST":
        body = urllib.parse.urlencode(data or {}).encode()
        headers["Content-Type"] = "application/x-www-form-urlencoded"
    elif data:
        url += "?" + urllib.parse.urlencode(data)
    return http_json(method, url, headers, body, timeout=40)


# ---------- Facebook ----------

def validate_post(post: dict) -> None:
    msg = post.get("message")
    if not isinstance(msg, str) or not msg.strip():
        raise ValueError("message is empty")
    if len(msg) > 5000:
        raise ValueError("message is over 5,000 characters")
    if not on_site(post.get("link")):
        raise ValueError(f"link must be https on {DOMAIN}")


def readback(cfg: dict, post_id: str, message: str) -> dict:
    res = graph(cfg, post_id, data={"fields": "id,message,permalink_url"})
    if str(res.get("id")) != post_id or res.get("message") != message or not res.get("permalink_url"):
        raise RuntimeError("published post readback did not match")
    return res


def find_by_message(cfg: dict, message: str) -> dict | None:
    res = graph(cfg, f"{cfg['META_PAGE_ID']}/posts", data={"fields": "id,message,permalink_url", "limit": "25"})
    for item in res.get("data", []):
        if item.get("message") == message and item.get("id"):
            return item
    return None


def publish_one(runs: Path, cfg: dict, day: str, post: dict) -> dict:
    validate_post(post)
    target = runs / CHANNEL / f"{day}.ledger.json"
    if target.exists():
        raise RuntimeError(f"ledger exists for {day}; never resubmit (use verify)")
    page = graph(cfg, cfg["META_PAGE_ID"], data={"fields": "id,name"})
    if str(page.get("id")) != cfg["META_PAGE_ID"]:
        raise RuntimeError("Page identity mismatch")
    rec = {"date": day, "page_id": cfg["META_PAGE_ID"], "message": post["message"], "link": post["link"], "status": "intent"}
    write_json(target, rec)  # durable before the non-idempotent POST
    try:
        res = graph(cfg, f"{cfg['META_PAGE_ID']}/feed", "POST", {"message": post["message"], "link": post["link"]})
    except Exception:
        rec["status"] = "uncertain"
        write_json(target, rec)
        raise RuntimeError("submission outcome uncertain; run verify (read-only) before anything else") from None
    post_id = str(res.get("id", ""))
    if not post_id:
        rec["status"] = "uncertain"
        write_json(target, rec)
        raise RuntimeError("no post id returned; run verify (read-only) before anything else")
    rec.update(status="submitted", post_id=post_id)
    write_json(target, rec)
    try:
        got = readback(cfg, post_id, post["message"])
    except Exception:
        raise RuntimeError(f"post {post_id} submitted; verification failed, id preserved") from None
    rec.update(status="verified", permalink_url=got["permalink_url"])
    write_json(target, rec)
    return {"channel": CHANNEL, "status": "verified", "id": post_id, "url": got["permalink_url"]}


def verify(runs: Path, cfg: dict, day: str) -> dict:
    check_day(day)
    target = runs / CHANNEL / f"{day}.ledger.json"
    if not target.exists():
        raise RuntimeError(f"no ledger for {day}")
    rec = json.loads(target.read_text(encoding="utf-8"))
    if not rec.get("post_id"):
        if rec.get("status") == "intent":
            raise RuntimeError("ledger shows an unfinished attempt; investigate manually, no resubmission")
        found = find_by_message(cfg, rec["message"])  # read-only investigation of an uncertain POST
        if not found:
            raise RuntimeError("uncertain post not found in the Page's recent posts; do not resubmit, investigate")
        rec.update(post_id=str(found["id"]), status="submitted")
        write_json(target, rec)
    got = readback(cfg, rec["post_id"], rec["message"])
    rec.update(status="verified", permalink_url=got["permalink_url"])
    write_json(target, rec)
    return {"channel": CHANNEL, "status": "verified", "id": rec["post_id"], "url": got["permalink_url"]}


def recent(cfg: dict, limit: int) -> list[dict]:
    res = graph(cfg, f"{cfg['META_PAGE_ID']}/posts",
                data={"fields": "id,message,created_time,permalink_url", "limit": str(max(1, min(limit, 50)))})
    return [{"created": p.get("created_time"), "url": p.get("permalink_url"), "message": p.get("message", "")}
            for p in res.get("data", [])]


KEYS = ("META_PAGE_ID", "META_PAGE_ACCESS_TOKEN")


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--runs", type=Path, default=config.RUNS)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("preflight")
    p = sub.add_parser("publish"); p.add_argument("manifest", type=Path)
    v = sub.add_parser("verify"); v.add_argument("--date", required=True)
    r = sub.add_parser("recent"); r.add_argument("--limit", type=int, default=10)
    args = ap.parse_args(argv)
    try:
        cfg = cfg_from_env(KEYS)
        if args.cmd == "preflight":
            page = graph(cfg, cfg["META_PAGE_ID"], data={"fields": "id,name"})
            if str(page.get("id")) != cfg["META_PAGE_ID"]:
                raise RuntimeError("Page identity mismatch")
            graph(cfg, f"{cfg['META_PAGE_ID']}/posts", data={"limit": "1"})
            print(f"facebook: ok (Page {page.get('name')})")
            return 0
        if args.cmd == "recent":
            for item in recent(cfg, args.limit):
                print(json.dumps(item, ensure_ascii=False))
            return 0
        lock = locked(args.runs / CHANNEL)
        try:
            if args.cmd == "verify":
                print(json.dumps(verify(args.runs, cfg, args.date), ensure_ascii=False))
                return 0
            day, post = load_manifest(args.manifest)
            print(json.dumps(publish_one(args.runs, cfg, day, post), ensure_ascii=False))
            return 0
        finally:
            lock.close()
    except MissingConfig as exc:
        print(f"facebook: {exc}", file=sys.stderr)
        return 1
    except Exception as exc:
        print(f"facebook: error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
