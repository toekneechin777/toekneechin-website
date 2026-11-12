#!/usr/bin/env bash
# Sync the static site to S3 and invalidate CloudFront.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
INFRA="$ROOT/infra"

if ! command -v aws >/dev/null 2>&1; then
  echo "aws CLI not found. Install: brew install awscli" >&2
  exit 1
fi

if ! command -v terraform >/dev/null 2>&1; then
  echo "terraform not found. Install: brew install terraform" >&2
  exit 1
fi

cd "$INFRA"
BUCKET="$(terraform output -raw bucket_name)"
DIST_ID="$(terraform output -raw cloudfront_distribution_id)"

echo "→ Syncing site to s3://${BUCKET}"
aws s3 sync "$ROOT" "s3://${BUCKET}" \
  --delete \
  --exclude ".git/*" \
  --exclude ".gitignore" \
  --exclude "infra/*" \
  --exclude "scripts/*" \
  --exclude "candidates/*" \
  --exclude "README.md" \
  --exclude ".DS_Store" \
  --exclude "*.tfstate*" \
  --exclude ".terraform/*"

echo "→ Invalidating CloudFront ${DIST_ID}"
aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/*" \
  --output text \
  --query 'Invalidation.Id'

echo "✓ Deploy complete"
terraform output -raw site_url
echo
terraform output -raw cloudfront_domain_name
