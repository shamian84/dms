import React, { useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { FaCloudUploadAlt, FaSearch, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const features = [
    {
      title: "Upload Documents",
      desc: "Securely upload your files to the DMS.",
      icon: <FaCloudUploadAlt size={40} className="mb-3 text-primary" />,
      route: "/upload",
    },
    {
      title: "Search Files",
      desc: "Find documents instantly with advanced filters.",
      icon: <FaSearch size={40} className="mb-3 text-success" />,
      route: "/search",
    },
    {
      title: "Admin Panel",
      desc: "Manage users, roles, and permissions with ease.",
      icon: <FaUserShield size={40} className="mb-3 text-warning" />,
      route: "/admin",
    },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        minHeight: "100vh",
        width: "100vw", // ensures full width
        position: "fixed", // locks it
        top: 60,
        left: 0,
        padding: "100px 0",
      }}
    >
      <div className="container text-white">
        <motion.h2
          className="fw-bold mb-3 text-center"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Document Management System
        </motion.h2>
        <p className="text-center text-light mb-5">
          Your digital vault for <b>secure</b> and <b>fast</b> document
          management.
        </p>

        <div className="row g-4">
          {features.map((f, i) => (
            <motion.div
              className="col-md-4"
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.3 }}
            >
              <div
                className="card text-center shadow-lg border-0 h-100 p-4"
                style={{
                  borderRadius: "20px",
                  backdropFilter: "blur(12px)",
                  background: "rgba(255, 255, 255, 0.9)",
                  transition: "transform 0.3s ease-in-out",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform =
                    "translateY(-8px) scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0) scale(1)")
                }
              >
                {f.icon}
                <h4 className="fw-bold mb-3" style={{ color: "#333" }}>
                  {f.title}
                </h4>
                <p className="text-muted">{f.desc}</p>
                <button
                  className="btn btn-primary mt-2"
                  style={{
                    borderRadius: "10px",
                    padding: "8px 18px",
                  }}
                  onClick={() => navigate(f.route)} // 🔗 navigate to respective page
                >
                  Explore
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
