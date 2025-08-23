import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <h2>Welcome to Document Management System</h2>

      <div className="mt-3">
        <button
          className="btn btn-secondary me-2"
          onClick={() => navigate("/admin")}
        >
          Go to Admin Page
        </button>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
