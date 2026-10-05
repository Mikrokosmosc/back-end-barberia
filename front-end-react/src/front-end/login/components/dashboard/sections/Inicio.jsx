import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

function Inicio({ activa }) {

    const [resumen, setResumen] = useState({
        citasHoy: 0,
        totalClientes: 0,
        ingresosMes: 0
    });

    const canvasReservasRef = useRef(null);
    const canvasIngresosRef = useRef(null);

    const chartReservasRef = useRef(null);
    const chartIngresosRef = useRef(null);

    const cargarResumen = () => {

        axios.get("https://back-end-project-barberia.onrender.com/getResumen")
            .then((response) => {

                const datos = response.data || {};

                // INC-002: se normalizan los valores a número para evitar que
                // un nulo o una cadena de texto impida mostrar el total.
                setResumen({
                    citasHoy: Number(datos.citasHoy) || 0,
                    totalClientes: Number(datos.totalClientes) || 0,
                    ingresosMes: Number(datos.ingresosMes) || 0
                });

            })
            .catch((error) => {
                console.error("Error cargando resumen:", error);
            });

    };

    const cargarGraficas = () => {

        const ctxReservas = canvasReservasRef.current;
        const ctxIngresos = canvasIngresosRef.current;

        if (!ctxReservas || !ctxIngresos) {
            return;
        }

        axios.get("https://back-end-project-barberia.onrender.com/getEstadisticas")
            .then((response) => {

                const meses = [
                    "Ene", "Feb", "Mar", "Abr",
                    "May", "Jun", "Jul", "Ago",
                    "Sep", "Oct", "Nov", "Dic"
                ];

                const reservasPorMes = new Array(12).fill(0);
                const ingresosPorMes = new Array(12).fill(0);

                response.data.forEach((fila) => {

                    const indice = fila.mes - 1;

                    reservasPorMes[indice] = fila.totalReservas;
                    ingresosPorMes[indice] = fila.ingresos || 0;

                });

                if (chartReservasRef.current) {
                    chartReservasRef.current.destroy();
                }

                if (chartIngresosRef.current) {
                    chartIngresosRef.current.destroy();
                }

                chartReservasRef.current = new Chart(ctxReservas, {
                    type: "line",
                    data: {
                        labels: meses,
                        datasets: [
                            {
                                label: "Reservas",
                                data: reservasPorMes,
                                borderColor: "gold",
                                backgroundColor: "rgba(255,215,0,0.2)",
                                fill: true,
                                tension: 0.4
                            }
                        ]
                    }
                });

                chartIngresosRef.current = new Chart(ctxIngresos, {
                    type: "line",
                    data: {
                        labels: meses,
                        datasets: [
                            {
                                label: "Ingresos",
                                data: ingresosPorMes,
                                borderColor: "#00ffcc",
                                backgroundColor: "rgba(0,255,204,0.2)",
                                fill: true,
                                tension: 0.4
                            }
                        ]
                    }
                });

            })
            .catch((error) => {
                console.error("Error cargando estadísticas:", error);
            });

    };

    useEffect(() => {

        if (activa) {
            cargarResumen();
            cargarGraficas();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activa]);

    return (
        <section id="inicio" className={`section ${activa ? "" : "hidden"}`}>

            <h1>Dashboard</h1>

            <div className="cards">

                <div className="card" id="citasHoy">
                    💈 Citas hoy: {resumen.citasHoy}
                </div>

                <div className="card" id="totalClientes">
                    👤 Clientes: {resumen.totalClientes}
                </div>

                <div className="card" id="ingresosMes">
                    💰 Ingresos del mes: ${resumen.ingresosMes.toLocaleString("es-CO")}
                </div>

            </div>

            <div className="estadisticas">

                <h2>Estadísticas de Reservas (Año)</h2>

                <div className="charts">

                    <div className="chart-box">
                        <h3>Reservas</h3>
                        <canvas id="graficaReservas" ref={canvasReservasRef}></canvas>
                    </div>

                    <div className="chart-box">
                        <h3>Ingresos</h3>
                        <canvas id="graficaIngresos" ref={canvasIngresosRef}></canvas>
                    </div>

                </div>

            </div>

        </section>
    );
}

export default Inicio;