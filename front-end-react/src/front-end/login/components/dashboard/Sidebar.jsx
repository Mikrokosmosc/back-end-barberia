import React from "react";

function Sidebar({ activo, onSeleccionar, menuActivo }) {

    const opciones = [
        { id: "inicio", icono: "🏠", texto: "Inicio" },
        { id: "citas", icono: "📅", texto: "Citas" },
        { id: "barberos", icono: "✂", texto: "Barberos" },
        { id: "servicios", icono: "💼", texto: "Servicios" }
    ];

    return (
        <aside className={`sidebar ${menuActivo ? "active" : ""}`} id="sidebar">

            <ul>

                {opciones.map(opcion => (
                    <li
                        key={opcion.id}
                        data-section={opcion.id}
                        onClick={() => onSeleccionar(opcion.id)}
                    >
                        {opcion.icono} {opcion.texto}
                    </li>
                ))}

            </ul>

        </aside>
    );
}

export default Sidebar;
