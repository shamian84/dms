import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

export default function SearchPage() {
  const [majorHead, setMajorHead] = useState("");
  const [minorHead, setMinorHead] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sorting
  const [sortField, setSortField] = useState("document_date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Selection
  const [selectedDocs, setSelectedDocs] = useState([]);

  const personalNames = ["John", "Tom", "Emily"];
  const professionalDepartments = ["Accounts", "HR", "IT", "Finance"];

  // Add tag
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };
  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Clear filters
  const handleClear = () => {
    setMajorHead("");
    setMinorHead("");
    setTags([]);
    setNewTag("");
    setFromDate("");
    setToDate("");
    setResults([]);
    setCurrentPage(1);
  };

  // Perform search
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        major_head: majorHead,
        minor_head: minorHead,
        from_date: fromDate,
        to_date: toDate,
        tags: tags.map((t) => ({ tag_name: t })),
        uploaded_by: "",
        start: 0,
        length: 50, // fetch more, paginate on frontend
        filterId: "",
        search: { value: "" },
      };

      const res = await api.post("/searchDocumentEntry", body);
      let docs = res.data.documents || [];

      // Apply sorting
      docs = [...docs].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (!aVal || !bVal) return 0;
        return sortOrder === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });

      setResults(docs);
    } catch (err) {
      console.error("Search Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const paginatedResults = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Select docs
  const toggleSelectDoc = (doc) => {
    if (selectedDocs.includes(doc)) {
      setSelectedDocs(selectedDocs.filter((d) => d !== doc));
    } else {
      setSelectedDocs([...selectedDocs, doc]);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        left: 0,
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          padding: "80px 0",
        }}
      >
        {/* Outer Card - Responsive Center */}
        <motion.div
          className="card p-4 shadow-lg mx-auto"
          style={{
            borderRadius: "10px",
            boxShadow: "0 12px 20px rgba(0,0,0,0.25)",
            background: "linear-gradient(135deg, #ffffff, #f8f9ff)",
            maxWidth: "900px", // responsive max width
            width: "95%", // shrink on small devices
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Search Card */}
          <div
            className="card p-4 mx-auto"
            style={{
              borderRadius: "15px",
              background: "linear-gradient(135deg, #ffffff, #f8f9ff)",
              maxWidth: "850px", // slightly smaller
              width: "100%",
            }}
          >
            <h2 className="fw-bold text-center mb-4">🔍 Search Documents</h2>

            <form onSubmit={handleSearch} className="row g-4">
              {/* LEFT */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold">📂 Category</label>
                  <select
                    className="form-control"
                    value={majorHead}
                    onChange={(e) => {
                      setMajorHead(e.target.value);
                      setMinorHead("");
                    }}
                  >
                    <option value="">Select</option>
                    <option value="Personal">Personal</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>

                {majorHead && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      {majorHead === "Personal" ? "👤 Name" : "🏢 Department"}
                    </label>
                    <select
                      className="form-control"
                      value={minorHead}
                      onChange={(e) => setMinorHead(e.target.value)}
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

              {/* RIGHT */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold">📅 From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">📅 To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>

                <div className="d-flex gap-2 mt-4">
                  <motion.button
                    type="submit"
                    className="btn btn-primary w-100 fw-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                  >
                    {loading ? "⏳ Searching..." : "🔍 Search"}
                  </motion.button>
                  <motion.button
                    type="button"
                    className="btn btn-outline-secondary fw-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClear}
                  >
                    Clear
                  </motion.button>
                </div>
              </div>
            </form>
          </div>

          {/* Results Section */}
          <div className="mt-5">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="fw-bold">📂 Results ({results.length})</h3>
              {results.length > 0 && (
                <div className="d-flex gap-2">
                  <select
                    className="form-select"
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                  >
                    <option value="document_date">Date</option>
                    <option value="file_name">File Name</option>
                    <option value="major_head">Category</option>
                  </select>
                  <button
                    className="btn btn-outline-dark"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                  >
                    {sortOrder === "asc" ? "⬆ Asc" : "⬇ Desc"}
                  </button>
                  {selectedDocs.length > 0 && (
                    <motion.button
                      className="btn btn-warning"
                      whileHover={{ scale: 1.05 }}
                    >
                      ⬇ Download Selected ({selectedDocs.length})
                    </motion.button>
                  )}
                </div>
              )}
            </div>

            <AnimatePresence>
              {results.length === 0 ? (
                <motion.div
                  className="alert alert-light mt-3 shadow-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ⚠️ No documents found. Try adjusting filters.
                </motion.div>
              ) : loading ? (
                <div className="text-center mt-4">
                  <div className="spinner-border text-light"></div>
                  <p className="mt-2">Loading results...</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div style={{ overflowX: "auto" }}>
                    <table className="table table-hover mt-3">
                      <thead className="table-dark sticky-top">
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              onChange={(e) =>
                                setSelectedDocs(
                                  e.target.checked ? [...results] : []
                                )
                              }
                              checked={
                                selectedDocs.length === results.length &&
                                results.length > 0
                              }
                            />
                          </th>
                          <th>File Name</th>
                          <th>Category</th>
                          <th>Tags</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedResults.map((doc, index) => (
                          <tr key={index} className="align-middle">
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedDocs.includes(doc)}
                                onChange={() => toggleSelectDoc(doc)}
                              />
                            </td>
                            <td>{doc.file_name || "N/A"}</td>
                            <td>{doc.major_head}</td>
                            <td>
                              {doc.tags?.map((t, i) => (
                                <span key={i} className="badge bg-info me-1">
                                  {t.tag_name}
                                </span>
                              ))}
                            </td>
                            <td>{doc.document_date}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-success me-2"
                                onClick={() => setPreviewFile(doc)}
                              >
                                Preview
                              </button>
                              <a
                                href={doc.file_url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-primary"
                              >
                                Download
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="d-flex justify-content-center mt-3 gap-2">
                    <button
                      className="btn btn-outline-light"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      ⬅ Prev
                    </button>
                    <span className="text-dark align-self-center">
                      Page {currentPage} / {totalPages}
                    </span>
                    <button
                      className="btn btn-outline-light"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next ➡
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Preview Modal */}
          <AnimatePresence>
            {previewFile && (
              <motion.div
                className="modal d-block"
                tabIndex="-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
              >
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        Preview: {previewFile.file_name}
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setPreviewFile(null)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      {previewFile.file_url?.endsWith(".pdf") ? (
                        <iframe
                          src={previewFile.file_url}
                          width="100%"
                          height="500px"
                          title="PDF Preview"
                        ></iframe>
                      ) : previewFile.file_url?.match(
                          /\.(jpg|jpeg|png|gif)$/i
                        ) ? (
                        <img
                          src={previewFile.file_url}
                          alt="Preview"
                          className="img-fluid rounded shadow"
                        />
                      ) : (
                        <p>Preview not available for this file type.</p>
                      )}
                    </div>
                    <div className="modal-footer">
                      <a
                        href={previewFile.file_url}
                        className="btn btn-primary"
                        download
                      >
                        Download
                      </a>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setPreviewFile(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
