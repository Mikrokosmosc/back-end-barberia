export function obtenerSesionGlobal() {

    const sesion = localStorage.getItem("usuarioSesion");

    if (!sesion) {
        return null;
    }

    try {
        return JSON.parse(sesion);
    } catch (error) {
        localStorage.removeItem("usuarioSesion");
        return null;
    }

}

export function guardarSesion(usuario) {

    localStorage.setItem(
        "usuarioSesion",
        JSON.stringify(usuario)
    );

}

export function cerrarSesionGlobal(navigate) {

    localStorage.removeItem("usuarioSesion");
    localStorage.removeItem("servicioSeleccionado");

    if (navigate) {
        navigate("/");
    } else {
        window.location.href = "/";
    }

}
