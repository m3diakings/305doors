"""Shared settings loader for the 305 Doors marketing automation.

Values come from the process environment (cloud runs) or, for local runs, from the
git-ignored file marketing/.env (KEY=VALUE lines). The environment wins. Never print values.
"""
from __future__ import annotations

import os
from pathlib import Path

MARKETING = Path(__file__).resolve().parent
ROOT = MARKETING.parent
RUNS = MARKETING / "runs"
SITE = "https://305doors.com"
TZ = "America/New_York"


def load() -> dict[str, str]:
    values: dict[str, str] = {}
    env_file = MARKETING / ".env"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, val = line.partition("=")
                values[key.strip()] = val.strip().strip('"').strip("'")
    values.update({k: v for k, v in os.environ.items() if v})
    return values


def get(key: str, default: str = "") -> str:
    return load().get(key, default)
