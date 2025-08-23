import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";

export default function UploadPage() {
  const [date, setDate] = useState("");
  const [majorHead, setMajorHead] = useState("");
  const [minorHead, setMinorHead] = useState("");
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const personalNames = ["John", "Tom", "Emily"];
  const professionalDepartments = ["Accounts", "HR", "IT", "Finance"];

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.post("/documentTags", { term: "" });
        setAllTags(res.data.tags || []);
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, []);

  // Add tag
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  // Remove tag
  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Handle drag-drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = () => setDragActive(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    validateFile(droppedFile);
  };

  // Validate file type/size
  const validateFile = (f) => {
    if (!f) return;
    if (!["application/pdf", "image/png", "image/jpeg"].includes(f.type)) {
      setMessage("❌ Only PDF, PNG, or JPEG allowed.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setMessage("❌ File size must be under 5MB.");
      return;
    }
    setFile(f);
    setMessage("");
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("⚠️ Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const data = {
      major_head: majorHead,
      minor_head: minorHead,
      document_date: date,
      document_remarks: remarks,
      tags: tags.map((t) => ({ tag_name: t })),
      user_id: "admin",
    };

    formData.append("data", JSON.stringify(data));

    try {
      setUploading(true);
      setProgress(0);

      const res = await api.post("/saveDocumentEntry", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      console.log("Upload Response:", res.data);
      setMessage("✅ File uploaded successfully!");
      setFile(null);
      setTags([]);
      setDate("");
      setRemarks("");
    } catch (err) {
      console.error("Upload Error:", err);
      setMessage("❌ Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        minHeight: "100vh",
        width: "100vw", // ensures full width
        position: "fixed", // locks it
        top: 60,
        left: 0,
      }}
    >
      <div
        className="container mt-5"
        style={{ position: "relative", zIndex: 1, padding: "40px 0" }}
      >
        <motion.div
          className="card p-4 shadow-lg w-75 mx-auto"
          style={{
            borderRadius: "10px",
            boxShadow: "0 12px 20px rgba(0,0,0,0.25)",
            background: "linear-gradient(135deg, #667eea, #f3f6ff)",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 fw-bold text-center">📤 Upload Document</h2>

          {message && (
            <motion.div
              className={`alert text-center ${
                message.includes("✅") ? "alert-success" : "alert-danger"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="row g-4">
            {/* LEFT COLUMN */}
            <div className="col-md-6">
              {/* Date */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  📅 Document Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* Major */}
              <div className="mb-3">
                <label className="form-label fw-semibold">📂 Category</label>
                <select
                  className="form-control"
                  value={majorHead}
                  onChange={(e) => {
                    setMajorHead(e.target.value);
                    setMinorHead("");
                  }}
                  required
                >
                  <option value="">Select</option>
                  <option value="Personal">Personal</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>

              {/* Minor */}
              {majorHead && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    {majorHead === "Personal" ? "👤 Name" : "🏢 Department"}
                  </label>
                  <select
                    className="form-control"
                    value={minorHead}
                    onChange={(e) => setMinorHead(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    {(majorHead === "Personal"
                      ? personalNames
                      : professionalDepartments
                    ).map((item, i) => (
                      <option key={i} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tags */}
              <div className="mb-3">
                <label className="form-label fw-semibold">🏷️ Tags</label>
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control me-2"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn"
                    style={{ backgroundColor: "#4da6ff", color: "white" }}
                    onClick={handleAddTag}
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2">
                  {tags.map((t, i) => (
                    <motion.span
                      key={i}
                      className="badge bg-primary me-2 p-2"
                      whileHover={{ scale: 1.1 }}
                    >
                      {t}{" "}
                      <span
                        role="button"
                        className="ms-1"
                        onClick={() => handleRemoveTag(t)}
                      >
                        ❌
                      </span>
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-md-6">
              {/* Remarks */}
              <div className="mb-3">
                <label className="form-label fw-semibold">📝 Remarks</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                ></textarea>
              </div>

              {/* File Upload + Drag Drop */}
              <div
                className={`mb-3 p-4 border rounded text-center ${
                  dragActive ? "bg-light border-success" : "border-secondary"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <label className="form-label fw-semibold d-block">
                  📎 Upload File (Drag & Drop or Click)
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf,image/*"
                  onChange={(e) => validateFile(e.target.files[0])}
                />
                {file && (
                  <div className="mt-3">
                    {file.type.includes("image") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        width="120"
                        className="rounded shadow"
                      />
                    ) : (
                      <p className="text-muted">📄 {file.name}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {uploading && (
                <div className="progress mb-3">
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                  >
                    {progress}%
                  </div>
                </div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                className="btn btn-success w-100 py-2 fw-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={uploading}
              >
                {uploading ? "⏳ Uploading..." : "🚀 Upload"}
              </motion.button>

              {/* Back */}
              <motion.button
                type="button"
                className="btn btn-outline-dark w-100 mt-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/dashboard")}
              >
                ⬅ Back to Dashboard
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
