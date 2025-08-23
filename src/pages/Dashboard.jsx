import React, { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  // const { logout } = useContext(AuthContext);

  return (
    <div className="container mt-5">
      <h2>Welcome to Document Management System</h2>
      {/* <button className="btn btn-danger mt-3" onClick={logout}>
        Logout
      </button> */}
    </div>
  );
}
