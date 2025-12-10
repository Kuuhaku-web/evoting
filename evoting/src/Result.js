import React, { useState, useEffect } from "react";
import { TrendingUp, UserCircle, LogOut } from "lucide-react";
import "./Result.css";

function Result({ onNavigate, user, onAuth }) {
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
    if (onAuth) onAuth(null);
    onNavigate('home');
    window.location.hash = '';
  };
  // Data dummy untuk hasil voting
  const totalVotes = "10,502";
  
  const candidates = [
    {
      id: 1,
      name: "Edwin",
      role: "Kandidat 1",
      votes: "4,521",
      percentage: 43.0,
      color: "#3b82f6" // Biru
    },
    {
      id: 2,
      name: "Herbert",
      role: "Kandidat 2",
      votes: "3,847",
      percentage: 36.6,
      color: "#3b82f6" // Biru
    },
    {
      id: 3,
      name: "Abstain / Lainnya",
      role: "Suara Tidak Sah",
      votes: "2,134",
      percentage: 20.4,
      color: "#9ca3af" // Abu-abu
    }
  ];

  return (
    <div className="result-container">
      {/* Navbar */}
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
            <a href="#result" className="nav-link active" onClick={() => onNavigate("result")}>
              Results
            </a>
            <a href="#help" className="nav-link">
              Help/FAQ
            </a>
            
            {/* ITEM BARU: Profile Icon */}
            <button className="profile-btn" onClick={() => onNavigate("profile")}>
              <UserCircle size={32} color="#1f2937" />
            </button>

            {/* Tombol Login/Register atau Username */}
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="username" style={{
                  color: '#4b5563',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  {currentUser.username}
                </span>
                <button className="login-btn" onClick={handleLogout} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#ef4444'
                }}>
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <button className="login-btn" onClick={() => onNavigate("signup")}>
                Login / Register
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="result-content">
        
        {/* Header Title with Icon */}
        <div className="result-header">
          <TrendingUp className="header-icon" size={28} />
          <h1 className="result-title">Hasil Suara</h1>
        </div>

        {/* Total Votes Box */}
        <div className="total-votes-box">
          <span className="total-number">{totalVotes}</span>
        </div>

        {/* Candidates List */}
        <div className="candidates-list">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="candidate-card">
              <div className="card-header">
                <div className="candidate-info">
                  <h3 className="candidate-name">{candidate.name}</h3>
                  <p className="candidate-role">{candidate.role}</p>
                </div>
                <div className="vote-stats">
                  <span className="vote-count">{candidate.votes}</span>
                  <span className="vote-percentage">%{candidate.percentage}</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${candidate.percentage}%`,
                    backgroundColor: candidate.color 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">© 2024 E-Voting System. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Result;