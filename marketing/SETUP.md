# 305 Doors marketing automation: setup

Two cloud routines run on Monday, Wednesday and Friday (America/New_York):

| Routine | Time | What it does | Plan |
| --- | --- | --- | --- |
| 305 Doors blog (Mon/Wed/Fri) | 9:00 AM | Writes, reviews and publishes one post to `content/blog/`, pushes to `main`, waits for Vercel | `marketing/blog/blog-plan.md` |
| 305 Doors social (Mon/Wed/Fri) | 11:00 AM | Posts about the day's article to Facebook, Instagram and Google Business Profile | `marketing/social/publishing-plan.md` |

Both run in the "305 Doors marketing" cloud environment, which holds the keys below. Nothing is shared with the
other marketing routines.

## 1. OpenAI key (blog images)

Create an API key at https://platform.openai.com/api-keys. Variable: `OPENAI_API_KEY`.

## 2. Facebook Page and Instagram

1. In the Instagram app, switch the 305 Doors account to a Business account and link it to the 305 Doors
   Facebook Page (Page settings > Linked accounts > Instagram).
2. At https://developers.facebook.com create an app (type Business) named for 305 Doors. Note its App ID and App Secret.
3. In Graph API Explorer (https://developers.facebook.com/tools/explorer), pick that app, click "Get User Access
   Token" and grant `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`, `instagram_basic`,
   `instagram_content_publish`, `business_management`. Sign in as someone who manages the 305 Doors Page.
4. In `marketing/.env` on your Mac add `META_APP_ID=…`, `META_APP_SECRET=…`, `META_USER_TOKEN=<token from step 3>`.
5. Run `python3 marketing/social/meta_token.py`. It writes `META_PAGE_ID`, `META_PAGE_ACCESS_TOKEN` and
   `IG_USER_ID` into `marketing/.env` without printing them. Then delete `META_USER_TOKEN` from the file.
6. Check: `python3 marketing/social/facebook_publish.py preflight` and `python3 marketing/social/instagram_publish.py preflight`.

The app can stay in development mode: admins of the app may post to Pages they manage without App Review.

## 3. Google Business Profile

1. In Google Cloud Console create a project for 305 Doors and enable "My Business Account Management API",
   "My Business Business Information API" and "Google My Business API".
2. Request Business Profile API access for that project:
   https://developers.google.com/my-business/content/prereqs (Google reviews the request; posting fails until approved).
3. Configure the OAuth consent screen (External, publish it to production) and create an OAuth client of type
   "Desktop app". Add `GBP_CLIENT_ID` and `GBP_CLIENT_SECRET` to `marketing/.env`.
4. Run `python3 marketing/social/gbp_oauth.py login` and sign in with the Google account that manages the
   305 Doors profile. It saves `GBP_REFRESH_TOKEN` to `marketing/.env`.
5. Run `python3 marketing/social/gbp_oauth.py locations` and add the 305 Doors `GBP_ACCOUNT` (accounts/…) and
   `GBP_LOCATION` (locations/…) to `marketing/.env`.
6. Check: `python3 marketing/social/gbp_publish.py preflight`.

## 4. Cloud environment

At https://claude.ai/code create an environment named "305 Doors marketing":

- Network access: allow at least `api.openai.com`, `graph.facebook.com`, `oauth2.googleapis.com`,
  `mybusiness.googleapis.com`, `305doors.com` and `pypi.org` (or use full access).
- Environment variables: `OPENAI_API_KEY`, `META_PAGE_ID`, `META_PAGE_ACCESS_TOKEN`, `IG_USER_ID`,
  `GBP_CLIENT_ID`, `GBP_CLIENT_SECRET`, `GBP_REFRESH_TOKEN`, `GBP_ACCOUNT`, `GBP_LOCATION`
  (copy the values from `marketing/.env`; optional `META_GRAPH_API_VERSION`, `IMAGE_MODEL`).

`python3 cloud/bootstrap.py blog|social` lists any variable the environment is missing at the start of each run.

## Run records

Each run commits its ledgers, briefs, manifests and reports under `marketing/runs/` to `main`. The ledgers stop a
second post on the same day; never delete them.
