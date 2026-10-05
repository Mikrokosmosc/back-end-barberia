import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../header/Header";
import "./registrarse.css";

function Registrarse() {

    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [clave1, setClave1] = useState("");
    const [clave2, setClave2] = useState("");

    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("");
    const [mostrarMensaje, setMostrarMensaje] = useState(false);

    const sendData = (data) => {

        axios.post('https://back-end-project-barberia.onrender.com/registerUser', data)
            .then((response) => {

                setMostrarMensaje(true);
                setTipoMensaje("exito");
                setMensaje(response.data);

            }).catch((error) => {
                console.log('Error en POST: ' + error);
            });

    };

    const registrar = () => {

        const url = "/";

        if (nombre === "" || telefono === "" || clave1 === "" || clave2 === "") {
            setMostrarMensaje(true);
            setTipoMensaje("error");
            setMensaje("Complete todos los campos");
            return;
        }

        if (clave1 !== clave2) {
            setMostrarMensaje(true);
            setTipoMensaje("error");
            setMensaje("Las contraseñas no coinciden");
            return;
        }

        sendData({
            userName: nombre,
            phone: telefono,
            password: clave1
        });

        setTimeout(() => {
            navigate(url);
        }, 3000);

    };

    return (
        <>

        <Header />

        <div className="fondo">
            <div className="contenedor">
                <div className="caja">

                    <div className="titulo">Registro</div>

                    <div className="logo-registro">
                    </div>

                    <div className="grupo">
                        <label>Escriba su usuario</label>
                        <input
                            type="text"
                            id="nombre"
                            placeholder="nombre:"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>

                    <div className="grupo">
                        <label>Numero de telefono</label>
                        <input
                            type="text"
                            id="telefono"
                            placeholder="numero:"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                        />
                    </div>

                    <div className="grupo">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            id="clave1"
                            placeholder="contraseña:"
                            value={clave1}
                            onChange={(e) => setClave1(e.target.value)}
                        />
                    </div>

                    <div className="grupo">
                        <label>Verifique su contraseña</label>
                        <input
                            type="password"
                            id="clave2"
                            placeholder="contraseña:"
                            value={clave2}
                            onChange={(e) => setClave2(e.target.value)}
                        />
                    </div>

                    <button className="boton" onClick={registrar}>Registrarse</button>

                    <div
                        id="mensaje"
                        className={`mensaje ${tipoMensaje}`}
                        style={{ display: mostrarMensaje ? "block" : "none" }}
                    >
                        {mensaje}
                    </div>

                    <div className="texto">
                        ¿Ya tiene una cuenta? <span><Link to="/login">Iniciar sesion</Link></span>
                    </div>

                </div>
            </div>
        </div>

        </>
    );
}

export default Registrarse;
