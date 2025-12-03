// UkmDetail.js - Simpan di folder src/components/UkmDetail.js
import React, { useState } from "react";
import { UserCircle, ArrowLeft } from "lucide-react";
import "./UkmDetail.css";

function UkmDetail({ onNavigate, ukmName }) {
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Data kandidat (bisa disesuaikan per UKM)
  const candidates = [
    {
      id: 1,
      name: "Edwin",
      position: "Kandidat 1",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
      description: "Berpengalaman menggunakan keterampilan dan efisiensi sistem organisasi dengan program inovatif yang bertujuan untuk meningkatkan akses informasi bagi semua anggota.",
    },
    {
      id: 2,
      name: "Herbert",
      position: "Kandidat 2",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
      description: "Fokus pada pengembangan peluang pelatihan dan peningkatan skill agar setiap anggota dapat berkembang sesuai dengan minat dan potensi dalam lingkungan kerja.",
    },
    {
      id: 3,
      name: "Khiat",
      position: "Kandidat 3",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
      description: "Mengusung program peningkatan kesejahteraan anggota melalui komunitas terbuka, kolaborasi lintas divisi, dan peningkatan fasilitas pendukung.",
    },
  ];

  const handleVote = (candidateId) => {
    setSelectedCandidate(candidateId);
    // Implement voting logic here
    console.log(`Voted for candidate ${candidateId} in ${ukmName}`);
  };

  return (
    <div className="ukm-detail-container">
      {/* Navigation Header */}
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
            <a href="#elections" className="nav-link" onClick={() => onNavigate("election")}>
              Elections
            </a>
            <a href="#results" className="nav-link">
              Results
            </a>
            <a href="#help" className="nav-link">
              Help/FAQ
            </a>
            <button className="profile-btn">
              <UserCircle size={32} color="#1f2937" />
            </button>
            <button className="login-btn" onClick={() => onNavigate("signup")}>
              Login / Register
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="detail-content">
        {/* Back Button */}
        <button className="back-button" onClick={() => onNavigate("election")}>
          <ArrowLeft size={20} />
          <span>Kembali ke Daftar UKM</span>
        </button>

        {/* Header */}
        <div className="detail-header">
          <h1 className="detail-title">Daftar Kandidat</h1>
          <p className="detail-subtitle">{ukmName}</p>
        </div>

        {/* Candidates Grid */}
        <div className="candidates-grid">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="candidate-card">
              <div className="candidate-photo-wrapper">
                <img src={candidate.photo} alt={candidate.name} className="candidate-photo" />
              </div>
              <div className="candidate-info">
                <h3 className="candidate-name">
                  {candidate.name} | {candidate.position}
                </h3>
                <p className="candidate-description">{candidate.description}</p>
                <button className={`vote-button ${selectedCandidate === candidate.id ? "voted" : ""}`} onClick={() => handleVote(candidate.id)}>
                  {selectedCandidate === candidate.id ? "Sudah Dipilih" : "Vote"}
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

export default UkmDetail;
