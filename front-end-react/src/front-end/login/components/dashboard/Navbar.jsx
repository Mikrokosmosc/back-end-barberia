import React from "react";

function Navbar({ usuario, onToggleMenu, onLogout }) {

    return (
        <nav className="navbar">

            <span
                className="menu-toggle"
                id="btnToggleMenu"
                title="Abrir menú"
                onClick={onToggleMenu}
            >
                ☰
            </span>

            <h3>Panel de Control</h3>

            <div className="user">

                <span id="navUserName">
                    👤 {usuario ? usuario.userName : "Admin"}
                </span>

                <button
                    className="logout-btn"
                    id="btnLogout"
                    onClick={onLogout}
                >
                    Salir
                </button>

            </div>

        </nav>
    );
}

export default Navbar;
