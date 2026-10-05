import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../header/Header";
import { obtenerSesionGlobal } from "../header/session";
import "./reservas.css";

function Reservas() {

    const navigate = useNavigate();

    const [sesion] = useState(() => obtenerSesionGlobal());

    const [servicio, setServicio] = useState(
        () => JSON.parse(localStorage.getItem("servicioSeleccionado")) || null
    );

    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [horasOcupadas, setHorasOcupadas] = useState("");
    const [listaHorasOcupadas, setListaHorasOcupadas] = useState([]);
    const [misReservas, setMisReservas] = useState([]);
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupTexto, setPopupTexto] = useState("");

    useEffect(() => {

        if (!sesion || sesion.rol !== "Cliente") {
            alert("Debes iniciar sesión como cliente para ver tus reservas");
            navigate("/login");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cargarMisReservas = () => {

        if (!sesion) return;

        axios.get(`https://back-end-project-barberia.onrender.com/getCitasPorCliente/${sesion.id}`)
            .then(res => {
                setMisReservas(res.data);
            })
            .catch(err => console.log(err));

    };

    useEffect(() => {
        cargarMisReservas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cargarHorasOcupadas = (fechaSeleccionada) => {

        if (!fechaSeleccionada) return;

        axios.get(`https://back-end-project-barberia.onrender.com/getCitasPorFecha/${fechaSeleccionada}`)
            .then(res => {

                if (res.data.length === 0) {
                    setHorasOcupadas("No hay horas ocupadas este día");
                    setListaHorasOcupadas([]);
                    return;
                }

                // INC-001: la BD devuelve la hora como "10:00:00" y el input type="time"
                // maneja "10:00", por lo que se normaliza a HH:MM para poder compararlas.
                const horas = res.data.map(c => String(c.hora).slice(0, 5));

                setListaHorasOcupadas(horas);
                setHorasOcupadas(`Horas ocupadas: ${horas.join(", ")}`);

            })
            .catch(err => console.log(err));

    };

    const handleFechaChange = (e) => {
        const nuevaFecha = e.target.value;
        setFecha(nuevaFecha);
        cargarHorasOcupadas(nuevaFecha);
    };

    const irFormulario = () => {

        if (!servicio) {
            alert("Selecciona primero un servicio desde la sección de Servicios");
            return;
        }

        if (!fecha || !hora) {
            alert("Selecciona fecha y hora");
            return;
        }

        // INC-001: validación en el cliente para no permitir seleccionar
        // una hora que ya aparece como ocupada en la fecha elegida.
        if (listaHorasOcupadas.includes(hora)) {
            alert("El horario seleccionado ya está reservado. Por favor elija otra hora.");
            return;
        }

        axios.post("https://back-end-project-barberia.onrender.com/crearCita", {
            id_Cliente: sesion.id,
            id_Servicio: servicio.id,
            fecha,
            hora
        })
            .then(() => {

                setPopupTexto(`Reservado: ${servicio.nombre} - ${fecha} ${hora}`);
                setPopupVisible(true);

                localStorage.removeItem("servicioSeleccionado");

                setServicio(null);

                cargarMisReservas();

                // Se refresca la lista de horas ocupadas para que la franja
                // recién reservada quede bloqueada de inmediato.
                cargarHorasOcupadas(fecha);

            })
            .catch(err => {

                console.log(err);

                // INC-001: el backend responde 409 con el mensaje de horario ocupado.
                const mensaje = err.response?.data?.message
                    || "No se pudo crear la reserva, intenta de nuevo";

                alert(mensaje);

                cargarHorasOcupadas(fecha);
            });

    };

    const cerrarPopup = () => {
        setPopupVisible(false);
    };

    const eliminarCita = (id) => {

        if (!window.confirm("¿Eliminar esta cita?")) return;

        axios.delete(`https://back-end-project-barberia.onrender.com/deleteCita/${id}`)
            .then(() => {
                cargarMisReservas();
            })
            .catch(err => console.log(err));

    };

    const volver = () => {
        navigate("/servicios");
    };

    return (
        <>

            <Header />

            <h1 className="titulo">Reservas</h1>

            <p id="contadorReservas" className="contador-reservas">
                Tienes {misReservas.length} reserva(s)
            </p>

            <div className="principal">

                <div className="panel-izquierdo">

                    <div className="caja-servicio" id="infoServicio">

                        {!servicio ? (
                            <p>
                                No has seleccionado ningún servicio.{" "}
                                <a
                                    href="/servicios"
                                    style={{ color: "black", textDecoration: "underline" }}
                                    onClick={(e) => { e.preventDefault(); navigate("/servicios"); }}
                                >
                                    Ir a servicios
                                </a>
                            </p>
                        ) : (
                            <>
                                <h3>{servicio.nombre}</h3>
                                <p>${servicio.precio}</p>
                                <span>{servicio.duracion} min</span>
                            </>
                        )}

                    </div>

                    <label>Fecha:</label>
                    <input
                        type="date"
                        id="fechaSeleccionada"
                        value={fecha}
                        onChange={handleFechaChange}
                    />

                    <p id="horasOcupadas" className="horas-ocupadas">{horasOcupadas}</p>

                    <label>Hora:</label>
                    <input
                        type="time"
                        id="horaSeleccionada"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                    />

                    <button onClick={irFormulario} className="btn-principal">
                        Reservar
                    </button>

                </div>

                <div className="calendario">

                    <h3>Mis reservas</h3>

                    <div id="calendarioGrande">

                        {misReservas.length === 0 && (
                            <p>No tienes reservas aún</p>
                        )}

                        {misReservas.map(cita => (
                            <div className="evento" key={cita.id}>
                                <button onClick={() => eliminarCita(cita.id)} className="btn-x">❌</button>
                                📅 {cita.fecha} &nbsp; ⏰ {cita.hora} <br />
                                ✂ {cita.nombreServicio} — ${cita.precio}
                            </div>
                        ))}

                    </div>

                </div>

            </div>

            <div id="popup" className={`popup ${popupVisible ? "" : "hide"}`}>
                <div className="popup-content">
                    <h2>Reserva exitosa</h2>
                    <p id="popupTexto">{popupTexto}</p>
                    <button onClick={cerrarPopup}>OK</button>
                </div>
            </div>

            <button onClick={volver} className="btn-volver">
                Regresar
            </button>

        </>
    );
}

export default Reservas;