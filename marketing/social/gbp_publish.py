#!/usr/bin/env python3
"""Conservative Google Business Profile post publisher for 305 Doors. Never retries a POST.

  python3 marketing/social/gbp_publish.py preflight
  python3 marketing/social/gbp_publish.py publish marketing/runs/gbp/YYYY-MM-DD-posts.json
  python3 marketing/social/gbp_publish.py verify --date YYYY-MM-DD     (read-only on Google)
  python3 marketing/social/gbp_publish.py recent [--limit 10]          (read-only)
  (global flag --runs DIR overrides marketing/runs, for tests)

Manifest: {"date": "...", "post": {"summary", "link", "image_url"?, "review": {"approved": true, "notes": "..."}}}
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.parse
from pathlib import Path

import facebook_publish as fb
import gbp_oauth

CHANNEL = "gbp"
KEYS = ("GBP_CLIENT_ID", "GBP_CLIENT_SECRET", "GBP_REFRESH_TOKEN", "GBP_ACCOUNT", "GBP_LOCATION")
MAX_SUMMARY = 1500
PHONE = re.compile(r"\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b")
URLISH = re.compile(r"https?://|www\.|\b[a-z0-9-]+\.(?:com|net|org|co|io|us)\b", re.I)
API = "https://mybusiness.googleapis.com/v4"


def cfg_from_env() -> dict:
    values = fb.config.load()
    missing = [k for k in KEYS if not values.get(k)]
    if missing:
        raise fb.MissingConfig(missing)
    if not re.fullmatch(r"accounts/[\w-]+", values["GBP_ACCOUNT"]):
        raise ValueError("GBP_ACCOUNT must look like accounts/123")
    if not re.fullmatch(r"locations/[\w-]+", values["GBP_LOCATION"]):
        raise ValueError("GBP_LOCATION must look like locations/123")
    return {k: values[k] for k in KEYS}


def posts_url(cfg: dict) -> str:
    return f"{API}/{cfg['GBP_ACCOUNT']}/{cfg['GBP_LOCATION']}/localPosts"


def api(method: str, url: str, token: str, body: dict | None = None) -> dict:
    return fb.http_json(method, url, {"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
                        json.dumps(body).encode() if body is not None else None, timeout=40)


def validate_post(post: dict) -> None:
    s = post.get("summary")
    if not isinstance(s, str) or not s.strip():
        raise ValueError("summary is empty")
    if len(s) > MAX_SUMMARY:
        raise ValueError(f"summary is over {MAX_SUMMARY} characters")
    if PHONE.search(s):
        raise ValueError("phone numbers are not allowed in GBP post text")
    if URLISH.search(s):
        raise ValueError("URLs are not allowed in GBP post text (the link goes in the button)")
    if not fb.on_site(post.get("link")):
        raise ValueError(f"link must be https on {fb.DOMAIN}")
    img = post.get("image_url")
    if img is not None and not (isinstance(img, str) and urllib.parse.urlsplit(img).scheme == "https"
                                and urllib.parse.urlsplit(img).hostname):
        raise ValueError("image_url must be https")


def find_by_summary(cfg: dict, token: str, summary: str) -> dict | None:
    res = api("GET", posts_url(cfg) + "?pageSize=25", token)
    for lp in res.get("localPosts", []):
        if lp.get("summary") == summary and lp.get("name"):
            return lp
    return None


def verify_record(target: Path, rec: dict, token: str) -> dict:
    res = api("GET", f"{API}/{rec['post_name']}", token)
    ok = res.get("summary") == rec["summary"] and res.get("state") in ("LIVE", "PROCESSING")
    rec.update(status="verified" if ok else f"verify_failed:{res.get('state')}", state=res.get("state"),
               search_url=res.get("searchUrl") or rec.get("search_url"))
    fb.write_json(target, rec)
    return {"channel": CHANNEL, "status": rec["status"], "state": rec["state"], "post": rec["post_name"],
            "url": rec.get("search_url")}


def publish_one(runs: Path, cfg: dict, token: str, day: str, post: dict) -> dict:
    validate_post(post)
    target = runs / CHANNEL / f"{day}.ledger.json"
    if target.exists():
        raise RuntimeError(f"ledger exists for {day}; never resubmit (use verify)")
    body = {"languageCode": "en-US", "topicType": "STANDARD", "summary": post["summary"],
            "callToAction": {"actionType": "LEARN_MORE", "url": post["link"]}}
    if post.get("image_url"):
        body["media"] = [{"mediaFormat": "PHOTO", "sourceUrl": post["image_url"]}]
    rec = {"date": day, "location": cfg["GBP_LOCATION"], "summary": post["summary"], "link": post["link"],
           "image_url": post.get("image_url"), "status": "intent"}
    fb.write_json(target, rec)  # durable before the non-idempotent POST
    try:
        res = api("POST", posts_url(cfg), token, body)
    except Exception:
        rec["status"] = "uncertain"
        fb.write_json(target, rec)
        raise RuntimeError("submission outcome uncertain; run verify (read-only) before anything else") from None
    if not res.get("name"):
        rec["status"] = "uncertain"
        fb.write_json(target, rec)
        raise RuntimeError("no post name returned; run verify (read-only) before anything else")
    rec.update(status="submitted", post_name=res["name"], state=res.get("state"), search_url=res.get("searchUrl"))
    fb.write_json(target, rec)
    try:
        return verify_record(target, rec, token)
    except Exception:
        raise RuntimeError(f"post {res['name']} submitted; verification failed, id preserved") from None


def verify(runs: Path, cfg: dict, token: str, day: str) -> dict:
    fb.check_day(day)
    target = runs / CHANNEL / f"{day}.ledger.json"
    if not target.exists():
        raise RuntimeError(f"no ledger for {day}")
    rec = json.loads(target.read_text(encoding="utf-8"))
    if not rec.get("post_name"):
        if rec.get("status") == "intent":
            raise RuntimeError("ledger shows an unfinished attempt; investigate manually, no resubmission")
        found = find_by_summary(cfg, token, rec["summary"])  # read-only investigation of an uncertain POST
        if not found:
            raise RuntimeError("uncertain post not found among recent posts; do not resubmit, investigate")
        rec.update(post_name=found["name"], status="submitted")
        fb.write_json(target, rec)
    return verify_record(target, rec, token)


def recent(cfg: dict, token: str, limit: int) -> list[dict]:
    res = api("GET", posts_url(cfg) + f"?pageSize={max(1, min(limit, 100))}", token)
    return [{"created": lp.get("createTime"), "state": lp.get("state"),
             "link": (lp.get("callToAction") or {}).get("url"), "summary": lp.get("summary", "")}
            for lp in res.get("localPosts", [])]


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
        cfg = cfg_from_env()
        token = gbp_oauth.access_token()
        if args.cmd == "preflight":
            api("GET", posts_url(cfg) + "?pageSize=1", token)
            print("gbp: ok")
            return 0
        if args.cmd == "recent":
            for item in recent(cfg, token, args.limit):
                print(json.dumps(item, ensure_ascii=False))
            return 0
        lock = fb.locked(args.runs / CHANNEL)
        try:
            if args.cmd == "verify":
                print(json.dumps(verify(args.runs, cfg, token, args.date), ensure_ascii=False))
                return 0
            day, post = fb.load_manifest(args.manifest)
            print(json.dumps(publish_one(args.runs, cfg, token, day, post), ensure_ascii=False))
            return 0
        finally:
            lock.close()
    except fb.MissingConfig as exc:
        print(f"gbp: {exc}", file=sys.stderr)
        return 1
    except Exception as exc:
        print(f"gbp: error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
