#!/usr/bin/env python3
"""One-time local helper: turn a short-lived user token into a long-lived Page token.

Run on your Mac, never in the cloud routine.

1. In developers.facebook.com create/open an app (type Business) and note the App ID and App Secret.
2. In Graph API Explorer, pick that app, choose "Get User Access Token" and grant:
     pages_show_list, pages_read_engagement, pages_manage_posts,
     instagram_basic, instagram_content_publish, business_management
   (log in as a person who manages the 305 Doors Page; the Instagram account must be a Business/Creator
   account linked to that Page.)
3. Put these in marketing/.env:  META_APP_ID=...  META_APP_SECRET=...  META_USER_TOKEN=<short-lived token>
4. python3 marketing/social/meta_token.py [--page-id ID]
   It exchanges for a long-lived user token, reads /me/accounts, and writes META_PAGE_ID,
   META_PAGE_ACCESS_TOKEN and IG_USER_ID to marketing/.env. A Page token derived from a long-lived user
   token does not expire. No secret is printed. Delete META_USER_TOKEN from marketing/.env afterwards.
5. Check with: python3 marketing/social/facebook_publish.py preflight, and instagram_publish.py preflight.

Page tokens stop working if the person's password changes, the app is removed, or permissions are revoked.
"""
from __future__ import annotations

import argparse
import sys
import urllib.parse

import facebook_publish as fb
from gbp_oauth import env_set

PERMISSIONS = ("pages_show_list", "pages_read_engagement", "pages_manage_posts",
               "instagram_basic", "instagram_content_publish", "business_management")


def run(values: dict, page_id: str | None, write=env_set) -> dict:
    missing = [k for k in ("META_APP_ID", "META_APP_SECRET", "META_USER_TOKEN") if not values.get(k)]
    if missing:
        raise fb.MissingConfig(missing)
    version = values.get("META_GRAPH_API_VERSION") or "v24.0"
    base = f"https://graph.facebook.com/{version}"
    long_user = fb.http_json("GET", f"{base}/oauth/access_token?" + urllib.parse.urlencode({
        "grant_type": "fb_exchange_token", "client_id": values["META_APP_ID"],
        "client_secret": values["META_APP_SECRET"], "fb_exchange_token": values["META_USER_TOKEN"]})).get("access_token")
    if not long_user:
        raise RuntimeError("token exchange returned no token")
    pages = fb.http_json("GET", f"{base}/me/accounts?" + urllib.parse.urlencode({
        "fields": "id,name,access_token,instagram_business_account{id,username}", "limit": "100"}),
        {"Authorization": f"Bearer {long_user}"}).get("data", [])
    if page_id:
        chosen = [p for p in pages if str(p.get("id")) == page_id]
    else:
        chosen = [p for p in pages if "305" in (p.get("name") or "")] or (pages if len(pages) == 1 else [])
    if len(chosen) != 1:
        listing = "; ".join(f"{p.get('name')} ({p.get('id')})" for p in pages) or "none"
        raise RuntimeError(f"could not pick exactly one Page; rerun with --page-id. Pages seen: {listing}")
    page = chosen[0]
    ig = (page.get("instagram_business_account") or {})
    if not page.get("access_token"):
        raise RuntimeError("no Page token returned; check the granted permissions")
    write("META_PAGE_ID", str(page["id"]))
    write("META_PAGE_ACCESS_TOKEN", page["access_token"])
    if ig.get("id"):
        write("IG_USER_ID", str(ig["id"]))
    return {"page": page.get("name"), "page_id": page["id"], "instagram": ig.get("username"), "ig_user_id": ig.get("id")}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--page-id")
    args = ap.parse_args()
    try:
        out = run(fb.config.load(), args.page_id)
    except fb.MissingConfig as exc:
        print(f"{exc} (add to marketing/.env)", file=sys.stderr)
        return 1
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    print(f"Saved to marketing/.env: Page {out['page']} ({out['page_id']})")
    if out["ig_user_id"]:
        print(f"Instagram @{out['instagram']} ({out['ig_user_id']}) saved as IG_USER_ID")
    else:
        print("WARNING: no Instagram business account is linked to this Page; IG_USER_ID not set.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
