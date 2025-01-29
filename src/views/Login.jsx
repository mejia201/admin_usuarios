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
        title: "Inicio de sesión exitoso",
        text: "Bienvenido al sistema.",
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
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Login</h3>
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
          <button type="submit" className="btn btn-primary w-100">
            Ingresar
          </button>
        </form>
        {error && <p className="text-danger mt-3">{error}</p>}

        <p className="text-center mt-3">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-primary text-decoration-none">
            Regístrate
          </a>
        </p>

      </div>
    </div>
  );
};
