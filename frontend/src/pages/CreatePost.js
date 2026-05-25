import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function CreatePost({ user }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await api.createPost(form);
    if (res.id) {
      navigate(`/post/${res.id}`);
    } else {
      setError(res.message || "Failed to create post.");
    }
  };

  return (
    <div style={{ maxWidth: "680px" }}>
      <h1 className="page-title">New Post</h1>
      {error && <div className="error">{error}</div>}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title" required />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your post..." rows={10} required />
          </div>
          <button type="submit" className="btn-primary">Publish Post</button>
        </form>
      </div>
    </div>
  );
}
