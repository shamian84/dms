import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaFileAlt } from "react-icons/fa";

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/upload", label: "Upload" },
    { path: "/search", label: "Search" },
    { path: "/admin", label: "Admin" },
  ];

  return (
    <motion.nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background: "linear-gradient(90deg, #667eea, #764ba2)",
        padding: "10px 20px",
      }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container-fluid">
        {/* Logo */}
        <motion.div
          className="d-flex align-items-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <FaFileAlt size={28} className="text-white me-2" />
          <Link className="navbar-brand fw-bold" to="/dashboard">
            DMS
          </Link>
        </motion.div>

        {/* Toggle (mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {token ? (
            <ul className="navbar-nav ms-auto">
              {navLinks.map((link, i) => (
                <motion.li
                  key={i}
                  className="nav-item"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    className={`nav-link ${
                      location.pathname === link.path ? "active fw-bold" : ""
                    }`}
                    to={link.path}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <li className="nav-item ms-2">
                <motion.button
                  className="btn btn-danger"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
