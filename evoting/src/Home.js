import React from "react";
import { Vote, Users, CheckSquare, Smartphone, Shield, TrendingUp, UserCircle } from "lucide-react";
import "./Home.css";

function Home({ onNavigate }) {
  return (
    <div className="home-container">
      {/* --- NAVBAR --- */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <img src="/logo1.png" alt="E-Voting Logo" className="brand-logo" />
            <span className="brand-text">E-Voting</span>
          </div>
          <div className="nav-links">
            <a href="#home" className="nav-link" onClick={() => onNavigate("home")}>
              Home
            </a>
            <a href="#election" className="nav-link" onClick={() => onNavigate("election")}>
              Elections
            </a>
            
            {/* BAGIAN PENTING: Link ke Results */}
            <a href="#results" className="nav-link" onClick={() => onNavigate("results")}>
              Results
            </a>
            {/* ------------------------------- */}

            <a href="#help" className="nav-link" onClick={() => onNavigate("help")}>
              Help/FAQ
            </a>
            
            <button className="profile-btn" onClick={() => onNavigate("profile")}>
                <UserCircle size={32} color="#1f2937" />
            </button>

            <button className="login-btn" onClick={() => onNavigate("signup")}>
              Login / Register
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-illustration">
             {/* Isi ilustrasi biarkan sama */}
             <div className="illustration-wrapper">
               <div className="circle circle-1"></div>
               <div className="circle circle-2"></div>
               <div className="circle circle-3"></div>
               <div className="circle circle-4"></div>
             </div>
          </div>
          <div className="hero-text">
            <h1 className="hero-title">Your Voice, Your Choice, Shape Your UKM's Future.</h1>
            <p className="hero-description">
              Welcome to the official E-Voting platform for student activity units.
            </p>
            <button className="cta-btn" onClick={() => onNavigate("election")}>View Elections</button>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card" onClick={() => onNavigate("signup")}>
             <div className="step-icon"><Users size={32} /></div>
             <h3 className="step-title">1. Register & Verify</h3>
          </div>
          <div className="step-card" onClick={() => onNavigate("election")}>
             <div className="step-icon"><Vote size={32} /></div>
             <h3 className="step-title">2. Browse Candidates</h3>
          </div>
          <div className="step-card">
             <div className="step-icon"><CheckSquare size={32} /></div>
             <h3 className="step-title">3. Cast Your Vote</h3>
          </div>
        </div>
      </section>
      
      {/* Sisa konten Home lainnya (Upcoming Elections, Footer, dll) biarkan saja seperti punya abang */}
    </div>
  );
}

export default Home;