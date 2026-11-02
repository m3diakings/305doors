---
created: 2026-11-02
scope: every change Claude Code makes to the 305 DOORS Google Ads account (356-964-8608) and to the 305doors.com pages and tracking it depends on
read: before any session that reviews, reports on or changes 305 Doors Google Ads
---

# Operating rules for 305 Doors Google Ads

Set by Osniel on 2026-11-02, the same rules as the SBC recertification
campaign. They apply to every session, including scheduled runs. Every change
is recorded in [`CHANGELOG.md`](CHANGELOG.md). Access and scripts:
[`../google-apis/README.md`](../google-apis/README.md).

## 1. The principle

A change is made only when the data shows it should improve the goal:
**more qualified garage door leads at a lower cost per qualified lead.** A
change is never made to show activity. When the data doesn't justify a
change, nothing changes, and the weekly report says why.

## 2. What every change needs

Before making a change, write down:

1. **Evidence:** the numbers behind it, with their date range (for example,
   "search term 'garage door spring diy': 9 clicks, $54, 0 leads, Nov 5–18").
2. **Reason:** how the change serves the goal.
3. **Expected effect:** what should move, and roughly how much.
4. **Check:** the date and the metric that will show whether it worked.

These four items go into `CHANGELOG.md` with the change. At the check date,
the result is added to the same entry. A change that made things worse is
reversed and the reversal is logged.

## 3. Evidence standards

- **Check tracking first.** Before acting on "no leads", confirm that form and
  call conversions are still recording (Google Ads conversion status, GA4 key
  events, the newest rows in the Supabase `leads` table and lead emails). Zero
  leads across the whole account is a tracking question before it is a
  keyword question.
- **Judge on qualified leads,** not on Google's conversion count alone. Google
  counts calls and form fills; the team's lead record shows which were real.
- **Don't decide on a few days of data.** Except for clearly irrelevant
  searches (section 4), wait for at least 7 days and enough clicks to tell
  signal from chance.
- **Change one thing at a time** on the same campaign or ad group where
  possible, so the effect can be traced to its cause.
- **Respect Google's learning periods.** After a bidding-strategy or large
  budget change, leave the campaign about 2 weeks before judging it.
- **Mind the time zone.** The account runs on Pacific time
  (America/Los_Angeles): daily figures and ad schedules are 3 hours behind
  Miami. Google does not allow changing it.

## 4. Rules by change type

These are starting thresholds. Once there is a target cost per qualified lead
(after 30 days of data), thresholds tied to "$60" switch to "twice the target
cost per lead".

| Change | Pre-approved? | When it's justified |
|---|---|---|
| Exclude a search term that is plainly not a customer (DIY and parts-only searches, jobs or training, other businesses' names, outside the service area) | Yes | On first sight. These searches can't become leads, so no spend threshold is needed. |
| Exclude an ambiguous search term | Yes | About 10 clicks or $60 spent with no lead, or it brought leads the team marks unqualified. |
| Pause a keyword | Yes | Live for at least 14 days, and $60 spent (or about 10 clicks) with no lead, with tracking confirmed working. |
| Add a keyword | Yes | A search term brought a lead, or brought repeated relevant clicks, and isn't already covered. Added as phrase or exact match. |
| Change a match type | Yes | Narrow it when its search terms are mostly irrelevant. Broaden it only when the keyword produces qualified leads but is limited by search volume. |
| Change a keyword bid or the max cost-per-click cap | Yes | At most once a week per keyword, by no more than 20%, based on its cost per lead and lost impression share. Not done once Google's automated bidding sets bids. |
| Change the daily budget | Yes, within the cap | **Raise** only when the campaign is limited by budget and its search terms are relevant, with cost per qualified lead at or below target once one exists. **Lower** when the money would be spent on irrelevant searches. At most once a week, by no more than 20%. **Never** above $36.18/day across the account or $1,100 of Google Ads spend in a calendar month. |
| Ad text, bidding strategy, locations, new campaigns or ad groups, enabling or removing a campaign, conversion settings, the website | **No** — propose with evidence and wait for approval | Same evidence standard; the proposal goes in the weekly report or the session. |

## 5. Weekly review routine

1. Confirm that tracking works (section 3).
2. Pull spend, clicks, search terms, conversions and impression share for the
   week, and the outcomes of leads from ads.
3. Apply the rules in section 4. List every change made, with its evidence.
4. List the changes that need approval, with their evidence.
5. Review the check dates that fell due in `CHANGELOG.md` and record the
   results; reverse any change that made things worse.
6. Report: spend against the monthly cap, leads, qualified leads, cost per
   qualified lead, wasted spend, changes made, changes proposed and anything
   left unchanged on purpose.

## 6. Limits that never change

- Google Ads spend stays at or below $1,100 per calendar month (the approved
  $1,000 plus 10%). At Google's 30.4-day billing month that caps the
  account's combined daily budgets at $36.18.
- Ads don't make claims about prices, warranties, licensing or response times
  that the team hasn't confirmed.
- The phone number in ads is the site's number, (786) 395-4042
  (`src/lib/site.ts`).
- Every change to the live account or the website gets explicit approval in
  the session unless section 4 pre-approves it.

## 7. Company goals (Osniel, 2026-11-02)

- **Business:** 305 Doors sells and services garage doors, residential and
  commercial.
- **Goal:** lead the market in **Miami-Dade, Broward, Palm Beach, Lee and
  Monroe counties**, all of which the company serves.
- **Priority:** more **new garage door sales and replacements**. Repair and
  service leads are welcome but are not what the campaigns are built to grow.
- **Out of area:** searches from outside those five counties are excluded on
  first sight (section 4).

- **Budget:** $1,000/month of Google Ads spend (about $32.90/day), starting
  2026-11-02.

**Still open:**
1. What counts as a qualified lead, and where the team records it. Leads
   arrive by email and in the Supabase `leads` table, which has no
   qualified/won status or ad click ID yet.
