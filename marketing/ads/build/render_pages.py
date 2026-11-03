#!/usr/bin/env python3
"""Render the 305 Doors ads plan and campaign build sheet as HTML pages.

The build sheet is generated from build_sheet.json, so the page always shows the
content that gets built. Run: python3 marketing/ads/build/render_pages.py
"""
import html
import json
from pathlib import Path

BUILD = Path(__file__).resolve().parent
ADS = BUILD.parent
SHEET = json.loads((BUILD / 'build_sheet.json').read_text())
AS_OF = 'November 2, 2026'
PLAN_URL = 'https://claude.ai/artifact/EAZ4pSthqAits69XUtW5Fu'
BUILD_URL = 'https://claude.ai/artifact/2swtVYdFmcRfdzQWedsnN9'

CSS = """
/* Layout: one reading column in 305 Doors' site type (Lexend headings, Inter text) and its blue; tables scroll on their own on phones. */
:root {
  --blue: #2563EB;
  --blue-ink: #1D4ED8;
  --tint: #EFF4FF;
  --ink: #0F172A;
  --muted: #475569;
  --rule: #DCE3EE;
  --paper: #FFFFFF;
  --panel: #F5F8FC;
  --warn: #8A4B00;
  --warn-bg: #FFF4E5;
  --ok: #166534;
  --ok-bg: #EAF7EE;
  --font-display: "Lexend", "Helvetica Neue", Arial, sans-serif;
  --font-body: "Inter", "Helvetica Neue", Arial, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --blue: #7AA2FF; --blue-ink: #A9C2FF; --tint: #142039; --ink: #E6EAF2; --muted: #A3ADBF;
    --rule: #263247; --paper: #0C111B; --panel: #131A28; --warn: #FFC27A; --warn-bg: #2B2112;
    --ok: #86E0A5; --ok-bg: #12261A; color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --blue: #7AA2FF; --blue-ink: #A9C2FF; --tint: #142039; --ink: #E6EAF2; --muted: #A3ADBF;
  --rule: #263247; --paper: #0C111B; --panel: #131A28; --warn: #FFC27A; --warn-bg: #2B2112;
  --ok: #86E0A5; --ok-bg: #12261A; color-scheme: dark;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--paper); color: var(--ink); font-family: var(--font-body); font-size: 16px; line-height: 1.6;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
.wrap { max-width: 880px; margin: 0 auto; padding-block: 48px 72px; }
header.top { display: grid; gap: 14px; padding-bottom: 28px; border-bottom: 3px solid var(--blue); }
.eyebrow { font-size: 13px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--blue); }
h1, h2, h3 { font-family: var(--font-display); text-wrap: balance; }
h1 { margin: 0; font-size: clamp(30px, 5vw, 42px); line-height: 1.12; font-weight: 700; }
.lede { margin: 0; font-size: 18px; color: var(--muted); max-width: 64ch; }
.meta { display: flex; flex-wrap: wrap; gap: 8px 20px; font-size: 14px; color: var(--muted); }
.meta b { color: var(--ink); font-weight: 600; }
.pill { display: inline-block; padding: 2px 10px; border-radius: 999px; font-weight: 600; font-size: 13px; }
.pill.warn { background: var(--warn-bg); color: var(--warn); }
.pill.ok { background: var(--ok-bg); color: var(--ok); }
nav.toc { margin-top: 24px; display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 14px; }
nav.toc a, a { color: var(--blue-ink); }
nav.toc a { text-decoration: none; border-bottom: 1px solid var(--rule); }
section { padding-top: 44px; display: grid; gap: 14px; }
h2 { margin: 0; font-size: 25px; line-height: 1.2; font-weight: 600; display: flex; gap: 12px; align-items: baseline; }
h2 .n { font-family: var(--font-mono); font-size: 14px; color: var(--blue); font-weight: 500; }
h3 { margin: 6px 0 0; font-size: 18px; font-weight: 600; }
p { margin: 0; max-width: 68ch; }
ul, ol { margin: 0; padding-left: 22px; display: grid; gap: 6px; max-width: 70ch; }
.goal { background: var(--tint); padding: 22px 24px; border-radius: 4px; display: grid; gap: 10px; }
.goal p { font-size: 17px; }
.callout { border-left: 3px solid var(--warn); background: var(--warn-bg); padding: 14px 18px; display: grid; gap: 6px; border-radius: 0 4px 4px 0; }
.callout strong { color: var(--warn); }
.tbl { overflow-x: auto; border: 1px solid var(--rule); border-radius: 4px; }
table { width: 100%; border-collapse: collapse; font-size: 14.5px; min-width: 560px; }
th, td { text-align: left; vertical-align: top; padding: 10px 14px; border-bottom: 1px solid var(--rule); }
th { background: var(--panel); font-weight: 600; font-size: 13px; color: var(--muted); }
tr:last-child td { border-bottom: 0; }
td.num, .mono { font-family: var(--font-mono); font-size: 13.5px; font-variant-numeric: tabular-nums; }
td.num { text-align: right; white-space: nowrap; }
.tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.tile { border: 1px solid var(--rule); border-radius: 4px; padding: 14px 16px; display: grid; gap: 2px; }
.tile b { font-family: var(--font-display); font-size: 24px; font-weight: 600; font-variant-numeric: tabular-nums; }
.tile span { font-size: 13px; color: var(--muted); }
.phases { display: grid; border: 1px solid var(--rule); border-radius: 4px; }
.phase { display: grid; grid-template-columns: 160px 1fr; gap: 16px; padding: 16px 18px; border-bottom: 1px solid var(--rule); }
.phase:last-child { border-bottom: 0; }
.phase .when { font-family: var(--font-mono); font-size: 13px; color: var(--muted); }
.phase .when b { display: block; font-family: var(--font-display); font-size: 15px; color: var(--ink); font-weight: 600; }
.phase .done { font-size: 14px; color: var(--muted); margin-top: 4px; }
code { font-family: var(--font-mono); font-size: .9em; background: var(--panel); padding: 1px 5px; border-radius: 3px; }
.adprev { border: 1px solid var(--rule); border-radius: 8px; padding: 16px 18px; display: grid; gap: 4px; max-width: 640px; }
.adprev .spon { font-size: 12px; font-weight: 700; }
.adprev .url { font-size: 13px; color: var(--muted); }
.adprev .hl { font-size: 19px; line-height: 1.3; color: var(--blue-ink); }
.adprev .ds { font-size: 14px; color: var(--muted); }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { font-family: var(--font-mono); font-size: 13px; padding: 2px 8px; border: 1px solid var(--rule); border-radius: 3px; background: var(--panel); }
.negs { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.neg h3 { margin: 0 0 6px; font-size: 15px; }
.group { border-top: 1px solid var(--rule); padding-top: 20px; display: grid; gap: 12px; }
.len { color: var(--muted); font-family: var(--font-mono); font-size: 12.5px; }
footer { margin-top: 56px; padding-top: 18px; border-top: 1px solid var(--rule); font-size: 13.5px; color: var(--muted); display: grid; gap: 6px; }
a:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; }
@media (max-width: 640px) {
  .wrap { padding-block: 28px 48px; }
  .tiles { grid-template-columns: 1fr 1fr; }
  .phase { grid-template-columns: 1fr; gap: 6px; }
  .negs { grid-template-columns: 1fr; }
  h2 { font-size: 21px; }
}
"""

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lexend:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>{css}</style>
</head>
<body>
<div class="wrap">
"""
FOOT = '</div>\n</body>\n</html>\n'
e = html.escape


def table(headers, rows, num_cols=()):
    th = ''.join(f'<th>{e(h)}</th>' for h in headers)
    body = ''
    for r in rows:
        body += '<tr>' + ''.join(f'<td class="num">{c}</td>' if i in num_cols else f'<td>{c}</td>' for i, c in enumerate(r)) + '</tr>'
    return f'<div class="tbl"><table><thead><tr>{th}</tr></thead><tbody>{body}</tbody></table></div>'


# ---------------------------------------------------------------- plan
def plan_page():
    c = SHEET['campaign']
    demand = [
        ('Installation / new doors', 'garage door installation 590 · installation near me 390 · installation cost 170 · new garage door 40', '$10–56', 'Yes, core'),
        ('Replacement', 'garage door replacement 260 · replacement near me 90 · replacement cost 70', '$11–67', 'Yes, core'),
        ('Impact / hurricane', 'impact garage doors 140 · hurricane garage doors 90 · hurricane impact 50 · impact rated 30', '$4–36', 'Yes, best value'),
        ('Commercial', 'roll up doors 110 · overhead door company 70 · commercial garage doors 50 · commercial installation 40', '$2–47', 'Yes'),
        ('Local / company', 'garage door company 390 · garage door miami 170 · garage door fort lauderdale 50', '$8–108', 'Yes, tightly'),
        ('Styles and brands', 'insulated 480 · Clopay 480 · glass 260 · modern 210 · Amarr 170', '$0.30–18', 'Later test'),
        ('Repair', 'garage door repair 5,400 · repair near me 4,400 · spring replacement 260', '$12–83', 'No, excluded'),
    ]
    audit = [
        ('Conversion tracking', '"Page view" counted as a primary conversion: all 26 Performance Max "conversions" in 2024 were home-page loads. No quote-form conversion, no GA4 lead event, GA4 not linked to Ads.', '<span class="pill ok">Fixed Nov 2</span>'),
        ('SEARCH | CALLS | 305 DOORS', '$535 lifetime, 212 clicks, 4 real calls (about $134 per call). One call-only ad, 64 broad-match keywords mixing repair and sales, top spend on window and door replacement, Lowe\'s parts and openers.', '<span class="pill warn">Stays paused</span>'),
        ('P-MAX | 305 DOORS', '$40, 26 "conversions" that were all page views. Home page as the only destination. Nothing real to learn from.', '<span class="pill warn">Stays paused</span>'),
        ('Targeting', 'Miami-Dade, Broward, Palm Beach, Lee, plus Collier and Naples; Monroe missing. Schedule 5am–11pm Pacific (8am–2am Miami).', '<span class="pill warn">Replaced</span>'),
        ('Account', 'Active, billing set up since 2018, auto-tagging on, last spend August 2024. Runs on Pacific time.', '<span class="pill ok">OK</span>'),
    ]
    tracking = [
        ('Conversion "Quote form submitted"', 'Created; primary, one per click, 90-day window'),
        ('Calls from ads', 'Count for bidding; only calls of 60 s or more'),
        ('Page views', 'Excluded from bidding'),
        ('Website', 'Google Ads tag on every page; GA4 <code>generate_lead</code> and the Ads conversion fire only after a lead is accepted'),
        ('Lead record', 'Each lead stores gclid, UTMs and landing page in Supabase and shows a Source block in the lead email'),
        ('GA4', '<code>generate_lead</code> is a key event'),
        ('Test', 'Passed: test lead with a test gclid reached Supabase, email and GA4'),
        ('Supabase', 'Daily keep-alive so the free project never pauses'),
    ]
    out = HEAD.format(title='305 Doors Ads Plan', css=CSS)
    out += f"""<header class="top">
<div class="eyebrow">305 Doors · Google Ads · Plan</div>
<h1>Win more new and replacement garage door jobs from Google search</h1>
<p class="lede">How 305 Doors runs Google Ads in-house: what the audit found, what is already fixed, where the demand is, and how the new campaign is built, measured and grown county by county.</p>
<div class="meta"><span><b>Account</b> 356-964-8608</span><span><b>Budget</b> $1,000/month</span><span><b>As of</b> {AS_OF}</span><span class="pill ok">Campaign built, paused · in Google review</span></div>
<nav class="toc"><a href="#goal">Goal</a><a href="#audit">Audit</a><a href="#tracking">Tracking</a><a href="#demand">Demand</a><a href="#strategy">Strategy</a><a href="#measure">Measuring</a><a href="#rules">Rules</a><a href="#timeline">Timeline</a><a href="#open">Open items</a></nav>
</header>

<section id="goal"><h2><span class="n">01</span>Goal</h2>
<div class="goal"><p><b>More qualified leads for new garage doors and replacements, at a falling cost per qualified lead,</b> across Miami-Dade, Broward, Palm Beach, Lee and Monroe counties, residential and commercial.</p>
<p>Repair and service leads are welcome but the campaigns are not built to grow them. Results are judged on leads the team marks qualified, not on Google's conversion count.</p></div>
</section>

<section id="audit"><h2><span class="n">02</span>What the audit found</h2>
<p>No ads have run since August 2024. The two campaigns left in the account are paused, and they were set up to chase calls and page loads rather than door sales.</p>
{table(['Area', 'Finding', 'Status'], [(e(a), e(b), s) for a, b, s in audit])}
</section>

<section id="tracking"><h2><span class="n">03</span>Tracking, fixed and tested on November 2</h2>
<p>Every later decision depends on knowing which clicks became leads, so tracking was fixed first.</p>
{table(['Piece', 'Now'], tracking)}
<p>Google Ads credits the quote-form conversion only to visits from a real ad click, so its first recorded conversion arrives once the new campaign runs.</p>
</section>

<section id="demand"><h2><span class="n">04</span>Where the demand is</h2>
<p>Monthly Google searches in Miami-Dade and Broward, with Google's top-of-page bid range (Keyword Planner, {AS_OF}).</p>
<div class="tiles"><div class="tile"><b>~2,200</b><span>new-door and replacement searches a month</span></div><div class="tile"><b>~10×</b><span>more repair searches than sales searches</span></div><div class="tile"><b>$4–36</b><span>impact-door clicks, the cheapest buying intent</span></div><div class="tile"><b>~1,850</b><span>Spanish searches, spread over 300 phrases</span></div></div>
{table(['Intent', 'Searches a month', 'Top-of-page bid', 'In the campaign'], [(e(a), e(b), e(c), e(d)) for a, b, c, d in demand], num_cols=(2,))}
<p>At these prices $1,000 buys roughly <b>40–70 clicks a month</b>, which at typical rates for home services is about <b>4–8 leads</b>. That is an estimate until the campaign has real data.</p>
</section>

<section id="strategy"><h2><span class="n">05</span>Strategy</h2>
<h3>One Search campaign, built for sales</h3>
<ul>
<li><b>"{e(c['name'])}"</b>: Google Search only, phrase and exact match, so every search we pay for is visible and controllable.</li>
<li><b>Four ad groups</b>, each landing on its own page: Installation &amp; Replacement, Impact &amp; Hurricane, Commercial, and Local Company.</li>
<li><b>Repair is excluded</b> with negative keywords from day one, along with parts, openers, DIY, big-box stores, windows and entry doors, and jobs. These took most of the 2024 spend.</li>
<li><b>Bidding:</b> Maximize Clicks with a $25 maximum per click while there is no conversion data; switch to Maximize Conversions after about 15 real leads in 30 days.</li>
<li><b>Budget:</b> $32 a day (about $973 a month) against a hard cap of $1,100 a month.</li>
<li><b>Ads:</b> two responsive search ads per group stating free estimates, most brands installed, fast installation and hurricane-approved impact doors, all confirmed by Osniel. No phone number in ad text (Google policy); calls come through the call button. Experience reads "Over 10 Years of Experience" and "In Business Since 2019" (founded October 4, 2019, plus 4 years with other companies). No warranty is mentioned. No financing is offered or mentioned.</li>
<li><b>Calls:</b> the call button shows Mon–Sat, 8am–6pm Miami time; outside those hours ads send people to the quote form.</li>
</ul>
<h3>County by county</h3>
<ol>
<li><b>Weeks 1–4:</b> Miami-Dade and Broward, the largest demand and closest to the team.</li>
<li><b>Then Palm Beach</b>, once the first two have a known cost per qualified lead.</li>
<li><b>Lee and Monroe</b> as small separate tests. Collier stays out of ads; its page stays up for organic search.</li>
</ol>
<h3>Language</h3>
<p>Spanish-speaking users are targeted with English ads. Spanish garage-door searches are small and mostly price browsing, so a Spanish ad group waits until search-term data shows demand worth one. The team answers calls in Spanish.</p>
<h3>Later</h3>
<ul><li>A small "styles" test (impact glass, modern, insulated, brands) where clicks are cheap.</li><li>Performance Max only after about 30 days of real lead data.</li><li>Offline conversions: send "qualified" and "won" back to Google by click ID so bidding learns which clicks become jobs.</li></ul>
</section>

<section id="measure"><h2><span class="n">06</span>Measuring success</h2>
<p><b>A qualified lead</b> is a homeowner, property manager or business in a served county asking for a quote on a new door, a replacement or a commercial installation. Repair requests count as qualified but secondary. Spam, vendors, job seekers, parts or DIY questions and out-of-area requests do not.</p>
{table(['Metric', 'Source'], [('Qualified leads per month', 'Supabase <code>leads.status</code>, set weekly by the team'), ('Cost per qualified lead', 'Ads spend ÷ qualified leads'), ('Quotes and won jobs, job value', 'Supabase <code>status</code> and <code>job_value</code>'), ('All leads and cost per lead', 'Google Ads conversions'), ('Wasted spend', 'Share of spend on irrelevant search terms'), ('Calls', 'Google Ads call report (calls of 60 s or more)')])}
<p>Targets are set after 30 days of live data.</p>
</section>

<section id="rules"><h2><span class="n">07</span>How changes are made</h2>
<p>The same rules as the SBC campaign, kept in <code>marketing/ads/OPERATING-RULES.md</code>. Every change needs evidence, a reason, an expected effect and a check date, and is logged in <code>marketing/ads/CHANGELOG.md</code>.</p>
{table(['Change', 'Who decides'], [('Negative keywords, pausing or adding keywords, match types, keyword bids', 'Pre-approved, within the evidence thresholds'), ('Daily budget', 'Pre-approved within $36.18/day and $1,100/month'), ('Ad text, bidding strategy, locations (adding a county), new campaigns, conversion settings, the website', 'Needs your approval')])}
</section>

<section id="timeline"><h2><span class="n">08</span>Timeline</h2>
<div class="phases">
<div class="phase"><div class="when"><b>Tracking</b>Nov 2</div><div>Conversions, website tags, click-ID capture, GA4 key event, Supabase keep-alive.<div class="done">Done and tested.</div></div></div>
<div class="phase"><div class="when"><b>Build</b>Week of Nov 2</div><div>Approve the <a href="{BUILD_URL}">campaign build sheet</a>; it is created paused, checked against the sheet, then switched on.<div class="done">Done when the campaign is live with approved ads.</div></div></div>
<div class="phase"><div class="when"><b>Learn and prune</b>Weeks 2–4</div><div>Weekly search-term review, negatives, bid caps; first qualified leads.<div class="done">Done when wasted spend falls week over week.</div></div></div>
<div class="phase"><div class="when"><b>Expand</b>Weeks 4–8</div><div>Add Palm Beach; confirmed offers in the ads; switch to conversion bidding after about 15 leads.<div class="done">Done when cost per qualified lead is known per county.</div></div></div>
<div class="phase"><div class="when"><b>Scale</b>Weeks 8–12</div><div>Lee and Monroe tests, styles test, offline conversion upload.<div class="done">Done when cost per qualified lead is stable or falling.</div></div></div>
</div>
</section>

<section id="open"><h2><span class="n">09</span>Open items</h2>
<ol>
<li><b>Switch the campaign on</b> once Google approves the ads and keywords (built paused on November 2, campaign 24429434104), and confirm Billing → Advertiser verification is "Completed".</li>
<li><b>Decide how calls and leads are handled.</b> 305 Doors may move to Jobber as its CRM, as SBC did. To settle: where form and call leads live (Jobber, Supabase or both), how calls are tracked and logged (today only Google's call report records them), and how the ad click ID travels with each lead so qualified and won jobs can be sent back to Google Ads. Until then, Supabase is the lead record.</li>
<li><b>Name who updates lead status</b> each week.</li>
<li><b>Link GA4 to Google Ads</b> (GA4 → Admin → Google Ads links); it needs an Ads admin.</li>
<li><b>Test call</b> to (786) 395-4042 in launch week.</li>
</ol>
</section>

<footer><span>Sources: Google Ads account 356-964-8608 and Keyword Planner (Miami-Dade and Broward, English), GA4 property 379587463, Search Console sc-domain:305doors.com, pulled {AS_OF}.</span><span>Build sheet: <a href="{BUILD_URL}">305 Doors Campaign Build</a>. Source files: <code>marketing/ads/</code> in the 305doors repo.</span></footer>
"""
    return out + FOOT


# ---------------------------------------------------------------- build sheet
def kw_rows(g):
    rows = []
    for k in g['keywords']:
        match = 'Exact' if k.get('exact_only') else 'Phrase + exact'
        vol = f"{k['vol']:,}" if k.get('vol') else '<span class="len">close variant</span>'
        rows.append((e(k['text']), match, vol))
    return rows


def ad_block(g, i, ad):
    host = g['final_url'].split('/')[2]
    path = ' › '.join(g['path'])
    pinned = {v: k for k, v in ad['pins'].items()}
    h1 = pinned.get('HEADLINE_1', ad['headlines'][0])
    others = [h for h in ad['headlines'] if h != h1]
    prev = f"""<div class="adprev"><span class="spon">Sponsored</span><span class="url">305doors.com › {e(path)}</span>
<span class="hl">{e(h1)} | {e(others[0])} | {e(others[1])}</span><span class="ds">{e(ad['descriptions'][0])} {e(ad['descriptions'][1])}</span></div>"""
    hl_rows = [(str(n + 1), e(h) + (' <span class="pill ok">pinned 1</span>' if h in ad['pins'] else ''), str(len(h))) for n, h in enumerate(ad['headlines'])]
    ds_rows = [(str(n + 1), e(d), str(len(d))) for n, d in enumerate(ad['descriptions'])]
    return f"""<h3>Ad {'AB'[i]}{' · headline 1 pinned' if ad['pins'] else ''}</h3>
<p class="len">Example of how Google may combine it (the order varies):</p>{prev}
{table(['#', 'Headline (max 30)', 'Chars'], hl_rows, num_cols=(2,))}
{table(['#', 'Description (max 90)', 'Chars'], ds_rows, num_cols=(2,))}"""


def build_page():
    c = SHEET['campaign']
    a = SHEET['assets']
    n_kw = sum(len(g['keywords']) for g in SHEET['ad_groups'])
    n_kw_entries = sum(1 if k.get('exact_only') else 2 for g in SHEET['ad_groups'] for k in g['keywords'])
    n_neg = sum(len(v) for v in SHEET['campaign_negatives'].values())
    settings = [
        ('Name', e(c['name'])),
        ('Status at creation', 'Paused; switched on after you review it in the account'),
        ('Type and networks', 'Search · Google Search only (no search partners, no Display)'),
        ('Locations', 'Miami-Dade County, Broward County · people <b>in or regularly in</b> them (not "interest")'),
        ('Languages', 'English, Spanish (ads in English)'),
        ('Budget', '$32.00/day (about $973/month) · cap $36.18/day, $1,100/month'),
        ('Bidding', 'Maximize Clicks, max CPC $25.00 · switch to Maximize Conversions after ~15 leads in 30 days'),
        ('Conversion goals', 'Quote form submitted (website) · Calls from ads, 60 s or more. Page views not counted'),
        ('Ad schedule', 'All hours for ads; the call button only Mon–Sat 8am–6pm Miami (5am–3pm in the account\'s Pacific time)'),
        ('Tracking suffix', f"<code>{e(c['final_url_suffix'])}</code> (auto-tagging also adds gclid)"),
    ]
    out = HEAD.format(title='305 Doors Campaign Build', css=CSS)
    out += f"""<header class="top">
<div class="eyebrow">305 Doors · Google Ads · Build sheet</div>
<h1>{e(c['name'])}</h1>
<p class="lede">Everything the new campaign is built from: settings, {len(SHEET['ad_groups'])} ad groups, {n_kw} keywords, {n_neg} negative keywords, {sum(len(g['ads']) for g in SHEET['ad_groups'])} ads and the assets. It was created exactly as written here, paused, on November 2 (campaign 24429434104) and read back to confirm every item.</p>
<div class="meta"><span><b>Account</b> 356-964-8608</span><span><b>As of</b> {AS_OF}</span><span class="pill ok">Built Nov 2 · paused · campaign 24429434104</span></div>
<nav class="toc"><a href="#settings">Settings</a>{''.join(f'<a href="#ag{n}">{e(g["name"])}</a>' for n, g in enumerate(SHEET['ad_groups'], 1))}<a href="#negatives">Negatives</a><a href="#assets">Assets</a><a href="#pending">Claims</a></nav>
</header>

<section id="settings"><h2><span class="n">01</span>Campaign settings</h2>
{table(['Setting', 'Value'], settings)}
<div class="tiles"><div class="tile"><b>{len(SHEET['ad_groups'])}</b><span>ad groups</span></div><div class="tile"><b>{n_kw_entries}</b><span>keyword entries ({n_kw} phrases)</span></div><div class="tile"><b>{n_neg}</b><span>campaign negatives</span></div><div class="tile"><b>{sum(len(g['ads']) for g in SHEET['ad_groups'])}</b><span>responsive search ads</span></div></div>
<p>Every headline is 30 characters or fewer and every description 90 or fewer; the counts are shown beside each line. No keyword is blocked by a negative.</p>
</section>
"""
    for n, g in enumerate(SHEET['ad_groups'], 1):
        out += f"""<section id="ag{n}"><h2><span class="n">{n + 1:02d}</span>Ad group: {e(g['name'])}</h2>
<p>Lands on <a href="{e(g['final_url'])}">{e(g['final_url'].replace('https://', ''))}</a> · display path <code>{e('/'.join(g['path']))}</code></p>
<h3>Keywords</h3>
{table(['Keyword', 'Match', 'Searches/month'], kw_rows(g), num_cols=(2,))}
<div class="group">{''.join(ad_block(g, i, ad) for i, ad in enumerate(g['ads']))}</div>
</section>
"""
    negs = ''.join(f'<div class="neg"><h3>{e(t)}</h3><div class="chips">{"".join(f"<span class=chip>{e(x)}</span>" for x in v)}</div></div>' for t, v in SHEET['campaign_negatives'].items())
    sl = [(e(s['text']), e(s['d1']) + '<br>' + e(s['d2']), f'<a href="{e(s["url"])}">{e(s["url"].replace("https://", ""))}</a>') for s in a['sitelinks']]
    out += f"""<section id="negatives"><h2><span class="n">{len(SHEET['ad_groups']) + 2:02d}</span>Campaign negative keywords</h2>
<p>Phrase-match negatives on the whole campaign. Each group blocks a kind of search that cost money in 2024 or can't become a sale.</p>
<div class="negs">{negs}</div>
<p>Palm Beach, Lee and Monroe city names are not negatives: a Miami or Broward searcher asking about them can still be served.</p>
</section>

<section id="assets"><h2><span class="n">{len(SHEET['ad_groups']) + 3:02d}</span>Assets</h2>
<h3>Sitelinks</h3>{table(['Link text', 'Description lines', 'Goes to'], sl)}
<h3>Callouts</h3><div class="chips">{''.join(f'<span class="chip">{e(x)}</span>' for x in a['callouts'])}</div>
<h3>Structured snippet · {e(a['structured_snippet']['header'])}</h3><div class="chips">{''.join(f'<span class="chip">{e(x)}</span>' for x in a['structured_snippet']['values'])}</div>
<h3>Call</h3><p>{e(a['call']['display'])}, shown Mon–Sat 8am–6pm Miami time; a call counts as a lead at 60 seconds or more.</p>
</section>

<section id="pending"><h2><span class="n">{len(SHEET['ad_groups']) + 4:02d}</span>Claims in the ads</h2>
<div class="callout"><strong>In the ads (confirmed by Osniel, November 2):</strong><p>Free estimates, fast installation, installs most brands, "hurricane approved" for every impact door, and over 10 years of experience, in business since 2019 (founded October 4, 2019; the team worked 4 years at other companies before that), plus what 305doors.com states: residential and commercial, and the service area. Phone calls come through the call button: Google does not allow phone numbers in headlines or descriptions.</p></div>
<h3>Held back</h3>
{table(['Claim', 'Why it is held'], [(e(c['claim']), e(c['why'])) for c in SHEET['held_claims']])}
<p>Left out on purpose: financing (not offered), warranty and the contractor license number (Osniel's choice).</p>
</section>

<footer><span>Built from <code>marketing/ads/build/build_sheet.json</code>; the campaign is created from that file. Search volumes: Google Keyword Planner, Miami-Dade and Broward, English, {AS_OF}.</span><span>Strategy: <a href="{PLAN_URL}">305 Doors Ads Plan</a>.</span></footer>
"""
    return out + FOOT


if __name__ == '__main__':
    (ADS / 'ads-plan.html').write_text(plan_page())
    (BUILD / 'campaign-build.html').write_text(build_page())
    print('wrote', ADS / 'ads-plan.html', 'and', BUILD / 'campaign-build.html')
