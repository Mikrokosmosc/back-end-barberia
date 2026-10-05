import React from "react";
import Header from "./header/Header";
import barberiaImg from "./images/barberia.png";
import titleMainImg from "./images/title-main.png";
import "./index.css";

function Home() {

    return (
        <>

            <Header />

            <div>
                <img className="central-img-index" src={barberiaImg} alt="barberia" />
            </div>

            <div>
                <img className="title-main" src={titleMainImg} alt="M&A Barberia" />
            </div>

        </>
    );
}

export default Home;
