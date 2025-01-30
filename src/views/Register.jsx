import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Passwords do not match.",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error");
      }

      Swal.fire({
        icon: "success",
        title: "Successful registration",
        text: "Your account has been created. You can now log in.",
      });

      navigate("/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #6e8efb, #a777e3)",
        height: "100vh",
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "400px",
          borderRadius: "15px",
          background: "#fff",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 className="text-center mb-4" style={{ color: "#6e8efb" }}>Register</h3>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="position-absolute"
              style={{
                right: "10px",
                top: "70%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
              }}
            >
              {showPassword ? (
                <i className="bi bi-eye-slash" aria-hidden="true"></i>
              ) : (
                <i className="bi bi-eye" aria-hidden="true"></i>
              )}
            </button>
          </div>
          <div className="mb-3 position-relative">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="position-absolute"
              style={{
                right: "10px",
                top: "70%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
              }}
              
            >
              {showConfirmPassword ? (
                <i className="bi bi-eye-slash" aria-hidden="true"></i>
              ) : (
                <i className="bi bi-eye" aria-hidden="true"></i>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{
              background: "#6e8efb",
              color: "#fff",
              borderRadius: "8px",
              padding: "10px",
              fontWeight: "bold",
              transition: "0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.target.style.background = "#a777e3")
            }
            onMouseOut={(e) => (e.target.style.background = "#6e8efb")}
          >
            Register
          </button>
        </form>
        <p className="text-center mt-3">
            Already have an account?{" "}
          <a href="/login" className="text-primary text-decoration-none">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};
