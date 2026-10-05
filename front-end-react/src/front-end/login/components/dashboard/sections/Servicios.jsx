import React, { useEffect, useState } from "react";
import axios from "axios";

let idFilaServicio = 0;

function Servicios({ activa }) {

    const [servicios, setServicios] = useState([]);
    const [filas, setFilas] = useState([]);

    const cargarServicios = () => {

        axios.get("https://back-end-project-barberia.onrender.com/getServicios")
            .then((response) => {
                setServicios(response.data);
            })
            .catch((error) => {
                console.error("Error cargando servicios:", error);
            });

    };

    useEffect(() => {

        if (activa) {
            cargarServicios();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activa]);

    const agregarFilaServicio = () => {

        idFilaServicio += 1;

        setFilas(prev => [
            ...prev,
            { id: idFilaServicio, nombre: "", duracion: "", precio: "", tipoServicio: "individual" }
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

    const guardarServicios = () => {

        if (filas.length === 0) {
            alert("Agrega al menos una fila antes de guardar");
            return;
        }

        const data = filas
            .filter(fila => fila.nombre.trim())
            .map(fila => ({
                nombre: fila.nombre,
                duracion: fila.duracion,
                precio: fila.precio,
                tipoServicio: fila.tipoServicio
            }));

        if (data.length === 0) {
            alert("Completa al menos el nombre del servicio");
            return;
        }

        axios.post("https://back-end-project-barberia.onrender.com/saveServicios", data)
            .then((response) => {

                console.log(response.data);

                setFilas([]);

                cargarServicios();

                alert("Servicios guardados correctamente");

            })
            .catch((error) => {
                console.error("Error guardando servicios:", error);
            });

    };

    const eliminarServicio = (id) => {

        if (!window.confirm("¿Eliminar este servicio?")) return;

        axios.delete(`https://back-end-project-barberia.onrender.com/deleteServicio/${id}`)
            .then((response) => {

                console.log("RESPUESTA ELIMINAR:", response.data);

                if (response.data === "No se puede eliminar este servicio porque tiene citas asociadas.") {
                    alert(response.data);
                    return;
                }

                if (response.data === "Servicio eliminado") {
                    cargarServicios();
                    alert("Servicio eliminado correctamente");
                    return;
                }

                alert(response.data);

            })
            .catch((error) => {

                console.error("Error eliminando servicio:", error);

                alert("Ocurrió un error al eliminar el servicio.");

            });

    };

    return (
        <section id="servicios" className={`section ${activa ? "" : "hidden"}`}>

            <h1 className="titulo-seccion">💼 Gestionar Servicios</h1>

            <div className="contenedor-barberos">

                <h3>Servicios registrados</h3>

                <div className="fila-header fila-servicios-header">
                    <span>Nombre</span>
                    <span>Duración</span>
                    <span>Precio</span>
                    <span>Tipo</span>
                    <span>Acción</span>
                </div>

                <div id="listaServicios">

                    {servicios.length === 0 && (
                        <div className="card empty-msg">
                            No hay servicios registrados
                        </div>
                    )}

                    {servicios.map((servicio) => (
                        <div
                            className="fila-barbero fila-barbero-vista"
                            data-id={servicio.id}
                            key={servicio.id}
                        >
                            <span>{servicio.nombre}</span>
                            <span>{servicio.duracion} min</span>
                            <span>${servicio.precio}</span>
                            <span>{servicio.tipo_Servicio}</span>

                            <button
                                type="button"
                                className="btn-eliminar-servicio"
                                onClick={() => eliminarServicio(servicio.id)}
                            >
                                ❌
                            </button>
                        </div>
                    ))}

                </div>

                <h3 className="subtitulo-agenda">Agregar nuevo(s) servicio(s)</h3>

                <div id="formNuevosServicios">

                    {filas.map((fila) => (
                        <div className="fila-barbero" key={fila.id}>

                            <input
                                type="text"
                                placeholder="Nombre"
                                value={fila.nombre}
                                onChange={(e) => actualizarFila(fila.id, "nombre", e.target.value)}
                            />

                            <input
                                type="number"
                                placeholder="Duración (min)"
                                value={fila.duracion}
                                onChange={(e) => actualizarFila(fila.id, "duracion", e.target.value)}
                            />

                            <input
                                type="number"
                                placeholder="Precio"
                                value={fila.precio}
                                onChange={(e) => actualizarFila(fila.id, "precio", e.target.value)}
                            />

                            <select
                                value={fila.tipoServicio}
                                onChange={(e) => actualizarFila(fila.id, "tipoServicio", e.target.value)}
                            >
                                <option value="individual">Individual</option>
                                <option value="paquete">Paquete</option>
                            </select>

                            <button
                                type="button"
                                className="btn-eliminar-servicio-form"
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
                        id="btnAgregarServicio"
                        onClick={agregarFilaServicio}
                    >
                        + Agregar fila
                    </button>

                    <button
                        className="btn-guardar"
                        id="btnGuardarServicios"
                        onClick={guardarServicios}
                    >
                        Guardar nuevos
                    </button>

                </div>

            </div>

        </section>
    );
}

export default Servicios;
