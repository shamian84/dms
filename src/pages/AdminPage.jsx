import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Viewer");
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) return;

    const newUser = { username, password, role };
    setUsers([...users, newUser]);

    setUsername("");
    setPassword("");
    setRole("Viewer");
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      setUsers(users.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 0",
      }}
    >
      <motion.div
        className="card shadow-lg p-4"
        style={{
          maxWidth: "500px",
          width: "100%",
          borderRadius: "15px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.h2
          className="text-center fw-bold mb-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          👑 Admin Panel
        </motion.h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
            <span
              role="button"
              style={{
                position: "absolute",
                right: "10px",
                top: "38px",
                cursor: "pointer",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Role</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ➕ Create User
          </motion.button>
        </form>

        {/* Search + Users */}
        {users.length > 0 && (
          <div className="mt-4">
            <h5 className="fw-bold">👥 User List</h5>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="🔍 Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <ul className="list-group">
              <AnimatePresence>
                {users
                  .filter((u) =>
                    u.username.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((u, index) => (
                    <motion.li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <div>
                        <strong>{u.username}</strong>{" "}
                        <span className="badge bg-info">{u.role}</span>
                      </div>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setDeleteIndex(index)}
                      >
                        ❌ Delete
                      </button>
                    </motion.li>
                  ))}
              </AnimatePresence>
            </ul>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      {deleteIndex !== null && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            background: "rgba(0,0,0,0.6)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="modal-header">
                <h5 className="modal-title">⚠️ Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteIndex(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete user{" "}
                  <strong>{users[deleteIndex]?.username}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteIndex(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
