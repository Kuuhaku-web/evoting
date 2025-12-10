import React from "react";
import { UserCircle, BarChart2 } from "lucide-react";
import "./Home.css"; // Pakai CSS Home biar Navbarnya konsisten

function ResultsReal({ onNavigate }) {
  // Data UKM yang akan ditampilkan sebagai tombol/kartu
  const ukmList = [
    { id: 1, name: "Badminton", totalVotes: 150, color: "#6366f1" },
    { id: 2, name: "Basketball", totalVotes: 120, color: "#ec4899" },
    { id: 3, name: "Binusian Gaming", totalVotes: 200, color: "#10b981" },
    { id: 4, name: "Sepakbola", totalVotes: 90, color: "#f59e0b" },
    { id: 5, name: "Musik", totalVotes: 60, color: "#8b5cf6" },
    { id: 6, name: "B-Preneur", totalVotes: 45, color: "#3b82f6" },
  ];

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
            {/* Class active tetap di Results */}
            <a href="#results" className="nav-link active" onClick={() => onNavigate("results")}>
              Results
            </a>
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

      {/* --- KONTEN PILIH HASIL UKM --- */}
      <div className="hero-section" style={{ minHeight: "80vh", display: "block", paddingTop: "50px", backgroundColor: "#f9fafb" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
          
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1 style={{ fontSize: "2.5rem", color: "#1f2937", marginBottom: "10px", fontWeight: "bold" }}>
              Live Election Results
            </h1>
            <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>
              Pilih UKM di bawah ini untuk melihat detail perolehan suara kandidat secara lengkap.
            </p>
          </div>

          {/* GRID KARTU UKM */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
            gap: "25px" 
          }}>
            {ukmList.map((ukm) => (
              <div 
                key={ukm.id}
                onClick={() => onNavigate("result")} // <--- INI KUNCINYA: Klik lari ke Result.js
                style={{
                  backgroundColor: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  borderTop: `6px solid ${ukm.color}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
                // Efek Hover pakai inline style react event
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
                      {ukm.name}
                    </h3>
                    <BarChart2 size={24} color={ukm.color} />
                  </div>
                  <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                    Status: <span style={{ color: "#10b981", fontWeight: "600" }}>Live Counting</span>
                  </p>
                </div>
                
                <div style={{ marginTop: "20px", borderTop: "1px solid #f3f4f6", paddingTop: "15px" }}>
                  <span style={{ color: "#3b82f6", fontWeight: "600", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "5px" }}>
                    Lihat Grafik Detail &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">© 2024 E-Voting System. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default ResultsReal;