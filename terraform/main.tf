provider "aws" {
  region = var.region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

locals {
  common_tags = {
    project = var.project_tag_name
  }

  frontend_files = fileset("${abspath(path.module)}/../build", "**/*")

  content_types = {
    "html" = "text/html"
    "css"  = "text/css"
    "js"   = "application/javascript"
    "png"  = "image/png"
    "jpg"  = "image/jpeg"
    "jpeg" = "image/jpeg"
    "gif"  = "image/gif"
    "svg"  = "image/svg+xml"
    "ico"  = "image/x-icon"
    "json" = "application/json"
    "txt"  = "text/plain"
    "xml"  = "text/xml"
  }
}

#  Create S3 bucket for frontend
resource "aws_s3_bucket" "gamification_frontend_bucket" {
  bucket = var.bucket_name
  acl    = "public-read"

  policy = <<EOF
  {
    "Id": "gamification-frontend-bucket-policy",
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "gamification-frontend-bucket-statement",
        "Action": [
          "s3:GetObject"
        ],
        "Effect": "Allow",
        "Resource": "arn:aws:s3:::${var.bucket_name}/*",
        "Principal": "*"
      }
    ]

  }
  EOF

  tags = merge(
    local.common_tags,
    {
      Terraform   = "True"
      Environment = "Dev"
    },
  )
}

# Create S3 bucket configuration for frontend
resource "aws_s3_bucket_website_configuration" "gamification_frontend_bucket_config" {
  bucket = aws_s3_bucket.gamification_frontend_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

output "website_domain" {
  value = aws_s3_bucket.gamification_frontend_bucket.website_domain
}

output "website_endpoint" {
  value = aws_s3_bucket.gamification_frontend_bucket.website_endpoint
}

