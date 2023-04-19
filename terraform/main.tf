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

resource "aws_s3_bucket" "gamification_frontend_bucket" {
  bucket = "gamification-frontend-bucket2023"
  acl = "public-read"
  website {
    index_document = "index.html"
    error_document = "error.html"
  }
  tags = merge(
    local.common_tags,
    {
      Terraform   = "True"
      Environment = "Dev"
    },
  )
}
  
resource "aws_s3_bucket_object" "frontend_files" {
  for_each = { for f in local.frontend_files : f => f }

  bucket = aws_s3_bucket.gamification_frontend_bucket.id
  key = each.key
  source = "${path.module}/../build/${each.key}"
  content_type = lookup(local.content_types, regex("\\.(.+)$", each.value), "binary/octet-stream")
  acl = "public-read"
}
