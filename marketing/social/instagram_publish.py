#!/usr/bin/env python3
"""Conservative Instagram (Content Publishing API) publisher for 305 Doors. Never retries a publish.

  python3 marketing/social/instagram_publish.py preflight
  python3 marketing/social/instagram_publish.py publish marketing/runs/instagram/YYYY-MM-DD-posts.json
  python3 marketing/social/instagram_publish.py verify --date YYYY-MM-DD    (read-only on Instagram)
  python3 marketing/social/instagram_publish.py recent [--limit 10]         (read-only)
  (global flag --runs DIR overrides marketing/runs, for tests)

Manifest: {"date": "...", "post": {"caption", "image_url", "review": {"approved": true, "notes": "..."}}}
Flow: create container, poll status_code until FINISHED (bounded), media_publish once, read back permalink.
Captions carry no clickable links: say "link in bio" or name the site in plain text.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.parse
from pathlib import Path

import facebook_publish as fb

CHANNEL = "instagram"
KEYS = ("META_PAGE_ACCESS_TOKEN", "IG_USER_ID")
MAX_CAPTION = 2200
MAX_HASHTAGS = 30
HASHTAG = re.compile(r"(?<![\w&])#\w+")
POLL_ATTEMPTS = 12
POLL_DELAY = 5


def validate_post(post: dict) -> None:
    cap = post.get("caption")
    if not isinstance(cap, str) or not cap.strip():
        raise ValueError("caption is empty")
    if len(cap) > MAX_CAPTION:
        raise ValueError(f"caption is over {MAX_CAPTION} characters")
    if len(HASHTAG.findall(cap)) > MAX_HASHTAGS:
        raise ValueError(f"caption has more than {MAX_HASHTAGS} hashtags")
    if re.search(r"https?://", cap, re.I):
        raise ValueError("caption must not contain URLs (not clickable on Instagram); use 'link in bio' or the plain site name")
    img = post.get("image_url")
    if not fb.on_site(img):
        raise ValueError(f"image_url must be https on {fb.DOMAIN}")
    if not urllib.parse.urlsplit(img).path.lower().endswith((".jpg", ".jpeg")):
        raise ValueError("image_url must be a JPEG (.jpg/.jpeg)")


def poll_container(cfg: dict, container_id: str, attempts: int = POLL_ATTEMPTS, delay: float = POLL_DELAY, sleep=time.sleep) -> None:
    last = "UNKNOWN"
    for i in range(attempts):
        last = str(fb.graph(cfg, container_id, data={"fields": "status_code"}).get("status_code", "UNKNOWN"))
        if last == "FINISHED":
            return
        if last in ("ERROR", "EXPIRED"):
            raise RuntimeError(f"container processing failed ({last})")
        if i < attempts - 1:
            sleep(delay)
    raise RuntimeError(f"container not ready after {attempts} checks (last status {last})")


def readback(cfg: dict, media_id: str, caption: str) -> dict:
    res = fb.graph(cfg, media_id, data={"fields": "id,caption,permalink,media_type"})
    if str(res.get("id")) != media_id or res.get("caption") != caption or not res.get("permalink"):
        raise RuntimeError("published media readback did not match")
    return res


def find_by_caption(cfg: dict, caption: str) -> dict | None:
    res = fb.graph(cfg, f"{cfg['IG_USER_ID']}/media", data={"fields": "id,caption,permalink", "limit": "25"})
    for item in res.get("data", []):
        if item.get("caption") == caption and item.get("id"):
            return item
    return None


def publish_one(runs: Path, cfg: dict, day: str, post: dict, attempts: int = POLL_ATTEMPTS,
                delay: float = POLL_DELAY, sleep=time.sleep) -> dict:
    validate_post(post)
    target = runs / CHANNEL / f"{day}.ledger.json"
    if target.exists():
        prior = json.loads(target.read_text(encoding="utf-8"))
        # Only a failure before media_publish was ever attempted may be retried: nothing was published.
        if prior.get("status") != "container_failed":
            raise RuntimeError(f"ledger exists for {day} (status {prior.get('status')}); never resubmit (use verify)")
    ig = cfg["IG_USER_ID"]
    rec = {"date": day, "ig_user_id": ig, "caption": post["caption"], "image_url": post["image_url"], "status": "intent"}
    fb.write_json(target, rec)
    try:
        res = fb.graph(cfg, f"{ig}/media", "POST", {"image_url": post["image_url"], "caption": post["caption"]})
        container_id = str(res.get("id", ""))
        if not container_id:
            raise RuntimeError("no container id returned")
        rec.update(status="container_created", container_id=container_id)
        fb.write_json(target, rec)
        poll_container(cfg, container_id, attempts, delay, sleep)
    except Exception as exc:
        # media_publish has not been called, so nothing is live; a later run may start over.
        rec.update(status="container_failed", error=str(exc)[:200])
        fb.write_json(target, rec)
        raise RuntimeError(f"container step failed ({str(exc)[:120]}); nothing was published") from None
    rec["status"] = "publishing"
    fb.write_json(target, rec)  # durable before the non-idempotent publish
    try:
        res = fb.graph(cfg, f"{ig}/media_publish", "POST", {"creation_id": container_id})
    except Exception:
        rec["status"] = "uncertain"
        fb.write_json(target, rec)
        raise RuntimeError("publish outcome uncertain; run verify (read-only) before anything else") from None
    media_id = str(res.get("id", ""))
    if not media_id:
        rec["status"] = "uncertain"
        fb.write_json(target, rec)
        raise RuntimeError("no media id returned; run verify (read-only) before anything else")
    rec.update(status="submitted", media_id=media_id)
    fb.write_json(target, rec)
    try:
        got = readback(cfg, media_id, post["caption"])
    except Exception:
        raise RuntimeError(f"media {media_id} published; verification failed, id preserved") from None
    rec.update(status="verified", permalink=got["permalink"])
    fb.write_json(target, rec)
    return {"channel": CHANNEL, "status": "verified", "id": media_id, "url": got["permalink"]}


def verify(runs: Path, cfg: dict, day: str) -> dict:
    fb.check_day(day)
    target = runs / CHANNEL / f"{day}.ledger.json"
    if not target.exists():
        raise RuntimeError(f"no ledger for {day}")
    rec = json.loads(target.read_text(encoding="utf-8"))
    if not rec.get("media_id"):
        if rec.get("status") not in ("uncertain", "publishing"):
            raise RuntimeError(f"nothing published (ledger status {rec.get('status')})")
        found = find_by_caption(cfg, rec["caption"])  # read-only investigation of an uncertain publish
        if not found:
            raise RuntimeError("uncertain post not found in recent media; do not resubmit, investigate")
        rec.update(media_id=str(found["id"]), status="submitted")
        fb.write_json(target, rec)
    got = readback(cfg, rec["media_id"], rec["caption"])
    rec.update(status="verified", permalink=got["permalink"])
    fb.write_json(target, rec)
    return {"channel": CHANNEL, "status": "verified", "id": rec["media_id"], "url": got["permalink"]}


def recent(cfg: dict, limit: int) -> list[dict]:
    res = fb.graph(cfg, f"{cfg['IG_USER_ID']}/media",
                   data={"fields": "id,caption,permalink,timestamp", "limit": str(max(1, min(limit, 50)))})
    return [{"created": m.get("timestamp"), "url": m.get("permalink"), "caption": m.get("caption", "")}
            for m in res.get("data", [])]


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--runs", type=Path, default=fb.config.RUNS)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("preflight")
    p = sub.add_parser("publish"); p.add_argument("manifest", type=Path)
    v = sub.add_parser("verify"); v.add_argument("--date", required=True)
    r = sub.add_parser("recent"); r.add_argument("--limit", type=int, default=10)
    args = ap.parse_args(argv)
    try:
        cfg = fb.cfg_from_env(KEYS)
        if args.cmd == "preflight":
            acct = fb.graph(cfg, cfg["IG_USER_ID"], data={"fields": "id,username"})
            if str(acct.get("id")) != cfg["IG_USER_ID"]:
                raise RuntimeError("Instagram account identity mismatch")
            fb.graph(cfg, f"{cfg['IG_USER_ID']}/media", data={"limit": "1"})
            print(f"instagram: ok (@{acct.get('username')})")
            return 0
        if args.cmd == "recent":
            for item in recent(cfg, args.limit):
                print(json.dumps(item, ensure_ascii=False))
            return 0
        lock = fb.locked(args.runs / CHANNEL)
        try:
            if args.cmd == "verify":
                print(json.dumps(verify(args.runs, cfg, args.date), ensure_ascii=False))
                return 0
            day, post = fb.load_manifest(args.manifest)
            print(json.dumps(publish_one(args.runs, cfg, day, post), ensure_ascii=False))
            return 0
        finally:
            lock.close()
    except fb.MissingConfig as exc:
        print(f"instagram: {exc}", file=sys.stderr)
        return 1
    except Exception as exc:
        print(f"instagram: error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
