const { pool } = require("../db");

const getAllPosts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.title, p.content, p.created_at,
              u.username AS author, u.id AS author_id
       FROM posts p
       JOIN users u ON p.author_id = u.id
       ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch posts." });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const postResult = await pool.query(
      `SELECT p.id, p.title, p.content, p.created_at,
              u.username AS author, u.id AS author_id
       FROM posts p
       JOIN users u ON p.author_id = u.id
       WHERE p.id=$1`,
      [id]
    );
    if (postResult.rows.length === 0) {
      return res.status(404).json({ message: "Post not found." });
    }
    const commentsResult = await pool.query(
      `SELECT c.id, c.content, c.created_at, u.username AS author
       FROM comments c
       JOIN users u ON c.author_id = u.id
       WHERE c.post_id=$1
       ORDER BY c.created_at ASC`,
      [id]
    );
    res.json({ ...postResult.rows[0], comments: commentsResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch post." });
  }
};

const createPost = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }
  try {
    const result = await pool.query(
      "INSERT INTO posts (title, content, author_id) VALUES ($1,$2,$3) RETURNING *",
      [title, content, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post." });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const check = await pool.query("SELECT author_id FROM posts WHERE id=$1", [id]);
    if (check.rows.length === 0) return res.status(404).json({ message: "Post not found." });
    if (check.rows[0].author_id !== req.user.id)
      return res.status(403).json({ message: "Not authorized." });
    const result = await pool.query(
      "UPDATE posts SET title=$1, content=$2, updated_at=NOW() WHERE id=$3 RETURNING *",
      [title, content, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update post." });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const check = await pool.query("SELECT author_id FROM posts WHERE id=$1", [id]);
    if (check.rows.length === 0) return res.status(404).json({ message: "Post not found." });
    if (check.rows[0].author_id !== req.user.id)
      return res.status(403).json({ message: "Not authorized." });
    await pool.query("DELETE FROM posts WHERE id=$1", [id]);
    res.json({ message: "Post deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete post." });
  }
};

const addComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: "Comment content required." });
  try {
    const result = await pool.query(
      "INSERT INTO comments (content, post_id, author_id) VALUES ($1,$2,$3) RETURNING *",
      [content, id, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add comment." });
  }
};

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost, addComment };
