#!/usr/bin/env bash
# Commit and push this run's records (ledgers, manifests, briefs, reports) to main.
set -euo pipefail
cd "$(dirname "$0")/.."
git config user.name  >/dev/null || git config user.name  "305 Doors automation"
git config user.email >/dev/null || git config user.email "automation@users.noreply.github.com"
git add marketing/runs
if git diff --cached --quiet; then echo "nothing to save"; exit 0; fi
# safety: refuse to commit anything that looks like a credential file
if git diff --cached --name-only | grep -Eq '(^|/)\.env$|client_secret|service-account'; then
  echo "refusing: a credential file is staged"; git reset -q; exit 1; fi
git commit -q -m "Run records $(TZ=America/New_York date +%F) ${1:-}"
for i in 1 2 3; do git pull -q --rebase origin main && git push -q origin HEAD:main && { echo "saved"; exit 0; }; sleep 5; done
echo "push failed"; exit 1
