# 305 Doors blog routine - operating plan

One new post on **Monday, Wednesday and Friday** (America/New_York), published to https://305doors.com/blog/.
Working directory: the repository root. Tool: `python3 marketing/blog/blog_publish.py <command>`.
Credentials come from the environment (`OPENAI_API_KEY`, optional `IMAGE_MODEL`) or git-ignored `marketing/.env`.
Never print, copy or commit credential values.

Posts are markdown files at `content/blog/<slug>.md`; featured images are `public/images/305doors/blog/<slug>-featured.jpg`
(JPEG 1600x900). Publishing is a commit pushed to `main`; Vercel deploys it within minutes.

## Hard rules

- Mon/Wed/Fri only, for today's date. No catch-up for missed days unless the user asks.
- Never change other site content: the run adds exactly one post, one image and run records.
- Never reset, delete or edit a ledger. If `marketing/runs/blog/<date>.ledger.json` exists, today is done: use `verify`, never `publish`.
- Never retry an uncertain push. If the ledger shows `push_uncertain` or `push_failed`, inspect `git fetch origin main` / `git log origin/main` and report.
- Never weaken a check, skip a hook, or force-push. No invented prices, guarantees, statistics, license numbers or response times (see `marketing/blog/site-profile.json` -> `banned_claims`).

## 0. Guards

1. Confirm today (America/New_York) is Mon, Wed or Fri. Otherwise stop and report "not a publish day".
2. `git pull --rebase origin main` so earlier ledgers and briefs are present, then `python3 cloud/bootstrap.py blog`
   (checks the image key and installs Pillow/Tesseract; stop and report if it lists missing keys).
3. If `marketing/runs/blog/<date>.ledger.json` exists: run `python3 marketing/blog/blog_publish.py verify --date <date>`, report, stop.
4. `python3 marketing/blog/blog_publish.py preflight` must print `"ok": true`. Fix or report any failure; do not continue past a failed preflight.

## 1. Inventory

`python3 marketing/blog/blog_publish.py inventory` lists every existing post (slug, title, description, date, H2s), the live
sitemap URLs and the repo routes; it caches `marketing/runs/blog/inventory.json`. Read titles and headings before choosing a topic.
Read earlier `marketing/runs/blog/*.brief.json` files for recent pillars and keywords.

## 2. Topic that does not compete

Read `marketing/blog/site-profile.json` (positioning, pillars, voice, CTA, banned claims, priority links).
Pick one **primary keyword**: a specific long-tail search a Miami-area homeowner or property manager would make, in a pillar that is not
one of the two most recent briefs' pillars. It must not already be targeted by an existing post's title, slug or H2. Write a
`differentiation` note that names the slug of every overlapping post and explains how this post's intent differs (required even
if nothing overlaps; `check` blocks unaddressed overlaps).

## 3. Research and write

- Use current official sources for any factual claim about Florida code, Miami-Dade product approval, hurricanes, insurance or safety;
  link one to three as `https://` external links and list them in `sources`. If a fact cannot be supported, leave it out.
- Write original, people-first markdown in the voice of `content/blog/*.md`: 1,000-1,800 words, **no H1**, at least four `##` sections
  (one with the primary keyword), a practical checklist or steps section, an FAQ section (`## ... FAQ` or `## Frequently Asked Questions`,
  three to five questions), and a closing call to action per the profile.
- Primary keyword in the first 150 words, used naturally. No keyword stuffing.
- **Internal links:** 3-6 contextual markdown links with descriptive anchor text, relative paths such as `[garage door repair](/services/garage-door-repair/)`.
  Every link must exist in the inventory (`repo_routes` or the live sitemap). At least one must be a `/services/` page.
- Save the body only (no frontmatter) to `marketing/runs/blog/<date>.md`.

## 4. Brief

Save `marketing/runs/blog/<date>.brief.json`:

```json
{
  "date": "YYYY-MM-DD",
  "primary_keyword": "...",
  "secondary_keywords": ["..."],
  "title": "... (<= 65 chars, includes the primary keyword)",
  "slug": "keyword-led-lowercase-slug",
  "meta_title": "optional, <= 65 chars, includes the keyword (becomes metaTitle)",
  "description": "120-158 chars, includes the keyword, gives a reason to read",
  "content_file": "marketing/runs/blog/<date>.md",
  "image_file": "public/images/305doors/blog/<slug>-featured.jpg",
  "image_alt": "descriptive alt text",
  "image_prompt": "the scene prompt used",
  "differentiation": "names overlapping slugs and how this post differs",
  "sources": ["https://official-source..."],
  "review": {"approved": false, "notes": ""}
}
```

The tool writes the post file with frontmatter `title`, optional `metaTitle`, `description`, `date`, `image`, `imageAlt`.

## 5. Featured image (related to the post, no text)

```
python3 marketing/blog/blog_publish.py image --slug <slug> --prompt "<concrete scene>"
```

Describe a realistic Miami-area scene tied to the topic (a residential garage door at dusk, a technician adjusting torsion springs,
a hurricane-rated door on a coastal home). Avoid signs, vehicle lettering, screens and papers: models tend to render text on them.
The tool appends a strict no-text instruction, converts to a 1600x900 JPEG at `public/images/305doors/blog/<slug>-featured.jpg`, writes
its metadata sidecar under `marketing/runs/blog/images/` (never in `public/`), keeps the raw `.source.png` out of git and OCR-checks the result.
Exit code 2 means text was detected: change the scene and regenerate (at most three attempts). If Tesseract is not installed, OCR is skipped
and the visual review below is the only text guard.

**Open the JPEG with Read and look at it.** Confirm no letters, numbers, logos or signage, that it fits the topic, and that it looks natural
(plausible hands, doors, buildings). Then:

```
python3 marketing/blog/blog_publish.py mark-visual-review public/images/305doors/blog/<slug>-featured.jpg --notes "<what you checked>"
```

## 6. Independent review

Spawn a subagent with no drafting context. Give it the paths of the brief, the body, `marketing/blog/site-profile.json` and
`marketing/runs/blog/inventory.json`. It returns PASS or required fixes covering: factual support and sources, originality versus existing posts,
banned claims, natural internal links, readability and voice, the CTA. Apply the fixes. Set `review.approved` to `true` and record the
reviewer's notes only after a PASS.

## 7. Check and publish

```
python3 marketing/blog/blog_publish.py check marketing/runs/blog/<date>.brief.json
python3 marketing/blog/blog_publish.py publish marketing/runs/blog/<date>.brief.json
```

`check` is read-only and prints JSON with `problems`. Revise and re-check (at most two revision rounds). If it still fails, do not publish;
report the remaining problems. `publish` re-runs the check, enforces the day guard (`--allow-any-day` exists for tests only; do not use it),
writes the ledger before the push, writes the post, commits `Blog: <title>`, pulls with rebase, pushes `HEAD:main`, then polls the live URL
(every 30 s, up to 15 minutes) for HTTP 200 plus the title.

- `pushed` + `verify_failed`: run `verify --date <date> --wait 600` once more, then report. Do not publish again.
- `push_uncertain` / `push_failed`: do not retry. Check whether the commit reached `origin/main`, record what you find, report.

## 8. Save run records and report

Write `marketing/runs/blog/<date>-report.md`: primary keyword, title, live URL, word count, internal links, sources, overlap warnings and how
they were handled, image prompt and review notes, reviewer verdict, blockers. Then commit and push the records so the next run's duplicate
protection and topic history (and the social routine's `status`) are current:

```
cloud/save_run.sh blog
```

`save_run.sh` stages `marketing/runs/`, refuses to commit credential files, and pushes to `main`. `inventory.json`, `.source.png` files and `marketing/.env` are git-ignored.

## Status for the social routine

`python3 marketing/blog/blog_publish.py status --date <date>` prints
`{"date","live","link","title","description","image_url","image_alt","slug"}`. `live` is true only when the ledger exists and the live URL
returns 200 containing the title. It is read-only.
