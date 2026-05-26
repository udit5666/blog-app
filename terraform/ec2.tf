# Find the latest Amazon Linux 2023 AMI automatically
# data sources query AWS for existing info rather than creating anything

data "aws_ami" "amazon_linux" {
    most_recent = true
    owners = ["amazon"]

    filter {
        name = "name"
        values = ["al2023-ami-*-x86_64"] #Amazon Linux 2 AMI, you can adjust this to use Amazon Linux 2023 or another AMI if you prefer
    }
}

resource "aws_launch_template" "app" {
    name_prefix = "${var.app_name}-lt-"
    image_id = data.aws_ami.amazon_linux.id
    instance_type = "t2.micro"
    key_name = "blog-app-key" #Make sure to create this key pair in the AWS console and download the private key file, you will need it to SSH into your instances

    network_interfaces {
        associate_public_ip_address = true
        security_groups = [aws_security_group.ec2.id]
    }

# This script runs automatically the first time EC2 boots
  # It installs Node, clones your repo, and starts the backend
    user_data = base64encode(templatefile("${path.module}/userdata.sh", {
        db_host = aws_db_instance.postgres.address
        db_name = "blogdb"
        db_username = var.db_username
        db_password = var.db_password
        jwt_secret = var.jwt_secret
        github_user = var.github_username
 }))
 tag_specifications {
    resource_type = "instance"
    tags = {
        Name = "${var.app_name}-instance"
 }
 }
}

# Auto Scaling Group — manages the fleet of EC2 instances
resource "aws_autoscaling_group" "app" {
    name = "${var.app_name}-asg"
    desired_capacity = 1
    min_size = 1
    max_size = 3

    vpc_zone_identifier = [aws_subnet.public_a.id, aws_subnet.public_b.id]
    target_group_arns = [aws_lb_target_group.app.arn]
    health_check_type = "ELB"
    health_check_grace_period = 300 #Time for the instance to start and pass health checks before being marked unhealthy

    launch_template {
        id = aws_launch_template.app.id
        version = "$Latest"
    }
    tag {
        key = "Name"
        value = "${var.app_name}-instance"
        propagate_at_launch = true
    }
}

# Scale out when average CPU across all instances exceeds 70%
resource "aws_autoscaling_policy" "scale_out" {
    name = "${var.app_name}-scale-out"
    autoscaling_group_name = aws_autoscaling_group.app.name
    policy_type = "TargetTrackingScaling"

    target_tracking_configuration {
        predefined_metric_specification {
            predefined_metric_type = "ASGAverageCPUUtilization"
        }
        target_value = 70.0
    }

}