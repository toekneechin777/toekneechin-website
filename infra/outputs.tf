output "bucket_name" {
  description = "S3 bucket to sync the site into."
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (for cache invalidations)."
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "CloudFront domain (works before custom DNS is live)."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "site_url" {
  description = "Canonical site URL once DNS is pointed here."
  value       = "https://${var.domain_name}"
}

output "nameservers" {
  description = "Paste these into GoDaddy as custom nameservers for the domain."
  value       = aws_route53_zone.site.name_servers
}
