const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const headers = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  register: (data) =>
    fetch(`${BASE}/api/auth/register`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then((r) => r.json()),

  login: (data) =>
    fetch(`${BASE}/api/auth/login`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then((r) => r.json()),

  getPosts: () =>
    fetch(`${BASE}/api/posts`, { headers: headers() }).then((r) => r.json()),

  getPost: (id) =>
    fetch(`${BASE}/api/posts/${id}`, { headers: headers() }).then((r) => r.json()),

  createPost: (data) =>
    fetch(`${BASE}/api/posts`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then((r) => r.json()),

  deletePost: (id) =>
    fetch(`${BASE}/api/posts/${id}`, { method: "DELETE", headers: headers() }).then((r) => r.json()),

  addComment: (postId, data) =>
    fetch(`${BASE}/api/posts/${postId}/comments`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then((r) => r.json()),
};
