import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../header/Header";
import individualImg from "../images/individual-services.png";
import paqueteImg from "../images/package-services.png";
import { obtenerSesionGlobal } from "../header/session";
import "./servicios.css";

function Servicios() {

    const navigate = useNavigate();

    const [vista, setVista] = useState("principal");
    const [servicios, setServicios] = useState([]);

    const cargarServicios = (tipo) => {

        axios.get(`https://back-end-project-barberia.onrender.com/getServiciosPorTipo/${tipo}`)
            .then(res => {
                setServicios(res.data);
            })
            .catch(err => console.log(err));

    };

    const mostrarIndividuales = () => {
        setVista("individuales");
        cargarServicios("individual");
    };

    const mostrarPaquetes = () => {
        setVista("paquetes");
        cargarServicios("paquete");
    };

    const volver = () => {
        setVista("principal");
    };

    const reservar = (id) => {

        const servicio = servicios.find(s => s.id === id);

        if (!servicio) return;

        const sesion = obtenerSesionGlobal();

        if (!sesion || sesion.rol !== "Cliente") {
            alert("Debes iniciar sesión como cliente para poder reservar");
            navigate("/login");
            return;
        }

        localStorage.setItem("servicioSeleccionado", JSON.stringify(servicio));

        navigate("/reservas");

    };

    return (
        <>

            <Header />

            <div className="lines-content">
                <div className="hl"></div>
                <h1 style={{ color: "white" }}><strong>Servicios</strong></h1>
                <div className="hl"></div>
            </div>

            <section className={`services ${vista !== "principal" ? "hide" : ""}`}>

                <div className="bloque">
                    <img src={individualImg} alt="servicios individuales" />
                    <button onClick={mostrarIndividuales} className="btn-amarillo">
                        Servicios individuales
                    </button>
                </div>

                <div className="bloque">
                    <img src={paqueteImg} alt="paquetes de servicios" />
                    <button onClick={mostrarPaquetes} className="btn-amarillo">
                        Paquetes de servicios
                    </button>
                </div>

            </section>

            <section className={`individuales ${vista !== "individuales" ? "hide" : ""}`}>

                <div className="lado">
                    <img src={individualImg} alt="servicios individuales" />
                    <button className="btn-amarillo">Servicios individuales</button>
                </div>

                <div className="grid-2" id="listaIndividuales">

                    {servicios.length === 0 && vista === "individuales" && (
                        <p>No hay servicios disponibles</p>
                    )}

                    {vista === "individuales" && servicios.map(s => (
                        <div className="card" key={s.id}>
                            <h4>{s.nombre}</h4>
                            <p>$ {s.precio}</p>
                            <span>{s.duracion} min</span>
                            <button onClick={() => reservar(s.id)} className="btn-reservar">
                                reservar
                            </button>
                        </div>
                    ))}

                </div>

                <button onClick={volver} className="btn-volver">regresar</button>

            </section>

            <section className={`paquetes ${vista !== "paquetes" ? "hide" : ""}`}>

                <div className="lado">
                    <img src={paqueteImg} alt="paquetes de servicios" />
                    <button className="btn-amarillo">Paquetes de servicios</button>
                </div>

                <div className="grid-3" id="listaPaquetes">

                    {servicios.length === 0 && vista === "paquetes" && (
                        <p>No hay servicios disponibles</p>
                    )}

                    {vista === "paquetes" && servicios.map(s => (
                        <div className="card" key={s.id}>
                            <h4>{s.nombre}</h4>
                            <p>$ {s.precio}</p>
                            <span>{s.duracion} min</span>
                            <button onClick={() => reservar(s.id)} className="btn-reservar">
                                reservar
                            </button>
                        </div>
                    ))}

                </div>

                <button onClick={volver} className="btn-volver">regresar</button>

            </section>

        </>
    );
}

export default Servicios;
