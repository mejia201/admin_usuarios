import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { useUser } from "../components/context/UserContext";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import "chart.js/auto";

export const Stadistics = () => {
  const [statistics, setStatistics] = useState(null);
  const { user, setUser } = useUser();
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
    return <h4 className="text-center mt-5">Loading stats...</h4>;
  }

  const chartData = {
    labels: ["Daily", "Weekly", "Monthly"],
    datasets: [
      {
        label: "Users added",
        data: [statistics.daily, statistics.weekly, statistics.monthly],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
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
      <Navbar />
      <div className="container mt-5 text-center">
        <h2>Statistics</h2>
        <h6 className="mb-4">
            Dear, {user?.name || "Usuario"}, we present you some
            application statistics:
        </h6>

        <div className="row justify-content-center mt-5">
          <div className="col-md-6 mb-4">
            <h5>Bar Chart</h5>
            <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="col-md-6 mb-4">
            <h5>Line Graph</h5>
            <Line data={chartData} options={chartOptions} />
          </div>
          <div className="col-md-6 mb-4 mt-4">
            <h5>Donut Chart</h5>
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </>
  );
};
