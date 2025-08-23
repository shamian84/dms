import React, { useState } from "react";

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) return;

    // Mock adding a user
    const newUser = { username, password };
    setUsers([...users, newUser]);

    // Clear inputs
    setUsername("");
    setPassword("");
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow w-50 mx-auto">
        <h2 className="text-center mb-4">Admin - Create User</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Create User
          </button>
        </form>

        {users.length > 0 && (
          <div className="mt-4">
            <h5>Created Users (Mock Data)</h5>
            <ul className="list-group">
              {users.map((u, index) => (
                <li key={index} className="list-group-item">
                  <strong>{u.username}</strong> — {u.password}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
