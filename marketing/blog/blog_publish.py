#!/usr/bin/env python3
"""Mon/Wed/Fri blog publisher for 305doors.com (Next.js, markdown posts, Vercel deploy from main).

Run from the repository root:  python3 marketing/blog/blog_publish.py <command>

Commands
  preflight                       repo/git/credential/site readiness (never prints credential values)
  inventory                       list existing posts + live sitemap; caches marketing/runs/blog/inventory.json
  image --slug S --prompt P       generate public/images/305doors/blog/S-featured.jpg (text-free, 1600x900 JPEG)
  mark-visual-review IMG --notes N  record that a human/agent looked at the image
  check BRIEF                     read-only quality gate; nonzero exit on any problem
  publish BRIEF [--allow-any-day] re-check, ledger, write md, commit, push to main, verify live
  verify --date D [--wait SECS]   read-only live check of a ledgered post; updates the ledger
  status --date D                 read-only JSON for the social routine

A durable ledger (marketing/runs/blog/<date>.ledger.json) is written before the non-idempotent git push.
An uncertain push is never retried blindly: the remote is inspected first.
"""
from __future__ import annotations

import argparse
import base64
import fcntl
import html
import json
import os
import re
import shutil
import struct
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import config  # noqa: E402  (shared contract: marketing/config.py)

ROOT: Path = config.ROOT
SITE: str = config.SITE
TZ: str = config.TZ
BLOG_RUNS: Path = config.RUNS / "blog"
POSTS_DIR_REL = "content/blog"
IMAGES_DIR_REL = "public/images/305doors/blog"
PUBLISH_DAYS = (0, 2, 4)  # Mon, Wed, Fri
UA = "Mozilla/5.0 (compatible; 305DoorsBlogBot/1.0; +https://305doors.com)"
STOP = set("a an and are as at be by can do does for from how i in is it its my of on or our should the to what "
           "when where which who why will with you your vs versus guide florida fl".split())
BLOCKING_STATES = {"committing", "committed", "pushing", "push_uncertain", "push_failed", "pushed", "live",
                   "verify_failed"}


class PublishError(Exception):
    pass


# ----------------------------------------------------------------- helpers

def now_local() -> datetime:
    return datetime.now(ZoneInfo(TZ))


def words(s: str) -> list[str]:
    return re.findall(r"[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*", s)


def stem(w: str) -> str:
    w = w.lower().replace("’", "'").removesuffix("'s")
    for suf in ("ations", "ation", "ings", "ing", "ies", "ed", "es", "s"):
        if len(w) > len(suf) + 3 and w.endswith(suf):
            return w[: -len(suf)] + ("y" if suf == "ies" else "")
    return w


def tokens(s: str) -> set[str]:
    return {stem(w) for w in words(s.replace("-", " ")) if w.lower() not in STOP and len(w) > 1}


def jaccard(a: set, b: set) -> float:
    return len(a & b) / len(a | b) if a and b else 0.0


def write_json(path: Path, value) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    os.replace(tmp, path)


def read_json(path: Path, default=None):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return default


def http_get(url: str, timeout: int = 30) -> tuple[int, str]:
    """Return (status, body). Status 0 means the request could not be made."""
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as exc:
        return exc.code, ""
    except Exception:
        return 0, ""


def git(*args: str, check: bool = True, timeout: int = 180) -> subprocess.CompletedProcess:
    r = subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True, timeout=timeout)
    if check and r.returncode != 0:
        raise PublishError(f"git {args[0]} failed: {(r.stderr or r.stdout).strip()[:400]}")
    return r


def norm_path(url: str) -> str | None:
    """Site-relative path with trailing slash, or None when the URL is external / not a page link."""
    if url.startswith(("#", "mailto:", "tel:")):
        return None
    u = urllib.parse.urlsplit(url)
    if u.scheme or u.netloc:
        host = u.netloc.lower().removeprefix("www.")
        if host != urllib.parse.urlsplit(SITE).netloc.lower().removeprefix("www."):
            return None
    p = u.path or "/"
    return p if p.endswith("/") else p + "/"


# ----------------------------------------------------------- markdown/posts

def split_frontmatter(text: str) -> tuple[dict, str]:
    m = re.match(r"---\r?\n(.*?)\r?\n---\r?\n?(.*)", text, re.S)
    if not m:
        return {}, text
    fm: dict[str, str] = {}
    for line in m.group(1).splitlines():
        k, sep, v = line.partition(":")
        if not sep or line.startswith((" ", "\t")):
            continue
        v = v.strip()
        if len(v) >= 2 and v[0] == v[-1] == "'":
            v = v[1:-1].replace("''", "'")
        elif len(v) >= 2 and v[0] == v[-1] == '"':
            try:
                v = json.loads(v)
            except ValueError:
                v = v[1:-1]
        fm[k.strip()] = v
    return fm, m.group(2)


def body_headings(body: str, level: int = 2) -> list[str]:
    return [m.group(1).strip() for m in re.finditer(rf"(?m)^{'#' * level}\s+(.+?)\s*#*\s*$", body)]


def plain_text(body: str) -> str:
    t = re.sub(r"(?s)```.*?```", " ", body)
    t = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", t)
    t = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", t)
    t = re.sub(r"(?m)^\s{0,3}#{1,6}\s+", "", t)
    t = re.sub(r"<[^>]+>", " ", t)
    return html.unescape(re.sub(r"[*_`>|]", " ", t))


def md_links(body: str) -> list[tuple[str, str]]:
    return [(m.group(1), m.group(2).strip()) for m in re.finditer(r"(?<!!)\[([^\]]*)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)", body)]


# ---------------------------------------------------------------- inventory

def local_posts() -> list[dict]:
    out = []
    d = ROOT / POSTS_DIR_REL
    for f in sorted(d.glob("*.md")) if d.exists() else []:
        fm, body = split_frontmatter(f.read_text(encoding="utf-8"))
        out.append({"slug": f.stem, "title": fm.get("title", ""), "description": fm.get("description", ""),
                    "date": fm.get("date", ""), "headings": body_headings(body)})
    return out


def repo_routes() -> list[str]:
    """Routes defined in the repo: static pages, services, locations, posts."""
    routes = {"/", "/blog/"}

    def block(rel: str, name: str) -> list[str]:
        try:
            text = (ROOT / rel).read_text(encoding="utf-8")
        except OSError:
            return []
        m = re.search(rf"{name}\s*=\s*\[(.*?)\]\s*as const", text, re.S)
        return re.findall(r"'([a-z0-9-]+)'", m.group(1)) if m else []

    for s in block("src/lib/servicePages.ts", "SERVICE_PAGE_SLUGS"):
        routes.add(f"/services/{s}/")
    loc = "src/lib/locationPages.ts"
    for name in ("COUNTY_PAGE_SLUGS", "CITY_PAGE_SLUGS"):
        for s in block(loc, name):
            routes.add(f"/{s}/")
    try:
        loc_text = (ROOT / loc).read_text(encoding="utf-8")
        for name in re.findall(r"const (\w+_CITY_SLUGS) = \[", loc_text):
            for s in block(loc, name):
                routes.add(f"/{s}/")
    except OSError:
        pass
    for p in local_posts():
        routes.add(f"/blog/{p['slug']}/")
    return sorted(routes)


def fetch_sitemap() -> list[str]:
    status, body = http_get(f"{SITE}/sitemap.xml")
    if status != 200:
        raise PublishError(f"sitemap fetch failed (HTTP {status})")
    return sorted(set(re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", body)))


def build_inventory(write: bool = True) -> dict:
    cache = BLOG_RUNS / "inventory.json"
    stale = False
    try:
        sitemap = fetch_sitemap()
    except PublishError:
        old = read_json(cache)
        if not old:
            raise
        sitemap, stale = old.get("sitemap_urls", []), True
    inv = {"fetched_at": datetime.now(timezone.utc).isoformat(), "sitemap_stale": stale,
           "posts": local_posts(), "sitemap_urls": sitemap, "repo_routes": repo_routes()}
    if write:
        write_json(cache, inv)
    return inv


def known_paths(inv: dict) -> set[str]:
    paths = {p for p in (norm_path(u) for u in inv.get("sitemap_urls", [])) if p}
    return paths | set(inv.get("repo_routes", []))


def blog_slugs_from_inventory(inv: dict) -> set[str]:
    slugs = {p["slug"] for p in inv.get("posts", [])}
    for u in inv.get("sitemap_urls", []):
        m = re.search(r"/blog/([^/]+)/?$", u)
        if m:
            slugs.add(m.group(1))
    return slugs


# -------------------------------------------------------------- competition

def competition(brief: dict, inv: dict) -> dict:
    kw = tokens(brief["primary_keyword"])
    title = tokens(brief["title"])
    slug = brief["slug"].strip("/")
    blocks, warns = [], []
    for it in inv.get("posts", []):
        it_title = tokens(it["title"]) | tokens(it["slug"])
        cover = len(kw & it_title) / len(kw) if kw else 0
        tsim = jaccard(title, tokens(it["title"]))
        head_hit = any(kw and kw <= tokens(h) for h in it.get("headings", []))
        ref = {"slug": it["slug"], "title": it["title"], "keyword_coverage": round(cover, 2),
               "title_similarity": round(tsim, 2)}
        if it["slug"] == slug:
            blocks.append(dict(ref, reason="slug already used"))
        elif cover >= 0.999 or tsim >= 0.6:
            blocks.append(dict(ref, reason="existing post already targets this keyword/title"))
        elif cover >= 0.66 or tsim >= 0.4 or head_hit:
            warns.append(dict(ref, reason="overlapping intent; differentiation must name it"))
    diff = (brief.get("differentiation") or "").lower()
    undiff = [w for w in warns if w["slug"].lower() not in diff]
    warns.sort(key=lambda w: -(w["keyword_coverage"] + w["title_similarity"]))
    return {"blocks": blocks, "warnings": warns[:15], "undifferentiated": undiff[:15]}


# ------------------------------------------------------------------- image

def jpeg_size(path: Path) -> tuple[int, int]:
    data = path.read_bytes()
    if data[:2] != b"\xff\xd8":
        raise ValueError("featured image must be JPEG")
    i = 2
    while i + 9 < len(data):
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        if marker in (0xC0, 0xC1, 0xC2):
            h, w = struct.unpack(">HH", data[i + 5:i + 9])
            return w, h
        if marker in (0xD8, 0x01) or 0xD0 <= marker <= 0xD7:
            i += 2
            continue
        i += 2 + struct.unpack(">H", data[i + 2:i + 4])[0]
    raise ValueError("could not read JPEG dimensions")


def image_paths(slug: str) -> tuple[Path, Path, Path]:
    """(jpeg in public/, sidecar metadata, raw source png) — only the jpeg is meant for git."""
    jpg = ROOT / IMAGES_DIR_REL / f"{slug}-featured.jpg"
    return jpg, BLOG_RUNS / "images" / f"{slug}-featured.json", BLOG_RUNS / "images" / f"{slug}-featured.source.png"


NO_TEXT = (" Photorealistic editorial photograph, natural light, 16:9 landscape. Absolutely no text, words, letters, "
           "numbers, signage, labels, license plates, logos, watermarks, brand marks, or screens with writing.")


def to_jpeg(src: Path, out: Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    try:
        from PIL import Image, ImageOps  # type: ignore
        with Image.open(src) as im:
            ImageOps.fit(im.convert("RGB"), (1600, 900), Image.Resampling.LANCZOS).save(
                out, "JPEG", quality=85, optimize=True, progressive=True)
        return
    except ImportError:
        pass
    if shutil.which("sips"):  # macOS: crop to 16:9 first so the image is not squashed
        w, h = struct.unpack(">II", src.read_bytes()[16:24])
        ch = min(h, w * 9 // 16)
        tmp = out.with_suffix(".crop.png")
        subprocess.run(["sips", "-c", str(ch), str(w), str(src), "--out", str(tmp)], check=True, capture_output=True)
        subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "85", "-z", "900", "1600",
                        str(tmp), "--out", str(out)], check=True, capture_output=True)
        tmp.unlink(missing_ok=True)
    elif shutil.which("convert"):
        subprocess.run(["convert", str(src), "-resize", "1600x900^", "-gravity", "center", "-extent", "1600x900",
                        "-quality", "85", str(out)], check=True, capture_output=True)
    else:
        raise PublishError("install Pillow (pip install pillow) to convert images")


def ocr_words(path: Path) -> list[str] | None:
    """Readable words found by Tesseract, or None when OCR is unavailable."""
    if not shutil.which("tesseract"):
        return None
    found = []
    for psm in ("11", "3"):
        r = subprocess.run(["tesseract", str(path), "stdout", "--psm", psm, "tsv"], capture_output=True, text=True)
        for line in r.stdout.splitlines()[1:]:
            cols = line.split("\t")
            if len(cols) == 12 and cols[11].strip():
                try:
                    conf = float(cols[10])
                except ValueError:
                    continue
                w = re.sub(r"[^A-Za-z]", "", cols[11])
                if conf >= 60 and len(w) >= 3:
                    found.append(cols[11].strip())
    return sorted(set(found))


def generate_image(slug: str, prompt: str) -> dict:
    from_cfg = config.get
    key = from_cfg("OPENAI_API_KEY")
    if not key:
        raise PublishError("OPENAI_API_KEY missing")
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
        raise PublishError("slug must be lowercase-hyphenated")
    model = from_cfg("IMAGE_MODEL", "gpt-image-1")
    full = prompt.strip() + NO_TEXT
    body = {"model": model, "prompt": full, "size": "1536x1024", "n": 1}
    req = urllib.request.Request("https://api.openai.com/v1/images/generations", data=json.dumps(body).encode(),
                                 headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
                                 method="POST")
    try:
        with urllib.request.urlopen(req, timeout=240) as r:
            raw = base64.b64decode(json.loads(r.read())["data"][0]["b64_json"])
    except urllib.error.HTTPError as exc:
        raise PublishError(f"image generation failed (HTTP {exc.code})") from None
    except Exception:
        raise PublishError("image generation failed or timed out") from None
    jpg, sidecar, src = image_paths(slug)
    src.parent.mkdir(parents=True, exist_ok=True)
    src.write_bytes(raw)
    to_jpeg(src, jpg)
    ocr = ocr_words(jpg)
    meta = {"slug": slug, "model": model, "prompt": full, "created_at": datetime.now(timezone.utc).isoformat(),
            "image": str(jpg.relative_to(ROOT)), "ocr_available": ocr is not None, "ocr_words": ocr or [],
            "no_text_ocr": ocr is not None and not ocr, "visual_review": False}
    write_json(sidecar, meta)
    return meta


# -------------------------------------------------------------------- check

REQUIRED = ("date", "primary_keyword", "secondary_keywords", "title", "slug", "description", "content_file",
            "image_file", "image_alt", "image_prompt", "differentiation", "sources", "review")


def read_content(brief: dict) -> str:
    p = ROOT / brief["content_file"]
    if not p.is_file():
        raise PublishError(f"content_file not found: {brief['content_file']}")
    return p.read_text(encoding="utf-8")


def banned_patterns() -> list[str]:
    prof = read_json(Path(__file__).resolve().parent / "site-profile.json", {})
    return prof.get("banned_patterns", [])


def check_brief(brief: dict, inv: dict, banned: list[str] | None = None) -> dict:
    errs: list[str] = []
    missing = [f for f in REQUIRED
               if f not in brief or (brief[f] in (None, "", []) and f != "secondary_keywords")]
    if missing:
        return {"passed": False, "problems": [f"missing brief fields: {', '.join(missing)}"], "warnings": [],
                "word_count": 0, "internal_links": [], "competition": {}}
    kw = brief["primary_keyword"].strip()
    kwt = tokens(kw)
    has_kw = lambda s: bool(kwt) and kwt <= tokens(s)  # noqa: E731
    slug = brief["slug"]
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug) or len(slug) > 75:
        errs.append("slug must be lowercase-hyphenated and <= 75 chars")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(brief["date"])):
        errs.append("date must be YYYY-MM-DD")
    if len(brief["title"]) > 65:
        errs.append(f"title {len(brief['title'])} chars > 65")
    if not has_kw(brief["title"]):
        errs.append("primary keyword missing from title")
    mt = brief.get("meta_title")
    if mt and (len(mt) > 65 or not has_kw(mt)):
        errs.append("meta_title must be <= 65 chars and include the primary keyword")
    if not 120 <= len(brief["description"]) <= 158:
        errs.append(f"description {len(brief['description'])} chars outside 120-158")
    if not isinstance(brief["secondary_keywords"], list):
        errs.append("secondary_keywords must be a list")
    if not isinstance(brief["sources"], list) or not brief["sources"]:
        errs.append("sources must list at least one https URL")
    else:
        errs += [f"source not https: {s}" for s in brief["sources"] if not str(s).startswith("https://")]
    if slug in blog_slugs_from_inventory(inv):
        errs.append(f"slug already used: {slug}")
    if len(brief["image_alt"]) > 200:
        errs.append("image_alt over 200 chars")

    # --- body
    try:
        content = read_content(brief)
    except PublishError as exc:
        return {"passed": False, "problems": errs + [str(exc)], "warnings": [], "word_count": 0,
                "internal_links": [], "competition": {}}
    if content.lstrip().startswith("---"):
        errs.append("content_file must be the body only (no frontmatter)")
    text = plain_text(content)
    wc = len(words(text))
    if not 1000 <= wc <= 1800:
        errs.append(f"word count {wc} outside 1000-1800")
    if re.search(r"(?m)^#\s", content):
        errs.append("content must not contain an H1 (the title is the H1)")
    h2s = body_headings(content)
    if len(h2s) < 4:
        errs.append(f"needs at least 4 H2 sections, found {len(h2s)}")
    if not any(re.search(r"(?i)\bFAQ\b|frequently asked|common questions|questions", h) for h in h2s):
        errs.append("needs an FAQ section (an H2 containing FAQ / Frequently Asked / Questions)")
    if not has_kw(" ".join(words(text)[:150])):
        errs.append("primary keyword missing from first 150 words")
    phrase = " ".join(words(kw.lower()))
    occ = len(re.findall(re.escape(phrase), " ".join(words(text.lower())))) if phrase else 0
    if wc and occ * max(1, len(phrase.split())) / wc > 0.03:
        errs.append(f"keyword stuffing: exact phrase appears {occ} times in {wc} words")
    for pat in (banned if banned is not None else banned_patterns()):
        m = re.search(pat, text + " " + brief["title"] + " " + brief["description"], re.I)
        if m:
            errs.append(f"banned claim pattern matched: {m.group(0)!r}")

    # --- links
    paths = known_paths(inv)
    internal, svc = [], False
    for anchor, url in md_links(content):
        if url.startswith("http://"):
            errs.append(f"non-https link: {url}")
            continue
        p = norm_path(url)
        if p is None:
            continue
        if not anchor.strip() or anchor.strip().lower() in ("click here", "here", "read more", "link"):
            errs.append(f"weak anchor text for {url}")
        internal.append(p)
        if p not in paths:
            errs.append(f"internal link does not resolve to a live page: {url}")
        if p.startswith("/services/") and p != "/services/":
            svc = True
    if not 3 <= len(internal) <= 6:
        errs.append(f"needs 3-6 internal links, found {len(internal)}")
    if not svc:
        errs.append("needs at least one internal link to a /services/ page")

    # --- competition
    comp = competition(brief, inv)
    for b in comp["blocks"]:
        errs.append(f"overlap blocked by {b['slug']}: {b['reason']}")
    if comp["undifferentiated"]:
        errs.append("differentiation must name overlapping posts: " +
                    ", ".join(w["slug"] for w in comp["undifferentiated"]))
    if len((brief.get("differentiation") or "").strip()) < 20:
        errs.append("differentiation note required")

    # --- image
    errs += check_image(brief)

    # --- review
    rv = brief.get("review") or {}
    if rv.get("approved") is not True or not str(rv.get("notes", "")).strip():
        errs.append("review.approved must be true with reviewer notes")
    return {"passed": not errs, "problems": errs, "warnings": comp["warnings"], "word_count": wc,
            "internal_links": internal, "competition": comp}


def check_image(brief: dict) -> list[str]:
    slug = brief["slug"]
    jpg, sidecar, _ = image_paths(slug)
    expect = f"{IMAGES_DIR_REL}/{slug}-featured.jpg"
    errs = []
    if brief["image_file"] != expect:
        errs.append(f"image_file must be {expect}")
    if not jpg.is_file():
        return errs + [f"image missing: {expect}"]
    try:
        size = jpeg_size(jpg)
        if size != (1600, 900):
            errs.append(f"image is {size[0]}x{size[1]}, expected 1600x900")
    except ValueError as exc:
        errs.append(str(exc))
    meta = read_json(sidecar)
    if not meta:
        return errs + ["image metadata sidecar missing (generate with the image command)"]
    if meta.get("ocr_words"):
        errs.append(f"image OCR found text: {meta['ocr_words'][:5]}")
    elif not meta.get("no_text_ocr") and meta.get("ocr_available", True):
        errs.append("image OCR result missing")
    if not meta.get("visual_review") or not str(meta.get("visual_notes", "")).strip():
        errs.append("image visual review not recorded (mark-visual-review)")
    return errs


# ------------------------------------------------------------------- ledger

def ledger_path(day: str) -> Path:
    return BLOG_RUNS / f"{day}.ledger.json"


def day_guard(brief_date: str, allow_any_day: bool, now: datetime | None = None) -> None:
    now = now or now_local()
    if allow_any_day:
        return
    if now.weekday() not in PUBLISH_DAYS:
        raise PublishError(f"publish runs Mon/Wed/Fri only; today is {now.strftime('%A')} ({TZ})")
    if brief_date != now.strftime("%Y-%m-%d"):
        raise PublishError(f"brief date {brief_date} is not today ({now.strftime('%Y-%m-%d')}); no catch-up")


def post_url(slug: str) -> str:
    return f"{SITE}/blog/{slug}/"


def live_ok(slug: str, title: str) -> bool:
    status, body = http_get(post_url(slug) + f"?nocache={int(time.time())}")
    if status != 200:
        return False
    norm = lambda s: re.sub(r"\s+", " ", html.unescape(s)).replace("’", "'").strip()  # noqa: E731
    return norm(title) in norm(body)


def frontmatter(brief: dict) -> str:
    q = lambda s: json.dumps(s, ensure_ascii=False)  # noqa: E731  (JSON strings are valid YAML)
    lines = ["---", f"title: {q(brief['title'])}"]
    if brief.get("meta_title"):
        lines.append(f"metaTitle: {q(brief['meta_title'])}")
    lines += [f"description: {q(brief['description'])}", f"date: '{brief['date']}'",
              f"image: /images/305doors/blog/{brief['slug']}-featured.jpg", f"imageAlt: {q(brief['image_alt'])}", "---", ""]
    return "\n".join(lines)


def locked():
    BLOG_RUNS.mkdir(parents=True, exist_ok=True)
    fh = (BLOG_RUNS / ".publisher.lock").open("a+")
    fcntl.flock(fh.fileno(), fcntl.LOCK_EX)
    return fh


def landed(sha: str) -> bool | None:
    """True/False if the commit is/isn't on origin/main; None if the remote cannot be inspected."""
    if git("fetch", "origin", "main", check=False, timeout=120).returncode != 0:
        return None
    return git("merge-base", "--is-ancestor", sha, "origin/main", check=False).returncode == 0


def update_ledger(day: str, rec: dict, **changes) -> dict:
    rec.update(changes)
    rec["updated_at"] = datetime.now(timezone.utc).isoformat()
    write_json(ledger_path(day), rec)
    return rec


def verify_live(day: str, wait: int = 0, interval: int = 30) -> dict:
    rec = read_json(ledger_path(day))
    if not rec or "slug" not in rec:
        raise PublishError(f"no ledger for {day}")
    if rec.get("state") not in ("pushed", "live", "verify_failed"):
        return rec | {"live": False}
    deadline = time.time() + wait
    while True:
        ok = live_ok(rec["slug"], rec["title"])
        if ok or time.time() >= deadline:
            break
        time.sleep(interval)
    update_ledger(day, rec, state="live" if ok else "verify_failed", live=ok,
                  verified_at=datetime.now(timezone.utc).isoformat() if ok else rec.get("verified_at"))
    return rec


def publish(brief_path: Path, allow_any_day: bool = False, wait: int = 900) -> dict:
    brief = json.loads(brief_path.read_text(encoding="utf-8"))
    day = brief.get("date", "")
    day_guard(day, allow_any_day)
    led = read_json(ledger_path(day))
    if led and led.get("state") in BLOCKING_STATES:
        raise PublishError(f"ledger for {day} shows state {led['state']!r}; refusing to publish again "
                           "(use verify; never reset ledgers)")
    inv = build_inventory(write=False)
    res = check_brief(brief, inv)
    if not res["passed"]:
        raise PublishError("check failed: " + "; ".join(res["problems"]))
    staged = git("diff", "--cached", "--name-only").stdout.split()
    if staged:
        raise PublishError(f"unrelated staged changes present: {staged[:5]}")
    slug = brief["slug"]
    md_rel = f"{POSTS_DIR_REL}/{slug}.md"
    md = ROOT / md_rel
    if md.exists():
        raise PublishError(f"{md_rel} already exists")
    jpg, sidecar, _ = image_paths(slug)
    rec = {"date": day, "slug": slug, "title": brief["title"], "description": brief["description"],
           "link": post_url(slug), "image": f"/images/305doors/blog/{slug}-featured.jpg",
           "image_alt": brief["image_alt"], "state": "committing",
           "started_at": datetime.now(timezone.utc).isoformat()}
    write_json(ledger_path(day), rec)  # durable record exists before any git write
    md.write_text(frontmatter(brief) + read_content(brief).strip() + "\n", encoding="utf-8")
    files = [md_rel, str(jpg.relative_to(ROOT)), str(ledger_path(day).relative_to(ROOT)),
             str(brief_path.resolve().relative_to(ROOT)), brief["content_file"]]
    if sidecar.exists():
        files.append(str(sidecar.relative_to(ROOT)))
    git("add", "--", *files)
    git("commit", "-m", f"Blog: {brief['title']}")
    git("pull", "--rebase", "--autostash", "origin", "main")
    sha = git("rev-parse", "HEAD").stdout.strip()
    update_ledger(day, rec, state="pushing", commit=sha)
    p = git("push", "origin", "HEAD:main", check=False)
    if p.returncode != 0:
        status = landed(sha)
        err = (p.stderr or "").lower()
        if status is None:
            update_ledger(day, rec, state="push_uncertain", error=err[-300:])
            raise PublishError("push outcome uncertain and remote unreachable; do not retry; inspect origin/main")
        if not status:
            if "rejected" in err or "fetch first" in err or "non-fast-forward" in err:
                git("pull", "--rebase", "--autostash", "origin", "main")  # definite rejection: one rebase + push
                sha = git("rev-parse", "HEAD").stdout.strip()
                update_ledger(day, rec, commit=sha)
                if git("push", "origin", "HEAD:main", check=False).returncode != 0 and not landed(sha):
                    update_ledger(day, rec, state="push_failed")
                    raise PublishError("push failed twice; commit is local only; report to a human")
            else:
                update_ledger(day, rec, state="push_uncertain", error=err[-300:])
                raise PublishError("push failed with unclear cause and commit not on origin/main; do not retry")
    update_ledger(day, rec, state="pushed", pushed_at=datetime.now(timezone.utc).isoformat())
    return verify_live(day, wait=wait)


# ------------------------------------------------------------------- status

def status(day: str) -> dict:
    rec = read_json(ledger_path(day))
    out = {"date": day, "live": False, "link": None, "title": None, "description": None, "image_url": None,
           "image_alt": None, "slug": None}
    if not rec or not rec.get("slug"):
        return out
    out.update(link=rec.get("link") or post_url(rec["slug"]), title=rec.get("title"),
               description=rec.get("description"), image_alt=rec.get("image_alt"), slug=rec["slug"])
    img = rec.get("image") or ""
    out["image_url"] = img if img.startswith("https://") else SITE + img
    out["live"] = live_ok(rec["slug"], rec["title"])
    return out


# ---------------------------------------------------------------- preflight

def preflight() -> dict:
    checks: dict[str, object] = {}
    inside = git("rev-parse", "--is-inside-work-tree", check=False).stdout.strip() == "true"
    checks["git_repo"] = inside
    if inside:
        checks["branch"] = git("rev-parse", "--abbrev-ref", "HEAD", check=False).stdout.strip()
        staged = git("diff", "--cached", "--name-only", check=False).stdout.split()
        checks["staged_files"] = staged
        checks["no_staged_changes"] = not staged
        checks["uncommitted_count"] = len(git("status", "--porcelain", check=False).stdout.splitlines())
        try:
            checks["remote_reachable"] = git("ls-remote", "origin", "HEAD", check=False, timeout=60).returncode == 0
        except subprocess.TimeoutExpired:
            checks["remote_reachable"] = False
    checks["openai_api_key"] = "present" if config.get("OPENAI_API_KEY") else "missing"
    checks["site_reachable"] = http_get(f"{SITE}/", timeout=20)[0] == 200
    checks["tesseract_available"] = bool(shutil.which("tesseract"))
    ok = (checks.get("git_repo") and checks.get("no_staged_changes") and checks.get("remote_reachable")
          and checks["openai_api_key"] == "present" and checks["site_reachable"])
    return {"ok": bool(ok), **checks}


# ---------------------------------------------------------------------- CLI

def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("preflight")
    sub.add_parser("inventory")
    a = sub.add_parser("image"); a.add_argument("--slug", required=True); a.add_argument("--prompt", required=True)
    a = sub.add_parser("mark-visual-review"); a.add_argument("image", type=Path); a.add_argument("--notes", required=True)
    a = sub.add_parser("check"); a.add_argument("brief", type=Path)
    a = sub.add_parser("publish"); a.add_argument("brief", type=Path); a.add_argument("--allow-any-day", action="store_true")
    a.add_argument("--wait", type=int, default=900)
    a = sub.add_parser("verify"); a.add_argument("--date", required=True); a.add_argument("--wait", type=int, default=0)
    a = sub.add_parser("status"); a.add_argument("--date", required=True)
    args = ap.parse_args(argv)
    try:
        if args.cmd == "preflight":
            res = preflight()
            print(json.dumps(res, indent=2))
            return 0 if res["ok"] else 1
        if args.cmd == "inventory":
            inv = build_inventory()
            print(json.dumps(inv, indent=2, ensure_ascii=False))
            return 0
        if args.cmd == "image":
            meta = generate_image(args.slug, args.prompt)
            print(json.dumps({k: meta[k] for k in ("image", "ocr_available", "no_text_ocr", "ocr_words")}))
            if not meta["ocr_available"]:
                print("warning: tesseract not installed; OCR skipped, visual review is the only text guard", file=sys.stderr)
            return 2 if meta["ocr_words"] else 0
        if args.cmd == "mark-visual-review":
            m = re.search(r"([a-z0-9-]+)-featured\.jpg$", args.image.name)
            if not m:
                raise PublishError("image must be named <slug>-featured.jpg")
            side = image_paths(m.group(1))[1]
            meta = read_json(side)
            if not meta:
                raise PublishError("no metadata sidecar; generate the image first")
            meta.update(visual_review=True, visual_notes=args.notes)
            write_json(side, meta)
            print("recorded")
            return 0
        if args.cmd == "status":
            print(json.dumps(status(args.date)))
            return 0
        if args.cmd == "check":
            brief = json.loads(args.brief.read_text(encoding="utf-8"))
            res = check_brief(brief, build_inventory(write=False))
            print(json.dumps(res, indent=2, ensure_ascii=False))
            return 0 if res["passed"] else 2
        lock = locked()
        try:
            if args.cmd == "publish":
                res = publish(args.brief, args.allow_any_day, args.wait)
            else:
                res = verify_live(args.date, args.wait)
            print(json.dumps(res, indent=2))
            return 0 if res.get("state") == "live" else 1
        finally:
            lock.close()
    except Exception as exc:  # noqa: BLE001 - CLI boundary: report cleanly, never a traceback
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
