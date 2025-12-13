import React, { useState, useEffect } from "react";
import { User, Mail, BookOpen, Clock, LogOut, Award, Upload, UserCircle } from "lucide-react";
import "./Profile.css"; // Pastikan file css diimport

function Profile({ onNavigate, user, onAuth }) {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState(user);
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || null);

  // Watch for user prop changes
  useEffect(() => {
    console.log('Profile - user prop changed:', user);
    console.log('Profile - user.createdAt:', user?.createdAt);
    setCurrentUser(user);
    setProfilePicture(user?.profilePicture || null);
  }, [user]);

  // Gunakan data user dari props, fallback ke data dummy
  const userData = currentUser ? {
    name: currentUser.username || "User",
    email: currentUser.email || "email@example.com",
    major: currentUser.major || "Computer Science",
    campus: currentUser.campus || "Kemanggisan",
    joinDate: currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : "Sept 2021",
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

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/upload-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Upload gagal');
      }

      const data = await res.json();
      console.log('Upload berhasil:', data);

      // Update profile picture
      const imageUrl = `http://localhost:5000${data.profilePicture}`;
      setProfilePicture(imageUrl);

      // Update user di localStorage dengan profile picture baru
      const updatedUser = { ...currentUser, profilePicture: imageUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      if (onAuth) onAuth(updatedUser);

      setUploadSuccess('Profile picture berhasil diupload!');
      setTimeout(() => setUploadSuccess(''), 3000);
    } catch (err) {
      setUploadError(err.message || 'Terjadi kesalahan saat upload');
      console.error('Upload error:', err);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteProfilePicture = async () => {
    setUploadLoading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/delete-profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Delete gagal');
      }

      console.log('Delete berhasil:', data);

      // Clear profile picture
      setProfilePicture(null);

      // Update user di localStorage
      const updatedUser = { ...currentUser, profilePicture: null };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      if (onAuth) onAuth(updatedUser);

      setUploadSuccess('Profile picture berhasil dihapus!');
      setTimeout(() => setUploadSuccess(''), 3000);
    } catch (err) {
      setUploadError(err.message || 'Terjadi kesalahan saat delete');
      console.error('Delete error:', err);
    } finally {
      setUploadLoading(false);
    }
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

            {/* Profile Icon */}
            <button className="profile-btn" onClick={() => onNavigate("profile")}>
              <UserCircle size={32} color="#1f2937" />
            </button>

            {/* Logout Button */}
            {currentUser ? (
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span
                  className="username"
                  style={{
                    color: "#4b5563",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                  }}
                >
                  {currentUser.username}
                </span>
                <button
                  className="login-btn"
                  onClick={handleLogout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    backgroundColor: "#ef4444",
                  }}
                >
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

      {/* --- KONTEN PROFILE --- */}
      <div className="profile-container">
        {/* Kartu Identitas Utama */}
        <div className="profile-header-card">
          <div className="profile-avatar-section">
            <div className="avatar-circle">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <User size={64} color="white" />
              )}
            </div>

            {/* Upload Profile Picture Form */}
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <label
                htmlFor="profile-upload"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "#dbeafe",
                  color: "#2563eb",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  border: "none",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#bfdbfe")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#dbeafe")}
              >
                <Upload size={18} />
                Upload Foto
              </label>
              <input id="profile-upload" type="file" accept="image/*" onChange={handleProfilePictureUpload} disabled={uploadLoading} style={{ display: "none" }} />

              {/* Delete Button */}
              {profilePicture && (
                <button
                  onClick={handleDeleteProfilePicture}
                  disabled={uploadLoading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    backgroundColor: "#fee2e2",
                    color: "#dc2626",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "6px",
                    cursor: uploadLoading ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    border: "none",
                    transition: "background-color 0.3s",
                    opacity: uploadLoading ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => !uploadLoading && (e.target.style.backgroundColor = "#fecaca")}
                  onMouseLeave={(e) => !uploadLoading && (e.target.style.backgroundColor = "#fee2e2")}
                >
                  <LogOut size={18} />
                  Hapus Foto
                </button>
              )}

              {uploadLoading && <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Processing...</p>}
              {uploadError && <p style={{ color: "#dc2626", fontSize: "0.875rem" }}>{uploadError}</p>}
              {uploadSuccess && <p style={{ color: "#16a34a", fontSize: "0.875rem" }}>{uploadSuccess}</p>}
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

export default Profile;
