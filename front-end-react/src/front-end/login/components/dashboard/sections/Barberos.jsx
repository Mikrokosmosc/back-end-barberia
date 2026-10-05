import React, { useEffect, useState } from "react";
import axios from "axios";

let idFila = 0;

function Barberos({ activa, onBarberosActualizados }) {

    const [barberos, setBarberos] = useState([]);
    const [filas, setFilas] = useState([]);

    const cargarBarberos = () => {

        axios.get("https://back-end-project-barberia.onrender.com/getBarberos")
            .then((response) => {

                setBarberos(response.data);

                if (onBarberosActualizados) {
                    onBarberosActualizados(response.data);
                }

            })
            .catch((error) => {
                console.error("Error cargando barberos:", error);
            });

    };

    useEffect(() => {

        if (activa) {
            cargarBarberos();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activa]);

    const agregarFilaBarbero = () => {

        idFila += 1;

        setFilas(prev => [
            ...prev,
            { id: idFila, nombre: "", apellido: "", especialidad: "", estado: "Activo" }
        ]);

    };

    const actualizarFila = (id, campo, valor) => {

        setFilas(prev => prev.map(fila =>
            fila.id === id ? { ...fila, [campo]: valor } : fila
        ));

    };

    const quitarFilaForm = (id) => {
        setFilas(prev => prev.filter(fila => fila.id !== id));
    };

    const guardarBarberos = () => {

        if (filas.length === 0) {
            alert("Agrega al menos una fila antes de guardar");
            return;
        }

        const data = filas
            .filter(fila => fila.nombre.trim())
            .map(fila => ({
                nombre: fila.nombre,
                apellido: fila.apellido,
                especialidad: fila.especialidad,
                estado: fila.estado
            }));

        if (data.length === 0) {
            alert("Completa al menos el nombre del barbero");
            return;
        }

        axios.post("https://back-end-project-barberia.onrender.com/saveBarberos", data)
            .then((response) => {

                console.log(response.data);

                setFilas([]);

                cargarBarberos();

                alert("Barberos guardados correctamente");

            })
            .catch((error) => {
                console.error("Error guardando barberos:", error);
            });

    };

    const eliminarBarbero = (id) => {

        if (!window.confirm("¿Eliminar este barbero?")) return;

        axios.delete(`https://back-end-project-barberia.onrender.com/deleteBarbero/${id}`)
            .then((response) => {

                console.log(response.data);

                cargarBarberos();

                alert("Barbero eliminado correctamente");

            })
            .catch((error) => {
                console.error("Error eliminando barbero:", error);
            });

    };

    return (
        <section id="barberos" className={`section ${activa ? "" : "hidden"}`}>

            <h1 className="titulo-seccion">✂ Gestionar Barberos</h1>

            <div className="contenedor-barberos">

                <h3>Barberos registrados</h3>

                <div className="fila-header fila-barberos-header">
                    <span>Nombre</span>
                    <span>Apellido</span>
                    <span>Especialidad</span>
                    <span>Estado</span>
                    <span>Acción</span>
                </div>

                <div id="listaBarberos">

                    {barberos.length === 0 && (
                        <div className="card empty-msg">
                            No hay barberos registrados
                        </div>
                    )}

                    {barberos.map((barbero) => (
                        <div
                            className="fila-barbero fila-barbero-vista"
                            data-id={barbero.id}
                            key={barbero.id}
                        >
                            <span>{barbero.nombre}</span>
                            <span>{barbero.apellido}</span>
                            <span>{barbero.especialidad}</span>
                            <span>{barbero.estado}</span>

                            <button
                                type="button"
                                className="btn-eliminar-barbero"
                                onClick={() => eliminarBarbero(barbero.id)}
                            >
                                ❌
                            </button>
                        </div>
                    ))}

                </div>

                <h3 className="subtitulo-agenda">Agregar nuevo(s) barbero(s)</h3>

                <div id="formNuevosBarberos">

                    {filas.map((fila) => (
                        <div className="fila-barbero" key={fila.id}>

                            <input
                                type="text"
                                placeholder="Nombre"
                                value={fila.nombre}
                                onChange={(e) => actualizarFila(fila.id, "nombre", e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="Apellido"
                                value={fila.apellido}
                                onChange={(e) => actualizarFila(fila.id, "apellido", e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="Especialidad"
                                value={fila.especialidad}
                                onChange={(e) => actualizarFila(fila.id, "especialidad", e.target.value)}
                            />

                            <select
                                value={fila.estado}
                                onChange={(e) => actualizarFila(fila.id, "estado", e.target.value)}
                            >
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>

                            <button
                                type="button"
                                className="btn-eliminar-barbero-form"
                                onClick={() => quitarFilaForm(fila.id)}
                            >
                                ❌
                            </button>

                        </div>
                    ))}

                </div>

                <div className="acciones">

                    <button
                        className="btn-agregar"
                        id="btnAgregarBarbero"
                        onClick={agregarFilaBarbero}
                    >
                        + Agregar fila
                    </button>

                    <button
                        className="btn-guardar"
                        id="btnGuardarBarberos"
                        onClick={guardarBarberos}
                    >
                        Guardar nuevos
                    </button>

                </div>

            </div>

        </section>
    );
}

export default Barberos;
