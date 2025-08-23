import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0); // resend timer
  const [showOtp, setShowOtp] = useState(false); // toggle OTP
  const [rememberMe, setRememberMe] = useState(false); // stay logged in
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Step 1: Generate OTP
  const handleGenerateOtp = async (e, isResend = false) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/generateOTP", { mobile_number: mobile });
      console.log("Generate OTP Response:", res.data);

      if (res.data.status === true) {
        setStep(2);
        setSuccess(
          isResend ? "🔄 OTP resent successfully!" : "✅ OTP sent successfully!"
        );
        setCountdown(60);
      } else {
        if (res.data.data?.includes("not yet Registered")) {
          setSuccess("⚡ Mock Mode: Use OTP 1234 for testing.");
          setStep(2);
          setCountdown(60);
        } else {
          setError(res.data.data || "Failed to generate OTP.");
        }
      }
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
      // Mock mode
      if (otp === "1234") {
        const dummyToken = "mock-token-12345";
        saveToken(dummyToken);
        navigate("/dashboard");
        return;
      }

      const res = await api.post("/validateOTP", {
        mobile_number: mobile,
        otp,
      });

      console.log("Validate OTP Response:", res.data);

      const token =
        res.data.token || res.data?.data?.token || res.data?.Token || null;

      if (token) {
        saveToken(token);
        navigate("/dashboard");
      } else {
        setError(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("Validate OTP Error:", err);
      setError("Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save token (remember me or session only)
  const saveToken = (token) => {
    if (rememberMe) {
      localStorage.setItem("token", token);
    } else {
      sessionStorage.setItem("token", token);
    }
    login(token);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        minHeight: "100vh",
        width: "100vw", // ensures full width
        position: "fixed", // locks it
        top: 0,
        left: 0,
      }}
    >
      <div
        className="card p-5 shadow-lg border-0 animate__animated animate__fadeIn"
        style={{
          width: "400px",
          borderRadius: "20px",
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <h2 className="text-center mb-3 fw-bold" style={{ color: "#333" }}>
          🔐 Secure Login
        </h2>
        <p className="text-muted text-center mb-4">
          Access your documents safely
        </p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Step 1: Mobile Input */}
        {step === 1 && (
          <form onSubmit={handleGenerateOtp}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="mobileInput"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
              <label htmlFor="mobileInput">📱 Mobile Number</label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
              style={{ borderRadius: "10px", transition: "0.3s" }}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                "Send OTP"
              )}
            </button>

            <p className="text-center mt-3">
              <a href="#forgot" className="text-decoration-none small">
                ❓ Forgot your mobile? Contact admin
              </a>
            </p>
          </form>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && (
          <form onSubmit={handleValidateOtp}>
            <div className="form-floating mb-3 position-relative">
              <input
                type={showOtp ? "text" : "password"}
                className="form-control"
                id="otpInput"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <label htmlFor="otpInput">🔑 Enter OTP</label>

              {/* Show/Hide OTP */}
              <button
                type="button"
                className="btn position-absolute top-50 end-0 translate-middle-y me-2"
                style={{ border: "none", background: "transparent" }}
                onClick={() => setShowOtp(!showOtp)}
              >
                {showOtp ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Remember Me */}
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Stay logged in
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 py-2 mb-2"
              style={{ borderRadius: "10px", transition: "0.3s" }}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                "Verify OTP"
              )}
            </button>

            {/* Resend OTP */}
            <button
              type="button"
              className="btn btn-link w-100"
              onClick={(e) => handleGenerateOtp(e, true)}
              disabled={countdown > 0}
            >
              {countdown > 0
                ? `⏳ Resend OTP in ${countdown}s`
                : "🔄 Resend OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
