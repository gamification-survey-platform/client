provider "aws" {
  region = var.region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

locals {
  common_tags = {
    project = var.project_tag_name
  }

  frontend_files = fileset("${path.module}/../build", "**/*")
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
  bucket = "gamification-frontend-bucket2023"

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

# Create S3 bucket ACL for frontend
resource "aws_s3_bucket_acl" "gamification_frontend_bucket_acl" {
  bucket = aws_s3_bucket.gamification_frontend_bucket.id
  acl = "public-read"
}
  
# Create S3 bucket objects of the build folder for frontend and deploy to S3 bucket
resource "aws_s3_bucket_object" "frontend_files" {
  for_each = local.frontend_files

  bucket = aws_s3_bucket.gamification_frontend_bucket.id
  key    = each.key
  source = each.value
  acl    = "public-read"
  content_type = lookup(local.content_types, each.key, "application/octet-stream")
}
