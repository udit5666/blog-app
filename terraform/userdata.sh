#!/bin/bash
set -e
exec > /var/log/user-data.log 2>&1

echo "=== Starting EC2 setup ==="

dnf update -y
dnf install -y nodejs npm git

cd /home/ec2-user
git clone https://github.com/${github_user}/blog-app.git
cd blog-app/backend

cat > .env << ENVEOF
PORT=5000
DB_HOST=${db_host}
DB_PORT=5432
DB_NAME=${db_name}
DB_USER=${db_username}
DB_PASSWORD=${db_password}
DB_SSL=true
JWT_SECRET=${jwt_secret}
FRONTEND_URL=*
ENVEOF

npm install
npm install -g pm2
pm2 start src/index.js --name blog-backend
pm2 startup systemd -u ec2-user --hp /home/ec2-user
pm2 save

echo "=== Setup complete ==="

