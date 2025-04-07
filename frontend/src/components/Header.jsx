import React from "react";
import "../styles/HomePage.css";
import logo from "../images/logo2.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate(); // React Router navigation
  return (
    <header className="header">
      <div className="logo-title">
        <img src={logo} alt="PlateShare Logo" className="logo" />
        <h1 className="site-title">PlateShare:Connecting Food To Lives</h1>
      </div>
      <div className="auth-buttons">
      <button className="btn primary" onClick={() => navigate("/signup")}>Sign Up</button>
      <button className="btn secondary" onClick={() => navigate("/login")}>Login</button>
      </div>
    </header>
  );
};

export default Header;
