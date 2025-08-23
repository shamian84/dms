import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function UploadPage() {
  const [date, setDate] = useState("");
  const [majorHead, setMajorHead] = useState(""); // Personal or Professional
  const [minorHead, setMinorHead] = useState(""); // Names or Departments
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // Predefined options
  const personalNames = ["John", "Tom", "Emily"];
  const professionalDepartments = ["Accounts", "HR", "IT", "Finance"];

  // Fetch existing tags from API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.post("/documentTags", { term: "" });
        console.log("Tags Response:", res.data);
        setAllTags(res.data.tags || []); // assuming API returns { tags: [...] }
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, []);

  // Add a tag
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Metadata object
    const data = {
      major_head: majorHead,
      minor_head: minorHead,
      document_date: date,
      document_remarks: remarks,
      tags: tags.map((t) => ({ tag_name: t })),
      user_id: "admin", // mock user
    };

    formData.append("data", JSON.stringify(data));

    try {
      const res = await api.post("/saveDocumentEntry", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload Response:", res.data);
      setMessage("File uploaded successfully!");
    } catch (err) {
      console.error("Upload Error:", err);
      setMessage("Failed to upload file.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow w-75 mx-auto">
        <h2 className="mb-4">Upload Document</h2>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          {/* Date Picker */}
          <div className="mb-3">
            <label className="form-label">Document Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Major Head */}
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={majorHead}
              onChange={(e) => {
                setMajorHead(e.target.value);
                setMinorHead(""); // reset
              }}
              required
            >
              <option value="">Select</option>
              <option value="Personal">Personal</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          {/* Minor Head */}
          {majorHead && (
            <div className="mb-3">
              <label className="form-label">
                {majorHead === "Personal" ? "Name" : "Department"}
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
                ).map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tags */}
          <div className="mb-3">
            <label className="form-label">Tags</label>
            <div className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddTag}
              >
                Add Tag
              </button>
            </div>
            <div className="mt-2">
              {tags.map((t, i) => (
                <span key={i} className="badge bg-primary me-2">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div className="mb-3">
            <label className="form-label">Remarks</label>
            <textarea
              className="form-control"
              rows="3"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            ></textarea>
          </div>

          {/* File Upload */}
          <div className="mb-3">
            <label className="form-label">Upload File</label>
            <input
              type="file"
              className="form-control"
              accept=".pdf,image/*"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}
