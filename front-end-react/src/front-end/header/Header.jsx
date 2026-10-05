import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { obtenerSesionGlobal, cerrarSesionGlobal } from "./session";
import "./header.css";

function Header() {

    const location = useLocation();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        setUsuario(obtenerSesionGlobal());
    }, [location.pathname]);

    const esActivo = (path) => location.pathname === path;

    const handleCerrarSesion = (event) => {
        event.preventDefault();
        cerrarSesionGlobal(navigate);
    };

    const renderLink = (path, texto) => {

        if (esActivo(path)) {
            return (
                <li style={{ color: "white" }}>
                    <strong>
                        <Link to={path}>{texto}</Link>
                    </strong>
                </li>
            );
        }

        return (
            <li>
                <Link to={path}>{texto}</Link>
            </li>
        );
    };

    return (
        <header>

            <div className="content-logo">

                <img className="logo" src={logo} alt="logo" />

                <h3 className="name-barberia" style={{ color: "white" }}>
                    M&A
                </h3>

            </div>

            <nav>

                <ul className="list-nav">

                    {renderLink("/", "Inicio")}
                    {renderLink("/contacto", "Contacto")}
                    {renderLink("/servicios", "Servicios")}

                    <li
                        className="link-reservas"
                        style={{ display: usuario ? "inline-block" : "none" }}
                    >
                        <Link to="/reservas">Reservas</Link>
                    </li>

                    <li
                        className="link-registro"
                        style={{ display: usuario ? "none" : "" }}
                    >
                        <Link to="/registrarse">Registrarse</Link>
                    </li>

                    <li
                        className="link-login"
                        style={{ display: usuario ? "none" : "" }}
                    >
                        <Link to="/login">Iniciar sesion</Link>
                    </li>

                    {usuario && (
                        <li className="link-usuario-sesion">
                            <span style={{ color: "gold", marginRight: "12px" }}>
                                👤 {usuario.userName}
                            </span>
                            <a
                                href="/"
                                style={{ color: "#bbb" }}
                                onClick={handleCerrarSesion}
                            >
                                Cerrar sesión
                            </a>
                        </li>
                    )}

                </ul>

            </nav>

        </header>
    );
}

export default Header;
