output "alb_dns_name" {
  description = "Paste this into your frontend .env as REACT_APP_API_URL"
  value       = "http://${aws_lb.main.dns_name}"
}

output "cloudfront_url" {
  description = "Your blog frontend is live at this URL"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "s3_bucket_name" {
  description = "Upload your frontend build to this bucket"
  value       = aws_s3_bucket.frontend.id
}

output "rds_endpoint" {
  description = "Database endpoint — used in backend .env"
  value       = aws_db_instance.postgres.address
}

output "ec2_instance_connect" {
  description = "SSH into your EC2 instance using this"
  value       = "ssh -i ~/.ssh/blog-app-key.pem ec2-user@<EC2-public-ip>"
}