terraform {
  required_version = ">= 1.0.0"
    required_providers {
        aws = {
            source  = "hashicorp/aws"
            version = "~> 5.0"
        }
        random = {
          source  = "hashicorp/random"
          version = "~> 3.0"
    }
}

backend "s3" {
    bucket = "udit-terraform-state-2024"
    key = "blog-app/terraform.tfstate"
    region = "us-east-1"
   }
}

provider "aws" {
  region = var.aws_region
}

