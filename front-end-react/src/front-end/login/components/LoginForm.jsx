import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { guardarSesion } from "../../header/session";

const API_URL = "https://back-end-project-barberia.onrender.com";

function LoginForm({ onIngresoAdmin }) {

    const navigate = useNavigate();

    const [rol, setRol] = useState("Cliente");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [mensajeError, setMensajeError] = useState("");

    const mostrarError = (mensaje) => {
        setMensajeError(mensaje);
    };

    const validateAdmin = (data) => {

        axios.post(`${API_URL}/validateAdmin`, data)
            .then(response => {

                const resultado = response.data;

                if (resultado && resultado.rol) {

                    guardarSesion({
                        id: resultado.id,
                        userName: resultado.userName,
                        rol: resultado.rol
                    });

                    onIngresoAdmin();

                } else {
                    mostrarError("Datos incorrectos");
                }

            })
            .catch(error => {
                console.error("Error validando administrador:", error);
                mostrarError("No se pudo conectar con el servidor");
            });

    };

    const validateClient = (data) => {

        axios.post(`${API_URL}/validateClient`, data)
            .then(response => {

                const resultado = response.data;

                if (resultado && resultado.rol) {

                    guardarSesion({
                        id: resultado.id,
                        userName: resultado.userName,
                        rol: resultado.rol
                    });

                    navigate("/");

                } else {

                    mostrarError(
                        resultado === "Usuario no registrado"
                            ? resultado
                            : "Datos incorrectos"
                    );

                }

            })
            .catch(error => {
                console.error("Error validando cliente:", error);
                mostrarError("No se pudo conectar con el servidor");
            });

    };

    const entrar = () => {

        const userTrim = user.trim();

        if (!userTrim || !password) {
            setMensajeError("Complete todos los campos");
            return;
        }

        const data = {
            userName: userTrim,
            password: password
        };

        if (rol === "Administrador") {
            validateAdmin(data);
        } else {
            validateClient(data);
        }

    };

    return (
        <div className="login" id="login">

            <div className="login-box">

                <h2>BARBERIA</h2>

                <input
                    id="user"
                    type="text"
                    placeholder="Usuario"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                />

                <input
                    id="password"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <select id="rol" value={rol} onChange={(e) => setRol(e.target.value)}>
                    <option value="Cliente">Cliente</option>
                    <option value="Administrador">Administrador</option>
                </select>

                <button id="btnIngresar" type="button" onClick={entrar}>
                    Ingresar
                </button>

                <p className="messageError">{mensajeError}</p>

            </div>

        </div>
    );
}

export default LoginForm;
