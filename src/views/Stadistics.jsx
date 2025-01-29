import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { useUser } from "../components/context/UserContext";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export const Stadistics = () => {
  const [statistics, setStatistics] = useState(null); 
  const { user, setUser } = useUser(); 
  
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem("token"); 
        if (!token) {
          throw new Error("Token no disponible. Por favor, inicia sesión.");
        }

        const response = await fetch("http://localhost:8000/api/statistics", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          const errorData = await response.text(); 
          throw new Error(
            `Error ${response.status}: ${
              errorData || "No se pudieron obtener las estadísticas"
            }`
          );
        }

        const data = await response.json();
        setStatistics(data); 
      } catch (err) {
        console.error("Error al obtener estadísticas:", err);
        setError(err.message);
      }
    };

    fetchStatistics();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!statistics) {
    return <h4 className="text-center mt-5">Cargando estadísticas...</h4>; 
  }

  
  const chartData = {
    labels: ["Diario", "Semanal", "Mensual"], 
    datasets: [
      {
        label: "Estadísticas",
        data: [statistics.daily, statistics.weekly, statistics.monthly], 
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)", // Color para "Diario"
          "rgba(153, 102, 255, 0.6)", // Color para "Semanal"
          "rgba(255, 159, 64, 0.6)", // Color para "Mensual"
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)", 
          "rgba(153, 102, 255, 1)", 
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1, // Ancho del borde
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <>
      <Navbar setShowModal={setShowModal} />
      <div className="container mt-5 text-center">
        <h2>Estadísticas</h2>
        <div className="mt-2 mb-5 text-center">
            <h6>Estimado, {user?.name || "Usuario"} te presentamos alguna estadisticas de la aplicacion:</h6>
        </div>
       
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </>
  );
};
