import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/context/UserContext";

export const Home = () => {
  const { user } = useUser(); // Obtiene los datos del usuario del contexto
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Limpia el token
    navigate("/login"); // Redirige al login
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          {/* Brand */}
          <a className="navbar-brand" href="/home">
            Home
          </a>

          {/* Toggler for responsive menu */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar items */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" href="#">
                  Estadísticas
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Agregar Usuario
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="userMenu"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user?.name || "Usuario"}
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userMenu"
                >
                  <li>
                    <button className="dropdown-item">Editar Perfil</button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="container mt-5">
        <h1>Bienvenido, {user?.name || "Usuario"}!</h1>
        <p>Correo: {user?.email}</p>
      </div>
    </>
  );
};
