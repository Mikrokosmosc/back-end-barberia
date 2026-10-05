import React, { useEffect, useState } from "react";
import axios from "axios";

function Citas({ activa }) {

    const [citas, setCitas] = useState([]);

    const cargarCitasAdmin = () => {

        axios.get("https://back-end-project-barberia.onrender.com/getCitas")
            .then((response) => {
                setCitas(response.data);
            })
            .catch((error) => {
                console.error("Error cargando citas:", error);
            });

    };

    useEffect(() => {

        if (activa) {
            cargarCitasAdmin();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activa]);

    const eliminarCitaAdmin = (id) => {

        if (!window.confirm("¿Eliminar esta cita?")) return;

        axios.delete(`https://back-end-project-barberia.onrender.com/deleteCita/${id}`)
            .then(() => {
                cargarCitasAdmin();
            })
            .catch((error) => {
                console.error("Error eliminando cita:", error);
            });

    };

    return (
        <section id="citas" className={`section ${activa ? "" : "hidden"}`}>

            <h1 className="titulo-seccion">Gestión de Agenda</h1>

            <div className="contenedor-barberos">

                <h3>Citas agendadas por los clientes</h3>

                <div id="listaCitasAdmin">

                    {citas.length === 0 && (
                        <div className="card empty-msg">
                            No hay citas registradas
                        </div>
                    )}

                    {citas.map((cita) => {

                        const barbero = cita.nombreBarbero
                            ? `${cita.nombreBarbero} ${cita.apellidoBarbero}`
                            : "Sin asignar";

                        return (
                            <div className="card" key={cita.id}>
                                <p><strong>Cliente:</strong> {cita.nombreCliente}</p>
                                <p><strong>Servicio:</strong> {cita.nombreServicio} ({cita.tipo_Servicio})</p>
                                <p><strong>Valor:</strong> ${cita.precio}</p>
                                <p><strong>Barbero encargado:</strong> {barbero}</p>
                                <p><strong>Fecha:</strong> {cita.fecha} — <strong>Hora:</strong> {cita.hora}</p>
                                <button
                                    className="btn-eliminar-cita-admin"
                                    onClick={() => eliminarCitaAdmin(cita.id)}
                                >
                                    ❌ Eliminar cita
                                </button>
                            </div>
                        );

                    })}

                </div>

            </div>

        </section>
    );
}

export default Citas;
