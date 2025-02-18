import React from "react";
import "../styles/HomePage.css";
import { FaBriefcase, FaUserTie, FaRocket } from "react-icons/fa";

function HomePage() {
    return (
        <div className="home-container">
            <header className="hero-section">
                <h1 className="hero-title">Welcome to <span>HireHub</span></h1>
                <p className="hero-subtitle">Connecting talent with opportunities!</p>
            </header>

            <section className="info-section">
                <div className="info-box">
                    <FaBriefcase className="info-icon"/>
                    <h2>Find the Perfect Job</h2>
                    <p>Explore hundreds of job opportunities across various industries.</p>
                </div>
                <div className="info-box">
                    <FaUserTie className="info-icon"/>
                    <h2>Connect with Employers</h2>
                    <p>Interview and apply quickly for the best career opportunities.</p>
                </div>
                <div className="info-box">
                    <FaRocket className="info-icon"/>
                    <h2>Kickstart Your Career</h2>
                    <p>Use our tools to streamline your job application process.</p>
                </div>
            </section>

            <footer className="home-footer">
                <p>&copy; 2025 HireHub | All rights reserved.</p>
            </footer>
        </div>
    );
}

export default HomePage;
