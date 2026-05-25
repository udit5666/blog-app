import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Register({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await api.register(form);
    if (res.token) {
      onLogin(res);
      navigate("/");
    } else {
      setError(res.message || "Registration failed.");
    }
  };

  return (
    <div className="auth-box">
      <h1 className="page-title" style={{ textAlign: "center" }}>Register</h1>
      <div className="card">
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={6} required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%" }}>Create Account</button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
          Already have an account? <Link to="/login" style={{ color: "#2563eb" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
