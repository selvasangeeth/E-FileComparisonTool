import React from "react";
import logo from "../assets/taxbanditsLogo.png";
import "../styles/Nav.css"; // Import the CSS file for styling

const Nav = () => {
    return (
        <>
            <nav
                className="navbar navbar-expand-lg navbar-light bg-white px-3 shadow-sm">
                <div>
                    <img className="logo" src={logo} alt="TaxBandits Logo" />
                </div>
                <div className = "tooltitle">
                    E-file Comparison Tool
                </div>
            </nav>

            {/* Gray shade bar below the navbar */}
            <div
                style={{
                    height: "8px",
                    background: "linear-gradient(to bottom, #dcdcdc, transparent)",
                }}
            ></div>
        </>
    );
};

export default Nav;
