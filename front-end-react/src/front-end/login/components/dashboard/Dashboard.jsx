import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Inicio from "./sections/Inicio";
import Citas from "./sections/Citas";
import Barberos from "./sections/Barberos";
import Servicios from "./sections/Servicios";
import { obtenerSesionGlobal, cerrarSesionGlobal } from "../../../header/session";

function Dashboard() {

    const navigate = useNavigate();

    const [seccionActiva, setSeccionActiva] = useState("inicio");
    const [menuActivo, setMenuActivo] = useState(false);

    const usuario = obtenerSesionGlobal();

    const mostrar = (seccion) => {
        setSeccionActiva(seccion);
    };

    const toggleMenu = () => {
        setMenuActivo(prev => !prev);
    };

    const handleLogout = () => {
        cerrarSesionGlobal(navigate);
    };

    return (
        <div className="dashboard" id="dashboard">

            <div id="navbar-container">
                <Navbar
                    usuario={usuario}
                    onToggleMenu={toggleMenu}
                    onLogout={handleLogout}
                />
            </div>

            <div id="sidebar-container">
                <Sidebar
                    activo={seccionActiva}
                    onSeleccionar={mostrar}
                    menuActivo={menuActivo}
                />
            </div>

            <main className="main">

                <div id="inicio-container">
                    <Inicio activa={seccionActiva === "inicio"} />
                </div>

                <div id="citas-container">
                    <Citas activa={seccionActiva === "citas"} />
                </div>

                <div id="barberos-container">
                    <Barberos activa={seccionActiva === "barberos"} />
                </div>

                <div id="servicios-container">
                    <Servicios activa={seccionActiva === "servicios"} />
                </div>

            </main>

        </div>
    );
}

export default Dashboard;
