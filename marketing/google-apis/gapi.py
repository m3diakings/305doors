#!/usr/bin/env python3
"""Search Console, GA4 and Google Ads access for 305 Doors through the service account
claude@doors-publishing.iam.gserviceaccount.com. Read-only.

Usage:
  python3 gapi.py check                      # list what the service account can reach in all three APIs
  python3 gapi.py gsc <site> <start> <end>   # site totals, e.g. sc-domain:305doors.com
  python3 gapi.py ga <property_id> [days]    # sessions, users, key events
  python3 gapi.py ads <customer_id> '<GAQL>' # read-only Google Ads query

Needs only the standard library plus `cryptography`. The key file (git-ignored) is
marketing/gcp-service-account.json; in cloud runs the key's JSON comes from the
GCP_SERVICE_ACCOUNT_JSON variable instead. Never print or commit it.
"""
import base64, json, os, sys, time, urllib.error, urllib.parse, urllib.request
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

KEY_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'gcp-service-account.json')
ADS_VERSION = 'v26'

SCOPES = {'gsc': 'https://www.googleapis.com/auth/webmasters.readonly',
          'ga': 'https://www.googleapis.com/auth/analytics.readonly',
          'ga_edit': 'https://www.googleapis.com/auth/analytics.edit',
          'ads': 'https://www.googleapis.com/auth/adwords'}
_tokens = {}


def _b64(b):
    return base64.urlsafe_b64encode(b).rstrip(b'=').decode()


def token(api):
    """Access token for 'gsc', 'ga' or 'ads', signed with the service account key."""
    if api not in _tokens:
        env_key = os.environ.get('GCP_SERVICE_ACCOUNT_JSON')
        sa = json.loads(env_key) if env_key else json.load(open(KEY_FILE))
        now = int(time.time())
        head = _b64(json.dumps({'alg': 'RS256', 'typ': 'JWT'}).encode())
        claim = _b64(json.dumps({'iss': sa['client_email'], 'scope': SCOPES[api], 'aud': sa['token_uri'],
                                 'iat': now, 'exp': now + 3600}).encode())
        key = serialization.load_pem_private_key(sa['private_key'].encode(), None)
        sig = _b64(key.sign(f'{head}.{claim}'.encode(), padding.PKCS1v15(), hashes.SHA256()))
        data = urllib.parse.urlencode({'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                                       'assertion': f'{head}.{claim}.{sig}'}).encode()
        _tokens[api] = json.load(urllib.request.urlopen(sa['token_uri'], data))['access_token']
    return _tokens[api]


def request(api, url, body=None, headers=None):
    """GET (or POST when body is given). Returns (status, parsed JSON or error text)."""
    h = {'Authorization': 'Bearer ' + token(api), **(headers or {})}
    if body is not None:
        h['Content-Type'] = 'application/json'
        body = json.dumps(body).encode()
    try:
        with urllib.request.urlopen(urllib.request.Request(url, body, h), timeout=60) as r:
            return r.status, json.load(r)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode(errors='replace')


def gsc(site, start, end, dimensions=()):
    url = 'https://www.googleapis.com/webmasters/v3/sites/' + urllib.parse.quote(site, safe='') + '/searchAnalytics/query'
    return request('gsc', url, {'startDate': start, 'endDate': end, 'dimensions': list(dimensions), 'rowLimit': 1000})


def ga(property_id, days=28, metrics=('sessions', 'totalUsers', 'keyEvents'), dimensions=()):
    return request('ga', f'https://analyticsdata.googleapis.com/v1beta/properties/{property_id}:runReport',
                   {'dateRanges': [{'startDate': f'{days}daysAgo', 'endDate': 'yesterday'}],
                    'metrics': [{'name': m} for m in metrics], 'dimensions': [{'name': d} for d in dimensions]})


def ads(customer_id, query):
    """Read-only GAQL search. Writes (mutate calls) are deliberately not wrapped here."""
    return request('ads', f'https://googleads.googleapis.com/{ADS_VERSION}/customers/{customer_id}/googleAds:search',
                   {'query': query})


def check():
    st, d = request('gsc', 'https://www.googleapis.com/webmasters/v3/sites')
    print('Search Console', st, [(s['siteUrl'], s['permissionLevel']) for s in d.get('siteEntry', [])] if st == 200 else d[:400])

    st, d = request('ga', 'https://analyticsadmin.googleapis.com/v1beta/accountSummaries')
    if st != 200:
        print('GA4 admin', st, d[:400])
    for acct in d.get('accountSummaries', []) if st == 200 else []:
        for p in acct.get('propertySummaries', []):
            pid = p['property'].split('/')[1]
            rst, r = ga(pid)
            vals = [m['value'] for m in r['rows'][0]['metricValues']] if rst == 200 and r.get('rows') else (r[:300] if rst != 200 else 'no rows')
            print('GA4', acct.get('displayName'), '|', p.get('displayName'), pid, rst, 'sessions/users/keyEvents', vals)

    st, d = request('ads', f'https://googleads.googleapis.com/{ADS_VERSION}/customers:listAccessibleCustomers')
    print('Ads accessible', st, d.get('resourceNames') if st == 200 else d[:600])
    q = ('SELECT customer.descriptive_name, customer.time_zone, customer.currency_code, metrics.cost_micros, '
         'metrics.clicks, metrics.conversions FROM customer WHERE segments.date DURING LAST_30_DAYS')
    for rn in d.get('resourceNames', []) if st == 200 else []:
        cid = rn.split('/')[1]
        qs, r = ads(cid, q)
        if qs == 200 and r.get('results'):
            c, m = r['results'][0]['customer'], r['results'][0].get('metrics', {})
            print('Ads', cid, c.get('descriptiveName'), c.get('timeZone'), 'cost', int(m.get('costMicros', 0)) / 1e6,
                  'clicks', m.get('clicks', 0), 'conv', m.get('conversions', 0))
        else:
            print('Ads', cid, qs, r if qs == 200 else r[:400])


if __name__ == '__main__':
    cmd, args = (sys.argv[1], sys.argv[2:]) if len(sys.argv) > 1 else ('check', [])
    if cmd == 'check':
        check()
    elif cmd == 'gsc':
        print(json.dumps(gsc(*args[:3]), indent=1))
    elif cmd == 'ga':
        print(json.dumps(ga(args[0], int(args[1]) if len(args) > 1 else 28), indent=1))
    elif cmd == 'ads':
        print(json.dumps(ads(args[0], args[1]), indent=1))
    else:
        sys.exit(__doc__)
