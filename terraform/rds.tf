resource "aws_db_subnet_group" "main" {
    name = "${var.app_name}-db-subnet-group"
    subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    tags = {
        Name = "${var.app_name}-db-subnet-group"
    }
}

resource "aws_db_instance" "postgres"{
    identifier = "${var.app_name}-db"
    engine = "postgres"
    engine_version = "15"
    instance_class = "db.t3.micro" #This is the smallest instance type, good for development and testing, but for production you would want to choose a larger instance type based on your
    allocated_storage = 20 #Minimum storage for RDS is 20GB

    db_name = "blogdb"
    username = var.db_username
    password = var.db_password

    db_subnet_group_name = aws_db_subnet_group.main.name
    vpc_security_group_ids = [aws_security_group.rds.id]

    multi_az = false #For production, you would want to set this to true for high availability
    publicly_accessible = false #This ensures the database is not accessible from the internet, it
    storage_encrypted = true #Encrypt the storage for security
    storage_type = "gp2" #General Purpose SSD, good for most workloads

    backup_retention_period = 7 #Retain backups for 7 days, you can adjust this based on your needs
    backup_window = "03:00-04:00" #Preferred backup window, you can adjust this based on your needs 
    skip_final_snapshot = true #For development, we can skip the final snapshot when deleting the database, but for production you would want to set this to false to ensure you have a backup before deletion  

    tags = {
        Name = "${var.app_name}-db"
    }

}
