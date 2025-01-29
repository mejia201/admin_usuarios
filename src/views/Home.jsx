import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/context/UserContext";
import { Navbar } from "../components/Navbar";
import Swal from "sweetalert2";

export const Home = () => {
  const { user, setUser } = useUser(); 
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false); 
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateUser = async () => {
    try {

      const updatedData = { ...formData };

      // Si el password está vacío, lo eliminamos del objeto
      if (!updatedData.password) {
        delete updatedData.password;
      }

      const response = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedData),
        credentials: "include"
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar usuario");
      }
  
      Swal.fire("¡Éxito!", "Usuario actualizado correctamente", "success");
      setUser(data.data);
      setShowModal(false);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };
  
  
  
  
  return (
    <>
      {/* Navbar */}
      <Navbar setShowModal={setShowModal} />

      {/* Main content */}
      <div className="container mt-5">
        <h1>Bienvenido, {user?.name || "Usuario"}!</h1>
        <p>Correo: {user?.email}</p>
      </div>

      {/* Modal para editar el usuario */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Perfil</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Nueva contraseña (opcional)"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateUser}
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
