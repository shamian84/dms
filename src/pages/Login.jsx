import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = mobile input, 2 = otp input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔹 Access login function from AuthContext
  const { login } = useContext(AuthContext);

  // Step 1: Generate OTP
  const handleGenerateOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/generateOTP", { mobile_number: mobile });
      console.log("Generate OTP Response:", res.data);
      setStep(2); // move to OTP input
    } catch (err) {
      console.error("Generate OTP Error:", err);
      setError("Failed to generate OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Validate OTP
  const handleValidateOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/validateOTP", {
        mobile_number: mobile,
        otp,
      });

      console.log("Validate OTP Response:", res.data);

      // Try multiple possible token locations
      const token =
        res.data.token || res.data?.data?.token || res.data?.Token || null;

      if (token) {
        login(token); // ✅ save token via context
        navigate("/dashboard");
      } else {
        setError("Invalid response: " + JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Validate OTP Error:", err);
      setError("Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow w-50">
        <h2 className="text-center mb-4">Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleGenerateOtp}>
            <div className="mb-3">
              <label className="form-label">Mobile Number</label>
              <input
                type="text"
                className="form-control"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleValidateOtp}>
            <div className="mb-3">
              <label className="form-label">Enter OTP</label>
              <input
                type="text"
                className="form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
