import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api";

export default function PostDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPost(id)
      .then(setPost)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    await api.deletePost(id);
    navigate("/");
  };

  const handleComment = async (e) => {
    e.preventDefault();
    setError("");
    if (!comment.trim()) return;
    const res = await api.addComment(id, { content: comment });
    if (res.id) {
      setPost((p) => ({ ...p, comments: [...p.comments, { ...res, author: user.username }] }));
      setComment("");
    } else {
      setError(res.message || "Failed to add comment.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!post) return <div className="loading">Post not found.</div>;

  return (
    <div>
      <Link to="/" style={{ color: "#2563eb", fontSize: "0.9rem" }}>← Back to posts</Link>
      <div className="card" style={{ marginTop: "1rem" }}>
        <h1 style={{ fontSize: "1.7rem", marginBottom: "0.5rem" }}>{post.title}</h1>
        <div className="card-meta">
          By <strong>{post.author}</strong> &nbsp;·&nbsp; {new Date(post.created_at).toLocaleDateString()}
          {user && user.id === post.author_id && (
            <button onClick={handleDelete} className="btn-danger" style={{ marginLeft: "1rem" }}>Delete</button>
          )}
        </div>
        <p className="post-content">{post.content}</p>
      </div>

      <div className="comments-section">
        <h3>Comments ({post.comments.length})</h3>
        {post.comments.map((c) => (
          <div className="comment" key={c.id}>
            <div className="comment-author">{c.author}</div>
            <div className="comment-text">{c.content}</div>
          </div>
        ))}
        {user ? (
          <form onSubmit={handleComment} style={{ marginTop: "1rem" }}>
            {error && <div className="error">{error}</div>}
            <div className="form-group">
              <label>Add a comment</label>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Write your comment..." />
            </div>
            <button type="submit" className="btn-primary">Post Comment</button>
          </form>
        ) : (
          <p style={{ marginTop: "1rem", color: "#888", fontSize: "0.9rem" }}>
            <Link to="/login" style={{ color: "#2563eb" }}>Login</Link> to comment.
          </p>
        )}
      </div>
    </div>
  );
}
