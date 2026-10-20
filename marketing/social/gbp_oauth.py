#!/usr/bin/env python3
"""Google Business Profile sign-in helpers. Run `login` and `locations` once, locally.

  python3 marketing/social/gbp_oauth.py login       localhost OAuth flow; appends GBP_REFRESH_TOKEN to marketing/.env
  python3 marketing/social/gbp_oauth.py locations   lists accounts/locations so you can pick GBP_ACCOUNT / GBP_LOCATION

Needs GBP_CLIENT_ID and GBP_CLIENT_SECRET (OAuth client of type "Desktop app") in marketing/.env first.
The refresh token is written only to marketing/.env (git-ignored, chmod 600) and is never printed.
The publisher uses access_token() to exchange the refresh token once per run.
"""
from __future__ import annotations

import base64
import hashlib
import http.server
import json
import os
import secrets
import sys
import urllib.parse
import webbrowser
from pathlib import Path

import facebook_publish as fb

config = fb.config
SCOPE = "https://www.googleapis.com/auth/business.manage"
TOKEN_URL = "https://oauth2.googleapis.com/token"
ENV_FILE = config.MARKETING / ".env"


def env_set(key: str, value: str, path: Path = ENV_FILE) -> None:
    """Set KEY=value in the env file (replace or append), chmod 600. Never prints the value."""
    lines = path.read_text().splitlines() if path.exists() else []
    out, done = [], False
    for line in lines:
        if line.split("=", 1)[0].strip() == key and not line.lstrip().startswith("#"):
            if not done:
                out.append(f"{key}={value}")
                done = True
        else:
            out.append(line)
    if not done:
        out.append(f"{key}={value}")
    tmp = path.with_suffix(".tmp")
    tmp.write_text("\n".join(out) + "\n")
    os.chmod(tmp, 0o600)
    os.replace(tmp, path)


def _form(data: dict) -> bytes:
    return urllib.parse.urlencode(data).encode()


def access_token(values: dict | None = None) -> str:
    """Exchange the stored refresh token for a short-lived access token."""
    values = values if values is not None else config.load()
    keys = ("GBP_CLIENT_ID", "GBP_CLIENT_SECRET", "GBP_REFRESH_TOKEN")
    missing = [k for k in keys if not values.get(k)]
    if missing:
        raise fb.MissingConfig(missing)
    res = fb.http_json("POST", TOKEN_URL, {"Content-Type": "application/x-www-form-urlencoded"},
                       _form({"client_id": values["GBP_CLIENT_ID"], "client_secret": values["GBP_CLIENT_SECRET"],
                              "refresh_token": values["GBP_REFRESH_TOKEN"], "grant_type": "refresh_token"}))
    if not res.get("access_token"):
        raise RuntimeError("Google token exchange returned no access token")
    return res["access_token"]


def login() -> None:
    values = config.load()
    missing = [k for k in ("GBP_CLIENT_ID", "GBP_CLIENT_SECRET") if not values.get(k)]
    if missing:
        raise SystemExit("Add to marketing/.env first: " + ", ".join(missing))
    verifier = base64.urlsafe_b64encode(secrets.token_bytes(48)).rstrip(b"=").decode()
    challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b"=").decode()
    state = secrets.token_urlsafe(24)
    result: dict = {}

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            q = urllib.parse.parse_qs(urllib.parse.urlsplit(self.path).query)
            if q.get("state", [""])[0] == state:
                result.update({k: v[0] for k, v in q.items()})
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.end_headers()
            self.wfile.write(b"<h2>Done. You can close this tab and return to Terminal.</h2>")

        def log_message(self, *a):
            pass

    server = http.server.HTTPServer(("127.0.0.1", 0), Handler)
    redirect = f"http://127.0.0.1:{server.server_port}"
    url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode({
        "client_id": values["GBP_CLIENT_ID"], "redirect_uri": redirect, "response_type": "code", "scope": SCOPE,
        "access_type": "offline", "prompt": "consent", "state": state,
        "code_challenge": challenge, "code_challenge_method": "S256"})
    print("Opening Google sign-in. Sign in with the account that manages the 305 Doors Business Profile.")
    print("If no browser opens, paste this URL into one:\n" + url)
    webbrowser.open(url)
    while not result:
        server.handle_request()
    server.server_close()
    if "code" not in result:
        raise SystemExit(f"Sign-in was not completed: {result.get('error', 'unknown error')}")
    tok = fb.http_json("POST", TOKEN_URL, {"Content-Type": "application/x-www-form-urlencoded"},
                       _form({"client_id": values["GBP_CLIENT_ID"], "client_secret": values["GBP_CLIENT_SECRET"],
                              "code": result["code"], "code_verifier": verifier, "redirect_uri": redirect,
                              "grant_type": "authorization_code"}))
    if not tok.get("refresh_token"):
        raise SystemExit("Google returned no refresh token; revoke the app at myaccount.google.com/permissions and retry")
    env_set("GBP_REFRESH_TOKEN", tok["refresh_token"])
    print("Saved GBP_REFRESH_TOKEN to marketing/.env (not printed). Next: python3 marketing/social/gbp_oauth.py locations")


def _get(url: str, token: str) -> dict:
    return fb.http_json("GET", url, {"Authorization": f"Bearer {token}"})


def locations() -> None:
    token = access_token()
    found = 0
    for acct in _get("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", token).get("accounts", []):
        page = ""
        while True:
            q = {"readMask": "name,title,websiteUri,storefrontAddress", "pageSize": "100"}
            if page:
                q["pageToken"] = page
            data = _get(f"https://mybusinessbusinessinformation.googleapis.com/v1/{acct['name']}/locations?"
                        + urllib.parse.urlencode(q), token)
            for loc in data.get("locations", []):
                found += 1
                city = (loc.get("storefrontAddress") or {}).get("locality")
                print(f"{loc.get('title')} | {loc.get('websiteUri')} | {city}")
                print(f"  GBP_ACCOUNT={acct['name']}\n  GBP_LOCATION={loc['name']}")
            page = data.get("nextPageToken", "")
            if not page:
                break
    print(f"\n{found} location(s). Put the chosen GBP_ACCOUNT and GBP_LOCATION lines in marketing/.env.")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    try:
        {"login": login, "locations": locations}.get(cmd, lambda: print(__doc__))()
    except fb.MissingConfig as exc:
        raise SystemExit(f"{exc}")
    except fb.ApiError as exc:
        raise SystemExit(f"Google request failed: {exc}")
