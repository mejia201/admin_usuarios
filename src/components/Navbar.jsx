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
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          // Limpiar el token y redirigir al login
          localStorage.removeItem('token');
          navigate('/login');
        });
      } else {
        throw new Error('Error al cerrar sesión');
      }
    } catch (error) {
      // Manejar errores y notificar al usuario
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al cerrar sesión. Intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };


  const handleDeleteAccount = async () => {
  
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer. Tu cuenta será eliminada permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar cuenta',
      cancelButtonText: 'Cancelar',
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
            title: 'Cuenta eliminada',
            text: 'Tu cuenta ha sido eliminada exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            // Limpiar el token, el estado del usuario y redirigir al login
            localStorage.removeItem('token');
            setUser(null); 
            console.log("Redirigiendo al login...");
            navigate('/login');
          });
        } else {
          throw new Error('Error al eliminar la cuenta');
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al eliminar tu cuenta. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } else {
      // Si el usuario cancela la acción
      Swal.fire({
        title: 'Cancelado',
        text: 'Tu cuenta no ha sido eliminada.',
        icon: 'info',
        confirmButtonText: 'OK',
      });
    }
  };
  

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#e3f2fd" }}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/home">
          Home
        </a>
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
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/stadistics">
                Estadísticas
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
                  <button
                    className="dropdown-item"
                    onClick={() => setShowModal(true)}
                  >
                    Editar Perfil
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleDeleteAccount}>
                    Eliminar Cuenta
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
