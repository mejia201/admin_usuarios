import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (!user) return;

    let logoutTimer;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        localStorage.removeItem("token");
        setUser(null);
        Swal.fire("Session closed", "Your session timed out due to inactivity", "warning");
        navigate("/login");
      }, 5 * 60 * 1000); // 5 minutos
    };

    resetTimer();

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    return () => {
      clearTimeout(logoutTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [user, navigate, setUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateUser = async () => {
    try {
      const updatedData = { ...formData };

      if (!updatedData.password) {
        delete updatedData.password;
      }

      const response = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error updating user");
      }

      Swal.fire("¡Éxito!", "User successfully updated", "success");
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
      <div className="container text-center mt-5">
        <h1>Welcome, {user?.name || "Usuario"}!</h1>
        <p>Email: {user?.email}</p>

        <img 
          src="https://media.giphy.com/media/xUPGcyi4YxcZp8dWZq/giphy.gif" 
          alt="Welcome GIF" 
          className="img-fluid mt-3"
          style={{ maxWidth: "400px", borderRadius: "10px" }} 
        />

      </div>

      {/* Modal para editar el usuario */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="New password (opcional)"
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
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateUser}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
