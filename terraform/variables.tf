#Variables are how you avoid hardcoding values everywhere. 
#Instead of writing "us-east-1" in 10 different files, 
#you define it once and reference it everywhere.


variable "aws_region"{
    description = "AWS region to deploy resources"
    type = string
    default = "us-east-1"
}

variable "app_name"{
    description = "Used as a prefix for all resources"
    type = string
    default = "blog-app"
}

variable "environment" {
    description = "dev, staging, or prod"
    type = string
    default = "dev"
}

variable "db_password" {
    description = "Password for the RDS database"
    type = string
    sensitive = true #This will prevent the value from being displayed in logs or the console, bascially it should not be default and typed at apply time
}

variable "db_username" {
    description = "Username for the RDS database"
    type = string
    default = "blogadmin"
}

variable "jwt_secret" {
    description = "Secret key for JWT authentication"
    type = string
    sensitive = true
}

variable "github_username" {
    description = "GitHub username for CodeBuild to access the repository"
    type = string
    default = "udit5666"
}

