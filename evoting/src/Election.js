import React, { useState, useEffect } from "react";
import { UserCircle } from "lucide-react";
import "./Election.css";

function Election({ onNavigate, showSuccessPopup = false, onPopupClose }) {
  const [showPopup, setShowPopup] = useState(false);


  // Show popup when redirected from vote confirmation
  useEffect(() => {
    if (showSuccessPopup) {
      setShowPopup(true);

      setTimeout(() => {
        if (onPopupClose) {
          onPopupClose();
        }
      }, 0);
    }
  }, [showSuccessPopup, onPopupClose]);

  const closePopup = () => {
    setShowPopup(false);
  };

  const ukmList = [
    {
      id: 1,
      name: "Badminton",
      image: "./img/badminton.png",
    },
    {
      id: 2,
      name: "Basketball",
      image: "./img/basket.png",
    },
    {
      id: 3,
      name: "Binusian Gaming",
      image: "./img/gaming.png",
    },
    {
      id: 4,
      name: "Sepakbola",
      image: "./img/sepakbola.png",
    },
    {
      id: 5,
      name: "Musik",
      image: "./img/musik.png",
    },
    {
      id: 6,
      name: "B-Preneur",
      image: "./img/bpreneur.png",
    },
    {
      id: 7,
      name: "KMBD",
      image: "./img/kmbd.jpg",
    },
    {
      id: 8,
      name: "Wushu",
      image: "./img/wushu.jpg",
    },
  ];

  return (
    <div className="election-container">
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card success">
            <h2>🎉 Suara Berhasil Terkirim!</h2>
            <p>Terima kasih telah berpartisipasi dalam pemilihan. Suara Anda telah dicatat.</p>
            <button onClick={closePopup}>Lanjutkan</button>
          </div>
        </div>
      )}
      {/* Navigation - With Profile Icon & Login Button */}
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
            <a href="#election" className="nav-link active" onClick={() => onNavigate("election")}>
              Elections
            </a>
            <a href="#result" className="nav-link" onClick={() => onNavigate("result")}>
              Results
            </a>
            <a href="#help" className="nav-link">
              Help/FAQ
            </a>

            {/* ITEM BARU: Profile Icon */}
            <button className="profile-btn" onClick={() => onNavigate("profile")}>
              <UserCircle size={32} color="#1f2937" />
            </button>

            {/* Tombol Login/Register */}
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
                <img
                  src={ukm.image}
                  alt={ukm.name}
                  className="ukm-image"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300?text=" + ukm.name;
                  }}
                />
              </div>
              <div className="ukm-info">
                <h3 className="ukm-name">{ukm.name}</h3>
                <button className="vote-btn" onClick={() => onNavigate("ukmdetail", ukm.name)}>
                  Pilih Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
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
