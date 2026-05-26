resource "aws_vpc" "main" {
    cidr_block = "10.0.0.0/16"
    enable_dns_support = true   #allows resources to get DNS names
    enable_dns_hostnames = true

    tags = {
        Name = "${var.app_name}-vpc" #The ${var.app_name} syntax — this is string interpolation in Terraform. It inserts the variable value into the string. So "${var.app_name}-vpc" becomes "blog-app-vpc". Makes all your resource names consistent and identifiable.
        Environment = var.environment
    }
}

resource "aws_internet_gateway" "main"{
    vpc_id = aws_vpc.main.id

    tags = {
        Name = "${var.app_name}-igw"
    }
}

resource "aws_subnet" "public_a" { #public subnet in availability zone a
    vpc_id = aws_vpc.main.id
    cidr_block = "10.0.1.0/24" 
    availability_zone = "${var.aws_region}a"
    map_public_ip_on_launch = true #This will automatically assign public IPs to instances launched in this subnet
    
    tags = {
        Name = "${var.app_name}-public-a"
    }
}

resource "aws_subnet" "public_b" { #public subnet in availability zone b
    vpc_id = aws_vpc.main.id
    cidr_block = "10.0.2.0/24"
    availability_zone = "${var.aws_region}b"
    map_public_ip_on_launch = true

    tags = {
        Name = "${var.app_name}-public-b"
    }
}

resource "aws_subnet" "private_a" { #private subnet in availability zone a
    vpc_id = aws_vpc.main.id
    cidr_block = "10.0.3.0/24"
    availability_zone = "${var.aws_region}a"

    tags = {
        Name = "${var.app_name}-private-a"
    }
}

resource "aws_subnet" "private_b" { #private subnet in availability zone b
    vpc_id = aws_vpc.main.id
    cidr_block = "10.0.4.0/24"
    availability_zone = "${var.aws_region}b"

    tags = {
        Name = "${var.app_name}-private-b"
    }
}

resource "aws_route_table" "public" {
    vpc_id = aws_vpc.main.id

    route {
        cidr_block = "0.0.0.0/0" #This means all traffic, if it doesn't match a more specific route, will be sent to the internet gateway
        gateway_id = aws_internet_gateway.main.id
   }
   tags = {
        Name = "${var.app_name}-public-rt"
    }
}

resource "aws_route_table_association" "public_a" { # Associate the route table with both public subnets
    subnet_id = aws_subnet.public_a.id
    route_table_id = aws_route_table.public.id
}
resource "aws_route_table_association" "public_b" {
    subnet_id = aws_subnet.public_b.id
    route_table_id = aws_route_table.public.id
}

