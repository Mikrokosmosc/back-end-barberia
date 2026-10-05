import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/dashboard/Dashboard";
import { obtenerSesionGlobal } from "../header/session";
import "./login.css";

function Login() {

    const navigate = useNavigate();

    const [vista, setVista] = useState("cargando");

    useEffect(() => {

        const usuario = obtenerSesionGlobal();

        if (!usuario) {
            setVista("login");
            return;
        }

        if (usuario.rol === "Administrador") {
            setVista("dashboard");
            return;
        }

        if (usuario.rol === "Cliente") {
            navigate("/");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>

            {vista === "login" && (
                <div id="login-container">
                    <LoginForm onIngresoAdmin={() => setVista("dashboard")} />
                </div>
            )}

            {vista === "dashboard" && (
                <div id="dashboard-container">
                    <Dashboard />
                </div>
            )}

        </div>
    );
}

export default Login;
