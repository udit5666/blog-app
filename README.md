# CloudBlog — Full Stack Blog App
<img width="795" height="806" alt="Screenshot_8-6-2026_144655_" src="https://github.com/user-attachments/assets/5ac75d97-2ed6-4d24-be5f-70e7e9c5718b" />

```
User's Browser
│
│ 1. LOADS REACT APP
│    GET https://d4zr8lhl9rdjb.cloudfront.net
│              ↓
│         CloudFront (CDN)
│              ↓ cache miss
│           S3 Bucket
│         (index.html, main.js, main.css)
│
│ React app now running in browser
│
│ 2. FETCHES DATA (every user action)
│    fetch("http://ALB_DNS/api/...")
│              ↓
│    Application Load Balancer
│    (receives all API traffic)
│              ↓
│    EC2 Instance (Node.js/Express)
│    Running: node src/index.js via PM2
│    Does:
│    ├── Validates JWT tokens (auth middleware)
│    ├── Runs business logic (controllers)
│    ├── Queries PostgreSQL database
│    └── Returns JSON responses
│              ↓
│    RDS PostgreSQL
│    (stores all persistent data)
│    ├── users table
│    ├── posts table
│    └── comments table
│
│ 3. JSON DATA COMES BACK
│    EC2 → ALB → Browser
│    React updates UI with data
│    User sees: posts, comments, profile
```

## Project structure

```
blog-app/
├── backend/          Express.js REST API (runs on EC2, port 5000)
│   ├── src/
│   │   ├── index.js          Entry point + /health endpoint
│   │   ├── db/index.js       PostgreSQL connection + table creation
│   │   ├── routes/           auth.js, posts.js
│   │   ├── controllers/      authController.js, postController.js
│   │   └── middleware/       auth.js (JWT)
│   └── .env.example          Copy to .env and fill in values
│
└── frontend/         React app (built files go to S3)
    ├── src/
    │   ├── App.js            Router + Navbar
    │   ├── pages/            Home, PostDetail, CreatePost, Login, Register
    │   └── api/index.js      All API calls (reads REACT_APP_API_URL)
    └── .env.example          Copy to .env and fill in values

## Backend env vars needed on EC2
PORT=5000
DB_HOST=<RDS endpoint>
DB_PORT=5432
DB_NAME=blogdb
DB_USER=bloguser
DB_PASSWORD=<your password>
DB_SSL=true
JWT_SECRET=<long random string>
FRONTEND_URL=<CloudFront URL>

## Frontend env var needed at build time
REACT_APP_API_URL=<ALB DNS or EC2 public IP>

## Key facts for Terraform
- Backend port: 5000
- Health check path: GET /health → returns 200
- Frontend build command: npm run build
- Frontend build output folder: frontend/build/
- Database: PostgreSQL 15
```
