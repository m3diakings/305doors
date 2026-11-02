# 305 Doors Google Ads — change log

Every change to the 305 DOORS Google Ads account (356-964-8608) and to the
305doors.com pages and tracking it depends on, newest first. Rules for when a
change is justified: [`OPERATING-RULES.md`](OPERATING-RULES.md).

Entry format:

```
## YYYY-MM-DD — <what changed>
- Where: campaign / ad group / keyword / page
- Approval: pre-approved (OPERATING-RULES section 4) | approved by <name> on <date>
- Evidence: <numbers and date range>
- Reason: <how it serves the goal>
- Expected effect: <metric and rough size>
- Check on: <date> — <metric>
- Result: <filled in at the check date; "reversed on <date>" if it made things worse>
```

## 2026-11-02 — Website: Google Ads tag, lead conversion events, click-ID capture
- Where: 305doors.com, PR #6 (merged as 3e6580e); Supabase `leads` gained gclid, gbraid, wbraid, utm_*, landing_page (SQL run by Osniel)
- Approval: approved by Osniel on 2026-11-02 (tracking fix, steps 1–3)
- Evidence: the site sent no lead event to GA4 or Google Ads, and leads carried no ad source
- Change: `AW-957785966` loads on every page with GA4; a successful quote form fires GA4 `generate_lead` and the "Quote form submitted" conversion (no personal data sent); gclid/UTMs/landing page are stored for 90 days in the browser and saved with each lead in Supabase and the lead email's "Source" block
- Verified live: headless Chrome render of 305doors.com shows `google-ads-config` and gtag.js for G-BNYWHZFSQ6
- Expected effect: every quote form is counted in GA4 and, for ad clicks, in Google Ads, and each lead row shows its source
- Check on: Osniel's test lead (step 7) — Supabase row has the test gclid, the email shows the Source block, GA4 records `generate_lead`
- Result: passed 2026-11-02 19:36 UTC. Test lead from `?gclid=TEST-1102&utm_source=google&utm_medium=cpc`: Supabase row has gclid TEST-1102, utm google/cpc, landing page `/`; the lead email shows the Source block; GA4 realtime shows 1 `generate_lead`. The Google Ads conversion is confirmed only on the first lead from a real ad click

## 2026-11-02 — GA4 key event `generate_lead`
- Where: GA4 property 379587463
- Approval: approved by Osniel on 2026-11-02 (tracking fix, step 6)
- Evidence: GA4 logged only page_view, session_start, first_visit and user_engagement in the 90 days to 2026-11-01; the only key event was an unused `purchase`
- Reason: makes quote-form leads visible in GA4 once the site fires the event
- Expected effect: GA4 key events match quote form submissions after the website change ships
- Check on: first test lead after the website change — `generate_lead` appears as a key event
- Result: —
- Not done: the GA4 ↔ Google Ads link. The API refused it (403): creating the link needs admin access on the Ads account, and the service account is Standard. Osniel links it in GA4 → Admin → Product links → Google Ads links

## 2026-11-02 — Conversion goals: quote forms and calls from ads count for bidding
- Where: account-level conversion goals
- Approval: approved by Osniel on 2026-11-02 (tracking fix, steps 4–5)
- Evidence: "SUBMIT_LEAD_FORM / Website" and "PHONE_CALL_LEAD / Calls from ads" were not biddable; "PAGE_VIEW / Website" was already not biddable at account level (the 26 page-view "conversions" in 2024 came from the paused campaigns' own goal settings)
- Reason: bidding learns from real leads (forms and calls of 60 s or more), not page loads
- Change: SUBMIT_LEAD_FORM~WEBSITE and PHONE_CALL_LEAD~CALL_FROM_ADS set to biddable; PAGE_VIEW~WEBSITE left not biddable. The "Page view" action itself can't be edited through the API (Google's codeless setup owns it); it stays enabled but no longer counts for bidding at account level. New campaigns set their own goals to forms and calls only
- Expected effect: Google's conversion count reflects leads only
- Check on: first test lead — it appears under "Quote form submitted"; no page-view conversions in new campaigns
- Result: —

## 2026-11-02 — Created conversion action "Quote form submitted"
- Where: conversion action 7887138226 (Website, category Submit lead form, primary, one per click, 90-day click window, 1-day view window, no value)
- Approval: approved by Osniel on 2026-11-02 (tracking fix, step 4)
- Evidence: no conversion action existed for the quote form; GA4 recorded 0 lead events in 90 days
- Reason: the quote form is the main lead source the campaigns need to optimize toward
- Tag: `AW-957785966/KWAbCLLb8LAdEO7O2sgD`, fired by the website on successful submission (pull request `tracking/lead-conversions`)
- Calls: "Call Today" (call from ads) already counts calls of 60 s or more; unchanged
- Expected effect: each successful quote form from an ad click records one conversion
- Check on: first test lead after the website change ships
- Result: —
