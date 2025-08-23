import React, { useState } from "react";
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

  const personalNames = ["John", "Tom", "Emily"];
  const professionalDepartments = ["Accounts", "HR", "IT", "Finance"];

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

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
        uploaded_by: "", // optional
        start: 0,
        length: 10,
        filterId: "",
        search: { value: "" },
      };

      const res = await api.post("/searchDocumentEntry", body);
      console.log("Search Response:", res.data);
      setResults(res.data.documents || []); // adjust based on actual backend response
    } catch (err) {
      console.error("Search Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2 className="mb-4">Search Documents</h2>

        {/* Search Form */}
        <form onSubmit={handleSearch}>
          {/* Category */}
          <div className="mb-3">
            <label className="form-label">Category</label>
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

          {/* Date Range */}
          <div className="mb-3">
            <label className="form-label">From Date</label>
            <input
              type="date"
              className="form-control"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">To Date</label>
            <input
              type="date"
              className="form-control"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="mt-5">
        <h3>Results</h3>
        {results.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((doc, index) => (
                <tr key={index}>
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
                    <button className="btn btn-sm btn-success me-2">
                      Preview
                    </button>
                    <button className="btn btn-sm btn-primary">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
