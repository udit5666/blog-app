require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDB } = require("./db");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// Health check — used by ALB and auto scaling group
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const start = async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
};

start();
