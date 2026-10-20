#!/usr/bin/env python3
"""Cloud-run setup for the 305 Doors marketing routines.

Run from the repo root at the start of every cloud run:  python3 cloud/bootstrap.py blog|social
Checks that the environment's variables are present (never prints values) and installs the
image tools the blog step needs. Exits 1 when a required variable is missing.
"""
from __future__ import annotations

import os, shutil, subprocess, sys

REQUIRED = {
    "blog": ["OPENAI_API_KEY"],
    "social": ["META_PAGE_ID", "META_PAGE_ACCESS_TOKEN", "IG_USER_ID",
               "GBP_CLIENT_ID", "GBP_CLIENT_SECRET", "GBP_REFRESH_TOKEN", "GBP_ACCOUNT", "GBP_LOCATION"],
}


def main() -> int:
    job = sys.argv[1] if len(sys.argv) > 1 else ""
    if job not in REQUIRED:
        print("usage: python3 cloud/bootstrap.py blog|social"); return 2
    missing = [v for v in REQUIRED[job] if not os.environ.get(v)]
    if job == "blog":
        try:
            import PIL  # noqa: F401
        except ImportError:
            subprocess.run([sys.executable, "-m", "pip", "install", "-q", "pillow", "--break-system-packages"], check=False)
        if not shutil.which("tesseract"):
            subprocess.run("(apt-get update -qq && apt-get install -y -qq tesseract-ocr) >/dev/null 2>&1 || "
                           "(sudo apt-get update -qq && sudo apt-get install -y -qq tesseract-ocr) >/dev/null 2>&1", shell=True)
        print(f"tesseract: {'ok' if shutil.which('tesseract') else 'MISSING'}")
    print(f"{job} secrets present: {len(REQUIRED[job]) - len(missing)}  missing: {', '.join(missing) or 'none'}")
    return 1 if missing else 0


if __name__ == "__main__":
    raise SystemExit(main())
