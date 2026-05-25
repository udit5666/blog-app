import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Home({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading posts...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Latest Posts</h1>
        {user && <Link to="/create" className="btn-primary">+ New Post</Link>}
      </div>
      {posts.length === 0 ? (
        <div className="empty">
          <p>No posts yet.</p>
          {user && <Link to="/create" className="btn-primary" style={{ display: "inline-block", marginTop: "1rem" }}>Write the first one</Link>}
        </div>
      ) : (
        posts.map((post) => (
          <div className="card" key={post.id}>
            <h2><Link to={`/post/${post.id}`}>{post.title}</Link></h2>
            <div className="card-meta">
              By <strong>{post.author}</strong> &nbsp;·&nbsp; {new Date(post.created_at).toLocaleDateString()}
            </div>
            <p className="card-preview">{post.content.substring(0, 180)}{post.content.length > 180 ? "..." : ""}</p>
            <div style={{ marginTop: "0.8rem" }}>
              <Link to={`/post/${post.id}`} style={{ color: "#2563eb", fontSize: "0.9rem" }}>Read more →</Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
