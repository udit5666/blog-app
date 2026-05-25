import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await api.login(form);
    if (res.token) {
      onLogin(res);
      navigate("/");
    } else {
      setError(res.message || "Login failed.");
    }
  };

  return (
    <div className="auth-box">
      <h1 className="page-title" style={{ textAlign: "center" }}>Login</h1>
      <div className="card">
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%" }}>Login</button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
          No account? <Link to="/register" style={{ color: "#2563eb" }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
