resource "aws_lb" "main" {
    name = "${var.app_name}-alb"
    internal = false
    load_balancer_type = "application"
    security_groups = [aws_security_group.alb.id]
    subnets = [aws_subnet.public_a.id, aws_subnet.public_b.id]

    tags = {
        Name = "${var.app_name}-alb"
    }
}

resource "aws_lb_target_group" "app" { # Target group — the pool of EC2 instances ALB sends traffic to
    name = "${var.app_name}-tg"
    port = 5000
    protocol = "HTTP"
    vpc_id = aws_vpc.main.id

    health_check {
        enabled = true
        path ="/health"
        protocol = "HTTP"
        healthy_threshold = 2
        unhealthy_threshold = 2
        timeout = 5
        interval = 30
        matcher = "200"
    }
    tags = {
        Name = "${var.app_name}-tg"
    }
}

resource "aws_lb_listener" "http" { # Listener — ALB listens on port 80 and forwards to target group
    load_balancer_arn = aws_lb.main.arn
    port = 80
    protocol = "HTTP"

    default_action {
        type = "forward"
        target_group_arn = aws_lb_target_group.app.arn
    }
}