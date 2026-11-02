# Google APIs — Search Console, GA4, Google Ads

Programmatic access to 305 Doors' Google data through one service account.

## Credential

| | |
|---|---|
| Key file | `marketing/gcp-service-account.json` (git-ignored; never commit or print it) |
| Service account | `claude@doors-publishing.iam.gserviceaccount.com` |
| Cloud project | `doors-publishing` (also holds the Business Profile posting OAuth client) |
| Script | `gapi.py` in this folder: read-only helpers, standard library plus `cryptography` |

```bash
python3 marketing/google-apis/gapi.py check                                   # everything the account can reach
python3 marketing/google-apis/gapi.py gsc sc-domain:305doors.com 2026-10-01 2026-10-31
python3 marketing/google-apis/gapi.py ga 379587463 28
python3 marketing/google-apis/gapi.py ads 3569648608 "SELECT campaign.name, campaign.status FROM campaign"
```

## Access

| Service | Resource | Role |
|---|---|---|
| Search Console | `sc-domain:305doors.com` (also sees `sc-domain:m3diakings.com`) | Full |
| GA4 | "305 Doors - GA4", property 379587463, account "EastRooms" (also sees M3DIAKINGS, 418845306) | Editor (granted 2026-11-02; GA4 has no dry-run, so it is confirmed on the first approved edit) |
| Google Ads | 305 DOORS, customer ID 356-964-8608, no manager account | Standard |

Google Ads notes:
- API version **v26**. No `login-customer-id` header: the account has no manager.
- The account runs on **Pacific time** (America/Los_Angeles).
- Changes are allowed: a `validateOnly` budget update passed on 2026-11-02.
  `gapi.py` wraps only reads; every change follows
  [`../ads/OPERATING-RULES.md`](../ads/OPERATING-RULES.md) and is logged in
  [`../ads/CHANGELOG.md`](../ads/CHANGELOG.md).
- Billing setup approved since 2018-12-17. The API can't see whether the card
  on file is still valid.
