import React from "react";
import { User, Mail, BookOpen, Clock, LogOut, Award } from "lucide-react";
import "./Profile.css"; // Pastikan file css diimport

function Profile({ onNavigate, user, onAuth }) {
  // Gunakan data user dari props, fallback ke data dummy
  const userData = user ? {
    name: user.username || "User",
    email: user.email || "email@example.com",
    major: user.major || "Computer Science",
    campus: user.campus || "Kemanggisan",
    joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Sept 2021",
  } : {
    name: "Pragos",
    nim: "2702278892",
    major: "Computer Science",
    email: "Pragos@binus.ac.id",
    campus: "Kemanggisan",
    joinDate: "Sept 2021",
  };

  const handleLogout = () => {
    // Hapus user dari localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Reset user state
    if (onAuth) onAuth(null);
    
    // Navigasi ke home
    if (onNavigate) onNavigate("home");
    window.location.hash = '';
  };

  const votingHistory = [
    { id: 1, event: "Pemilihan Ketua HIMTI 2024", choice: "Calon 02 - Budi Santoso", date: "12 Oct 2023", status: "Selesai" },
    { id: 2, event: "Pemilihan Ketua UKM Gaming", choice: "Calon 01 - Siti Herbert", date: "15 Nov 2023", status: "Selesai" },
  ];

  return (
    <div className="profile-page">
      {/* --- NAVBAR (Dicopy agar konsisten) --- */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <img src="/logo1.png" alt="Logo" className="brand-logo" />
            <span className="brand-text">E-Voting</span>
          </div>
          <div className="nav-links">
            <a href="#home" className="nav-link" onClick={() => onNavigate("home")}>
              Home
            </a>
            <a href="#election" className="nav-link" onClick={() => onNavigate("election")}>
              Elections
            </a>
            <a href="#results" className="nav-link" onClick={() => onNavigate("results")}>
              Results
            </a>
            <a href="#help" className="nav-link" onClick={() => onNavigate("help")}>
              Help/FAQ
            </a>

            {/* Tombol Profile Aktif */}
            <button className="profile-btn active" onClick={() => onNavigate("profile")}>
              <User size={24} color="#2563eb" />
            </button>

            <button className="login-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* --- KONTEN PROFILE --- */}
      <div className="profile-container">
        {/* Kartu Identitas Utama */}
        <div className="profile-header-card">
          <div className="profile-avatar-section">
            <div className="avatar-circle">
              <User size={64} color="white" />
            </div>
            <h2 className="profile-name">{userData.name}</h2>
            <p className="profile-nim">{userData.nim}</p>
            <span className="profile-badge">Active Student</span>
          </div>

          <div className="profile-details-grid">
            <div className="detail-item">
              <Mail size={18} className="detail-icon" />
              <div>
                <label>Email Binus</label>
                <p>{userData.email}</p>
              </div>
            </div>
            <div className="detail-item">
              <BookOpen size={18} className="detail-icon" />
              <div>
                <label>Jurusan</label>
                <p>{userData.major}</p>
              </div>
            </div>
            <div className="detail-item">
              <Award size={18} className="detail-icon" />
              <div>
                <label>Kampus</label>
                <p>{userData.campus}</p>
              </div>
            </div>
            <div className="detail-item">
              <Clock size={18} className="detail-icon" />
              <div>
                <label>Bergabung</label>
                <p>{userData.joinDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Riwayat Voting */}
        <div className="history-section">
          <h3>Riwayat Voting Anda</h3>
          <div className="history-list">
            {votingHistory.map((item) => (
              <div key={item.id} className="history-card">
                <div className="history-info">
                  <h4>{item.event}</h4>
                  <p>
                    Pilihan: <strong>{item.choice}</strong>
                  </p>
                </div>
                <div className="history-meta">
                  <span className="date">{item.date}</span>
                  <span className="status-badge">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
