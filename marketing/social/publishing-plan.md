# Social publishing operating plan (305 Doors)

## Scope and cadence

One original post per channel (Facebook Page, Instagram business account, Google Business Profile) after each
day's blog post goes live. Runs on Monday, Wednesday and Friday only, for today's America/New_York date
(`TZ` in `marketing/config.py`). If today is not Mon/Wed/Fri, or the day's social ledgers already exist, stop and
report. There is no catch-up for missed days.

All commands run from the repo root. Credentials come from environment variables (cloud) or the git-ignored
`marketing/.env` (local). Never print, copy into reports, or commit credential values.

## Run sequence

1. `git pull` first, then `python3 cloud/bootstrap.py social`; it lists any missing keys (skip and report the
   channels those keys belong to).
2. Preflight each channel (prints ok, or exactly which keys are missing; a failing channel is skipped and reported):
   ```sh
   python3 marketing/social/facebook_publish.py preflight
   python3 marketing/social/instagram_publish.py preflight
   python3 marketing/social/gbp_publish.py preflight
   ```
3. Wait for the blog: `python3 marketing/blog/blog_publish.py status --date YYYY-MM-DD` prints JSON
   `{"date","live","link","title","description","image_url","image_alt","slug"}`. If `"live"` is false, re-check
   every 5 minutes for up to 40 minutes (Vercel deploy time). If it is still not live, fall back to the most
   relevant live 305doors.com service page (fetch it to confirm it loads and to validate claims). Never link a
   draft or unpublished URL.
4. Read what already went out, so nothing repeats (read-only):
   ```sh
   python3 marketing/social/facebook_publish.py recent --limit 10
   python3 marketing/social/instagram_publish.py recent --limit 10
   python3 marketing/social/gbp_publish.py recent --limit 10
   ```
   plus earlier manifests under `marketing/runs/{facebook,instagram,gbp}/`. No repeated topic, angle, opening
   line, hashtag set or call to action. Read the live article and write social-first copy that gives readers a
   reason to open it; never paste or lightly reword its text, title or meta description.
5. Draft a separate, original post for each channel (below).
6. Independent review by a separate subagent covering all three posts (below).
7. Save manifests, publish, verify (below).
8. Write `marketing/runs/social/YYYY-MM-DD-report.md`, then run `cloud/save_run.sh social` to commit and
   push the run records to `main`.

## Copy rules

Facts only from the live site and the article. Do not invent prices, discounts, guarantees, warranties, statistics,
licenses, awards, response times or service areas the site does not state. Write like a local Miami garage door
company, not an ad agency; no emoji spam (at most one or two where natural).

- Facebook: conversational, 2-5 short sentences, a concrete local hook, then the link (`link` field is attached;
  do not also paste the URL in `message`).
- Instagram: caption with its own hook, up to ~5 relevant local hashtags (for example #MiamiGarageDoors
  #GarageDoorRepair #Miami), at most 30 allowed by the publisher. Links in captions are not clickable and the
  publisher rejects `http(s)://` in captions, so end with "Link in bio" or name the site in plain text
  ("305doors.com"). Image is required (see below).
- Google Business Profile: local-search tone, 400-900 characters (hard limit 1,500), lead with the local problem
  and the service. No phone numbers, URLs, domain names, prices, guarantees or hashtags (the publisher rejects the
  first two). The link goes in the LEARN_MORE button.

## Images

Instagram requires an image: use the blog's `image_url` (absolute https JPEG on 305doors.com). If the blog is not
live or has no suitable image, skip Instagram and report it; never substitute an unrelated image. GBP uses the
same `image_url` when the blog is live and omits it otherwise. Facebook gets its preview from the link.

## Independent review

Spawn a separate subagent with only the three drafts, the live article text and these rules. It checks: claims
supported by the site, no invented prices/guarantees/statistics/licenses, original wording versus recent posts
and across channels, link on 305doors.com and live, image is the blog's own, channel-specific rules above, and
tone. It returns pass or fail with notes per post. Set `review.approved` true only for passing posts; fix and
re-review a failing post once, otherwise leave it out and report.

## Manifests

```
marketing/runs/facebook/YYYY-MM-DD-posts.json   {"date","post":{"message","link","review":{"approved","notes"}}}
marketing/runs/instagram/YYYY-MM-DD-posts.json  {"date","post":{"caption","image_url","review":{"approved","notes"}}}
marketing/runs/gbp/YYYY-MM-DD-posts.json        {"date","post":{"summary","link","image_url"?,"review":{"approved","notes"}}}
```

## Publish and verify

```sh
python3 marketing/social/facebook_publish.py publish marketing/runs/facebook/YYYY-MM-DD-posts.json
python3 marketing/social/instagram_publish.py publish marketing/runs/instagram/YYYY-MM-DD-posts.json
python3 marketing/social/gbp_publish.py publish marketing/runs/gbp/YYYY-MM-DD-posts.json
python3 marketing/social/facebook_publish.py verify --date YYYY-MM-DD   # likewise instagram / gbp
```

One channel failing never blocks the others. Each publisher validates its manifest first (approved review,
305doors.com link, Instagram https JPEG image on 305doors.com, caption/summary limits).

Safety model, shared by all three:

- A ledger `marketing/runs/<channel>/YYYY-MM-DD.ledger.json` is written durably before every non-idempotent POST
  and blocks a second publish for the same date. Never delete or edit a ledger or change the date to get around it.
- A POST is never retried. If the outcome is uncertain (timeout, no id), the ledger says `uncertain`; run
  `verify --date`, which searches the channel's recent posts for the exact text (read-only) and adopts the id if
  found. If it is not found, report it for a human; do not resubmit.
- Instagram steps: create container, poll `status_code` (12 checks, 5 s apart) until FINISHED, `media_publish`
  once, read back the permalink. A container failure or timeout happens before anything is live, so the ledger is
  marked `container_failed` and a rerun on the same day is allowed; any state after `media_publish` is attempted
  is final.
- GBP `PROCESSING` right after posting is normal; `REJECTED` is reported, not resubmitted.
- Errors never echo URLs or response bodies.

## Report

`marketing/runs/social/YYYY-MM-DD-report.md`: date, blog status and link used (or fallback page), per channel the
final copy, review result, post id/permalink or the exact blocker, and any skipped channel with the reason.

## One-time setup (owner, local, not in the cloud run)

- Meta: `python3 marketing/social/meta_token.py` (see its docstring) with `META_APP_ID`, `META_APP_SECRET`,
  `META_USER_TOKEN` in `marketing/.env`. Permissions: pages_show_list, pages_read_engagement, pages_manage_posts,
  instagram_basic, instagram_content_publish, business_management. Instagram must be a Business account linked to
  the Page. The routine needs `META_PAGE_ID`, `META_PAGE_ACCESS_TOKEN`, `IG_USER_ID`, optional
  `META_GRAPH_API_VERSION`.
- Google: add `GBP_CLIENT_ID` and `GBP_CLIENT_SECRET` (Desktop-app OAuth client; Business Profile APIs enabled and
  approved for the project), run `python3 marketing/social/gbp_oauth.py login` (writes `GBP_REFRESH_TOKEN` to
  `marketing/.env`), then `gbp_oauth.py locations` and add `GBP_ACCOUNT` and `GBP_LOCATION`.
- Copy the same keys into the cloud environment's variables.
