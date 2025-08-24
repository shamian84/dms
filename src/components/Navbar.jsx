import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaFileAlt } from "react-icons/fa";

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/upload", label: "Upload" },
    { path: "/search", label: "Search" },
    { path: "/admin", label: "Admin" },
  ];

  const mobileMenuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1 },
  };

  return (
    <motion.nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background: "linear-gradient(90deg, #667eea, #764ba2)",
        padding: "10px 15px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo */}
        <motion.div
          className="d-flex align-items-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <FaFileAlt size={24} className="text-white me-2" />
          <Link className="navbar-brand fw-bold mb-0" to="/dashboard">
            DMS
          </Link>
        </motion.div>

        {/* Toggler (only for mobile) */}
        <button
          className="navbar-toggler ms-auto"
          type="button"
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Desktop Links */}
        <div className="d-none d-lg-flex ms-auto">
          {token ? (
            <ul className="navbar-nav align-items-center">
              {navLinks.map((link, i) => (
                <motion.li
                  key={i}
                  className="nav-item mx-2"
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
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="d-lg-none w-100 bg-gradient p-3"
            style={{
              background: "linear-gradient(90deg, #667eea, #764ba2)",
              marginTop: "10px",
              borderRadius: "8px",
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            transition={{ duration: 0.3 }}
          >
            {token ? (
              <ul className="navbar-nav">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={i}
                    className="nav-item"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      className={`nav-link ${
                        location.pathname === link.path ? "active fw-bold" : ""
                      }`}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
                <li className="nav-item mt-3">
                  <motion.button
                    className="btn btn-danger w-100"
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Logout
                  </motion.button>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                </li>
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
