# Random suffix so the bucket name is globally unique
# S3 bucket names are global across ALL AWS accounts worldwide
resource "random_id" "bucket_suffix" {
    byte_length = 4
}

resource "aws_s3_bucket" "frontend" {
    bucket = "${var.app_name}-frontend-${random_id.bucket_suffix.hex}"
     
     tags = {
        Name = "${var.app_name}-frontend"
    }
}
# Enable static website hosting on the bucket
resource "aws_s3_bucket_website_configuration" "frontend" {
    bucket = aws_s3_bucket.frontend.id

    index_document {
        suffix = "index.html"
    }
    error_document {
        key = "index.html" #For single page applications, we want to serve index.html for all routes, so we set the error document to index.html as well
  }
}

# Allow public read access — needed for a website
resource "aws_s3_bucket_public_access_block" "frontend" {
    bucket = aws_s3_bucket.frontend.id

    block_public_acls = false
    block_public_policy = false
    ignore_public_acls = false
    restrict_public_buckets = false
}

# Bucket policy — allow anyone on the internet to GET objects
# This is what makes your React app publicly accessible
resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  depends_on = [aws_s3_bucket_public_access_block.frontend]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

