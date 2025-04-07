import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/HomePage.css";

import { FaHandHoldingHeart, FaUtensils, FaHandsHelping } from "react-icons/fa";

const HomePage = () => {
  return (
    <div className="homepage-container"  >
       <Header />
    <div className="conatiner">
      {/* Hero Section */}
      <section className="hero">
        <h2>Share a Meal, Make a Difference</h2>
        <p>Join PlateShare to donate surplus food or receive meals for those in need.</p>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="how-it-works-title">How It Works</h2>
        <div className="card-container">
          <div className="card">
            <FaUtensils className="card-icon" />
            <h3>Donors Schedule Donations</h3>
            <p>Share surplus food by scheduling a pickup.</p>
          </div>
          <div className="card">
            <FaHandHoldingHeart className="card-icon" />
            <h3>Charities Accept & Collect</h3>
            <p>Charities receive and distribute meals to those in need.</p>
          </div>
          <div className="card">
            <FaHandsHelping className="card-icon" />
            <h3>Meals Reach the Needy</h3>
            <p>Ensure no food goes to waste and help communities.</p>
          </div>
        </div>
      </section>
    </div>
      <Footer />
    </div>
  );
};

export default HomePage;
