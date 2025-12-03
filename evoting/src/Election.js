// Election.js - Simpan di folder src/components/Election.js
import React from "react";
import "./Election.css";

function Election({ onNavigate }) {
  const ukmList = [
    {
      id: 1,
      name: "Ukm A",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      name: "Ukm B",
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      name: "Ukm C",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      name: "Ukm D",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      name: "Ukm E",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      name: "Ukm F",
      image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400&h=300&fit=crop",
    },
    {
      id: 7,
      name: "Ukm G",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
    },
    {
      id: 8,
      name: "Ukm H",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="election-container">
      {/* Navigation - Same as Home */}
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
            <a href="#elections" className="nav-link active">
              Elections
            </a>
            <a href="#results" className="nav-link">
              Results
            </a>
            <a href="#help" className="nav-link">
              Help/FAQ
            </a>
            <button className="login-btn" onClick={() => onNavigate("signup")}>
              Login / Register
            </button>
          </div>
        </div>
      </nav>

      {/* Election Content */}
      <div className="election-content">
        <div className="election-header">
          <h1 className="election-title">Pilih Unit Kegiatan Mahasiswa</h1>
          <p className="election-subtitle">Silakan pilih UKM yang ingin Anda dukung. Klik pada kartu untuk melihat detail lebih lanjut sebelum memberikan suara Anda.</p>
        </div>

        <div className="ukm-grid">
          {ukmList.map((ukm) => (
            <div key={ukm.id} className="ukm-card">
              <div className="ukm-image-wrapper">
                <img src={ukm.image} alt={ukm.name} className="ukm-image" />
              </div>
              <div className="ukm-info">
                <h3 className="ukm-name">{ukm.name}</h3>
                <button className="vote-btn">Pilih Sekarang</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer - Same as Home */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">© 2024 E-Voting System. All Rights Reserved.</p>
          <div className="footer-links">
            <a href="#about" className="footer-link">
              About Us
            </a>
            <a href="#privacy" className="footer-link">
              Privacy Policy
            </a>
            <a href="#contact" className="footer-link">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Election;
