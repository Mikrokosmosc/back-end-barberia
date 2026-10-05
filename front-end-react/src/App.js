import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./front-end/Home";
import Contacto from "./front-end/contacto/Contacto";
import Servicios from "./front-end/servicios/Servicios";
import Registrarse from "./front-end/registrarse/Registrarse";
import Reservas from "./front-end/reservas/Reservas";
import Login from "./front-end/login/Login";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/registrarse" element={<Registrarse />} />
                <Route path="/reservas" element={<Reservas />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
