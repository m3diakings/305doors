#!/usr/bin/env python3
"""Create the 305 Doors Search campaign (paused) from build_sheet.json in one atomic mutate.

Usage: python3 create_campaign.py              # validate only, nothing is created
       python3 create_campaign.py --apply      # create it
       add --no-call-asset to leave out the scheduled call asset
"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', 'google-apis'))
import gapi

b = json.load(open(os.path.join(HERE, 'build_sheet.json')))
C = b['account']
cp = f'customers/{C}'
c = b['campaign']
ops, links = [], []
# Keywords Google's validation flagged under the exemptible "Local services" policy (validate run, 2026-11-02)
LOCAL_SERVICES_FLAGGED = {
    'commercial garage door installation', 'garage door company miami', 'garage door fort lauderdale', 'garage door installation',
    'garage door installation cost', 'garage door installation near me', 'garage door installers near me', 'garage door replacement',
    'garage door replacement cost', 'garage door replacement near me', 'garage doors broward', 'new garage door',
    'new garage door cost', 'new garage door installation', 'replace garage door'}
tmp = iter(range(-1, -2000, -1))

budget = f'{cp}/campaignBudgets/{next(tmp)}'
ops.append({'campaignBudgetOperation': {'create': {'resourceName': budget, 'name': f"{c['name']} budget",
            'amountMicros': str(int(c['daily_budget_usd'] * 1e6)), 'deliveryMethod': 'STANDARD', 'explicitlyShared': False}}})
camp = f'{cp}/campaigns/{next(tmp)}'
ops.append({'campaignOperation': {'create': {
    'resourceName': camp, 'name': c['name'], 'status': 'PAUSED', 'advertisingChannelType': 'SEARCH',
    'campaignBudget': budget,
    'networkSettings': {'targetGoogleSearch': True, 'targetSearchNetwork': False, 'targetContentNetwork': False, 'targetPartnerSearchNetwork': False},
    'targetSpend': {'cpcBidCeilingMicros': str(int(c['bidding']['max_cpc_usd'] * 1e6))},
    'geoTargetTypeSetting': {'positiveGeoTargetType': 'PRESENCE', 'negativeGeoTargetType': 'PRESENCE'},
    'finalUrlSuffix': c['final_url_suffix'],
    'containsEuPoliticalAdvertising': c['contains_eu_political_advertising']}}})
for loc in c['locations']:
    ops.append({'campaignCriterionOperation': {'create': {'campaign': camp, 'location': {'geoTargetConstant': f"geoTargetConstants/{loc['id']}"}}}})
for lang in c['languages']:
    ops.append({'campaignCriterionOperation': {'create': {'campaign': camp, 'language': {'languageConstant': f"languageConstants/{lang['id']}"}}}})
for words in b['campaign_negatives'].values():
    for w in words:
        ops.append({'campaignCriterionOperation': {'create': {'campaign': camp, 'negative': True, 'keyword': {'text': w, 'matchType': 'PHRASE'}}}})

for g in b['ad_groups']:
    ag = f'{cp}/adGroups/{next(tmp)}'
    ops.append({'adGroupOperation': {'create': {'resourceName': ag, 'name': g['name'], 'campaign': camp, 'status': 'ENABLED', 'type': 'SEARCH_STANDARD'}}})
    for k in g['keywords']:
        for mt in (('EXACT',) if k.get('exact_only') else ('PHRASE', 'EXACT')):
            op = {'create': {'adGroup': ag, 'status': 'ENABLED', 'keyword': {'text': k['text'], 'matchType': mt}}}
            if k['text'] in LOCAL_SERVICES_FLAGGED:
                # Garage door services are a Google "Local services" category; the keyword goes to policy review
                # and is approved for an advertiser verified for it (the account ran these keywords before).
                op['exemptPolicyViolationKeys'] = [{'policyName': 'LOCAL_SERVICES', 'violatingText': k['text']}]
            ops.append({'adGroupCriterionOperation': op})
    for ad in g['ads']:
        hl = [{'text': h, **({'pinnedField': ad['pins'][h]} if h in ad['pins'] else {})} for h in ad['headlines']]
        ops.append({'adGroupAdOperation': {'create': {'adGroup': ag, 'status': 'ENABLED', 'ad': {
            'finalUrls': [g['final_url']],
            'responsiveSearchAd': {'headlines': hl, 'descriptions': [{'text': d} for d in ad['descriptions']],
                                   'path1': g['path'][0], 'path2': g['path'][1]}}}}})


def asset(body, field):
    a = f'{cp}/assets/{next(tmp)}'
    ops.append({'assetOperation': {'create': {'resourceName': a, **body}}})
    links.append({'campaignAssetOperation': {'create': {'campaign': camp, 'asset': a, 'fieldType': field}}})


A = b['assets']
for s in A['sitelinks']:
    asset({'finalUrls': [s['url']], 'sitelinkAsset': {'linkText': s['text'], 'description1': s['d1'], 'description2': s['d2']}}, 'SITELINK')
for t in A['callouts']:
    asset({'calloutAsset': {'calloutText': t}}, 'CALLOUT')
asset({'structuredSnippetAsset': {'header': A['structured_snippet']['header'], 'values': A['structured_snippet']['values']}}, 'STRUCTURED_SNIPPET')
if '--no-call-asset' not in sys.argv:
    # Mon-Sat 08:00-18:00 Miami = 05:00-15:00 in the account's Pacific time zone
    sched = [{'dayOfWeek': d, 'startHour': 5, 'startMinute': 'ZERO', 'endHour': 15, 'endMinute': 'ZERO'}
             for d in ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY')]
    asset({'callAsset': {'countryCode': 'US', 'phoneNumber': A['call']['display'], 'adScheduleTargets': sched,
                         'callConversionReportingState': 'USE_ACCOUNT_LEVEL_CALL_CONVERSION_ACTION'}}, 'CALL')
ops += links

apply = '--apply' in sys.argv
s, r = gapi.request('ads', f'https://googleads.googleapis.com/{gapi.ADS_VERSION}/customers/{C}/googleAds:mutate',
                    {'mutateOperations': ops, 'partialFailure': False, 'validateOnly': not apply})
print('operations', len(ops), 'apply' if apply else 'validate-only', 'status', s)
print(r[:1500] if isinstance(r, str) else json.dumps({'responses': len(r.get('mutateOperationResponses', []))}))
if isinstance(r, str):
    open(os.path.join(HERE, 'validate_errors.json'), 'w').write(r)
if apply and s == 200:
    json.dump(r, open(os.path.join(HERE, 'create_result.json'), 'w'), indent=1)
    camp_rn = next(x['campaignResult']['resourceName'] for x in r['mutateOperationResponses'] if 'campaignResult' in x)
    json.dump({'campaign_id': camp_rn.split('/')[-1]}, open(os.path.join(HERE, 'campaign_id.json'), 'w'))
    print('campaign', camp_rn)
