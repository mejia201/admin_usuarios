import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/context/UserContext";
import Swal from "sweetalert2";

export const Navbar = ({ setShowModal }) => {
  const { user } = useUser();
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {

      const response = await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
       
        Swal.fire({
          title: 'Session closed',
          text: 'You have successfully logged out.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          // Limpiar el token y redirigir al login
          localStorage.removeItem('token');
          navigate('/login');
        });
      } else {
        throw new Error('Error');
      }
    } catch (error) {
      // Manejar errores y notificar al usuario
      Swal.fire({
        title: 'Error',
        text: 'There was a problem logging out. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };


  const handleDeleteAccount = async () => {
  
    const result = await Swal.fire({
      title: '¿Are you sure?',
      text: 'This action cannot be undone. Your account will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete account',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      // Si el usuario confirma, procede a eliminar la cuenta
      try {
        const response = await fetch('http://localhost:8000/api/users/delete-account', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (response.ok) {
          Swal.fire({
            title: 'Account deleted',
            text: 'Your account has been successfully deleted.',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            // Limpiar el token, el estado del usuario y redirigir al login
            localStorage.removeItem('token');
            setUser(null); 
            navigate('/login');
          });
        } else {
          throw new Error('Error deleting account');
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'There was a problem deleting your account. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } else {
      // Si el usuario cancela la acción
      Swal.fire({
        title: 'Cancelled',
        text: 'Your account has not been deleted.',
        icon: 'info',
        confirmButtonText: 'OK',
      });
    }
  };
  

  return (
    <nav className="navbar navbar-expand-lg shadow-sm" style={{ backgroundColor: "#1976D2", padding: "10px 20px" }}>
      <div className="container-fluid">
        <a className="navbar-brand text-white fw-bold" href="/home">
          <i className="bi bi-house-door-fill"></i> Home
        </a>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link text-white" href="/stadistics">
                <i className="bi bi-bar-chart-fill"></i> Statistics
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-white fw-bold"
                href="#"
                id="userMenu"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle"></i> {user?.name || "Usuario"}
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item" onClick={() => setShowModal(true)}>
                    <i className="bi bi-pencil-square"></i> Edit profile
                  </button>
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </button>
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleDeleteAccount}>
                    <i className="bi bi-trash-fill"></i> Delete your account
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
