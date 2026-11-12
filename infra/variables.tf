variable "domain_name" {
  description = "Apex domain to host (must already be owned, e.g. at GoDaddy)."
  type        = string
  default     = "anthonylchen.com"
}

variable "aws_region" {
  description = "Primary AWS region for the S3 bucket."
  type        = string
  default     = "us-west-2"
}

variable "project_name" {
  description = "Short name used in resource tags / bucket prefix."
  type        = string
  default     = "toekneechin-website"
}
