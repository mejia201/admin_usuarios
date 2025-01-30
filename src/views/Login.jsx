import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/context/UserContext";
import Swal from "sweetalert2";


export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser(); // Hook para actualizar el usuario en el contexto
  const [showPassword, setShowPassword] = useState(false); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Guarda los datos del usuario en el contexto
      setUser(data.user);

      // Guarda el token en localStorage
      localStorage.setItem("token", data.token);

      
   
      Swal.fire({
        icon: "success",
        title: "Successful login",
        text: "Welcome to the app.",
      });

      navigate("/home");
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
        <h3 className="text-center mb-4" style={{ color: "#6e8efb" }}>
          Login
        </h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderRadius: "8px" }}
            />
          </div>
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              className="form-control"
              id="password"
              type={showPassword ? "text" : "password"}
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
            Ingresar
          </button>
        </form>

        {error && <p className="text-danger mt-3 text-center">{error}</p>}

        <p className="text-center mt-3">
          You don't have an account?{" "}
          <a href="/register" className="text-primary text-decoration-none">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};
