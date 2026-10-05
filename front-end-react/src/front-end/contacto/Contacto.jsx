import React from "react";
import Header from "../header/Header";
import "./contacto.css";

function Contacto() {

    return (
        <>

            <Header />

            <div className="lines-content">

                <div className="hl"></div>
                <h1 style={{ color: "white" }}><strong>Contacto</strong></h1>
                <div className="hl"></div>

            </div>

            <section className="main-information">

                <div className="data">

                    <p>- Horarios de Atención</p>

                    <ul>
                        <li>Lunes a Viernes: 9:00 a.m. – 8:00 p.m</li>
                        <li>Sábados: 9:00 a.m. – 6:00 p.m</li>
                        <li>Domingos y Festivos: Cerrado</li>
                    </ul>

                    <p>- Teléfonos / WhatsApp</p>

                    <ul>
                        <li>Teléfono fijo: (601) 123 4567</li>
                        <li>WhatsApp: +57 300 123 4567</li>
                    </ul>

                    <p>- Correo Electrónico</p>

                    <ul>
                        <li>contacto@barberiamya.com</li>
                        <li>reservas@barberiamya.com</li>
                    </ul>

                    <p>- Dirección</p>

                    <ul>
                        <li>Carrera 27 #5a 09 Bogotá</li>
                    </ul>

                    <p>- Redes Sociales</p>
                    <p>Íconos dorados con enlaces:</p>

                    <ul>
                        <li>Instagram: @barberiamya</li>
                        <li>Facebook: facebook.com/barberiamya</li>
                        <li>TikTok: @barberiamya</li>
                    </ul>

                </div>

                <div className="map">
                    <iframe
                        title="mapa"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4729.411184104577!2d-74.09765391154542!3d4.603887497667009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99143959a4f5%3A0xaf3a2bb4fad5daf!2sCra%2027%20%235A-09%2C%20Bogot%C3%A1!5e0!3m2!1ses-419!2sco!4v1775454691048!5m2!1ses-419!2sco"
                        width="500"
                        height="380"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

            </section>

        </>
    );
}

export default Contacto;
