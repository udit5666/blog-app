resource "aws_security_group" "alb"{ #security group for the application load balancer
    name = "${var.app_name}-alb-sg"
    description = "Security group for ALB"
    vpc_id = aws_vpc.main.id

    ingress {
        description = "Allow HTTP traffic from anywhere"
        from_port = 80
        to_port = 80
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress{
        description = "Allow HTTPS traffic from anywhere"
        from_port = 443
        to_port = 443
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
    tags = {
        Name = "${var.app_name}-alb-sg"
    }
}

#Security group for the EC2 instances, allowing traffic from the ALB security group and SSH from anywhere (for demo purposes, in production you would want to restrict this)
resource "aws_security_group" "ec2" {
    name = "${var.app_name}-ec2-sg"
    description = "Security group for EC2 instances"
    vpc_id = aws_vpc.main.id

    ingress{
        description = "API port from ALB Only"
        from_port = 5000
        to_port = 5000
        protocol = "tcp"
        security_groups = [aws_security_group.alb.id] #This allows traffic from the ALB security group
    }

    ingress {
        description = "Allow SSH from anywhere (not recommended for production)"
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "${var.app_name}-ec2-sg"
    }

}
#Security group for RDS, allowing traffic from the EC2 security group only
resource "aws_security_group" "rds" {
    name = "${var.app_name}-rds-sg"
    description = "Security group for RDS"
    vpc_id = aws_vpc.main.id    

    ingress{
        description = "Allow MySQL traffic from EC2 Only"
        from_port= 5432
        to_port= 5432
        protocol = "tcp"
        security_groups = [aws_security_group.ec2.id] #This allows traffic from the EC
    }
    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
    tags = {
        Name = "${var.app_name}-rds-sg"
    }
}
