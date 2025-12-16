import React, { useState, useEffect } from "react";
import { User, Mail, BookOpen, Clock, LogOut, Award, Upload, UserCircle } from "lucide-react";
import { BrowserProvider, Contract } from "ethers";
import "./Profile.css";
import BinusUKMVotingABI from "./utils/BinusUKMVoting.json";

const CONTRACT_ADDRESS = "0x928F125a5e2a633CACbc3C65dA60f19ac4D11323";

// Mapping Category ID ke UKM Name
const CATEGORY_ID_TO_UKM_NAME = {
  1: "Badminton",
  2: "Basketball",
  3: "Binusian Gaming",
  4: "Sepakbola",
  5: "Musik",
  6: "B-Preneur",
  7: "KMBD",
  8: "Wushu",
};

function Profile({ onNavigate, user, onAuth, isLoggedIn, onLogout }) {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState(user);
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || null);
  const [votingHistory, setVotingHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // Watch for user prop changes
  useEffect(() => {
    console.log('Profile - user prop changed:', user);
    setCurrentUser(user);
    setProfilePicture(user?.profilePicture || null);
  }, [user]);

  // ===== FETCH VOTING HISTORY DARI BLOCKCHAIN =====
  useEffect(() => {
    if (!isLoggedIn) {
      console.log('User not logged in, skipping voting history fetch');
      setVotingHistory([]);
      return;
    }

    const fetchVotingHistory = async () => {
      try {
        setLoadingHistory(true);
        setHistoryError(null);

        console.log("📡 Fetching voting history from blockchain...");

        // Check MetaMask
        if (!window.ethereum) {
          throw new Error("MetaMask tidak terdeteksi. Silakan install MetaMask untuk melihat riwayat voting.");
        }

        // Cek apakah wallet sudah terkoneksi
        let accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (!accounts || accounts.length === 0) {
          // Hanya request jika belum terkoneksi
          accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
        const walletAddress = accounts[0];

        // Setup provider
        const provider = new BrowserProvider(window.ethereum);
        // const signer = await provider.getSigner(); // Tidak perlu getSigner hanya untuk read
        const contract = new Contract(CONTRACT_ADDRESS, BinusUKMVotingABI, provider);

        console.log("✅ Connected to MetaMask");
        console.log("📍 Wallet Address:", walletAddress);

        // Get total categories
        const categoryCount = await contract.categoryCount();
        const totalCategories = Number(categoryCount);
        console.log(`✅ Total Categories: ${totalCategories}`);

        const history = [];

        // Loop semua kategori
        for (let categoryId = 1; categoryId <= totalCategories; categoryId++) {
          try {
            // STEP 1: Cek apakah user sudah vote di kategori ini
            const hasVoted = await contract.hasUserVoted(walletAddress, categoryId);

            if (hasVoted) {
              console.log(`✅ User voted in category ${categoryId}`);

              // STEP 2: Ambil candidateId yang dipilih
              const candidateId = await contract.getUserVote(walletAddress, categoryId);
              console.log(`   Candidate ID: ${Number(candidateId)}`);

              // STEP 3: Ambil nama UKM dari kategori
              const categoryData = await contract.getCategory(categoryId);
              const ukmName = categoryData[1]; // Index 1 = name
              console.log(`   UKM Name: ${ukmName}`);

              // STEP 4: Ambil nama kandidat
              const candidateData = await contract.getCandidate(candidateId);
              const candidateName = candidateData[1]; // Index 1 = name
              console.log(`   Candidate Name: ${candidateName}`);

              // STEP 5: Tambah ke history array
              history.push({
                id: categoryId,
                event: `Pemilihan Ketua ${ukmName}`,
                choice: candidateName,
                date: new Date().toLocaleDateString('id-ID', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }),
                status: "Selesai",
                ukmName: ukmName,
                candidateName: candidateName
              });
            }
          } catch (err) {
            console.error(`❌ Error fetching vote for category ${categoryId}:`, err);
          }
        }

        console.log("✅ Voting history loaded:", history);
        setVotingHistory(history);

      } catch (err) {
        console.error("❌ Error fetching voting history:", err);
        setHistoryError(err.message || "Gagal mengambil riwayat voting");
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchVotingHistory();
  }, [isLoggedIn]);


  // ===== HANDLE LOGOUT =====
  const handleLogout = () => {
    console.log("🔐 Logout clicked");
    if (onLogout) {
      onLogout();
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/upload-profile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const newProfileUrl = data.profilePicture;
      setProfilePicture(newProfileUrl);
      setUploadSuccess('Foto profil berhasil diperbarui!');

      setTimeout(() => setUploadSuccess(''), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Gagal mengupload foto profil');
      setTimeout(() => setUploadError(''), 3000);
    } finally {
      setUploadLoading(false);
    }
  };

  // ===== JIKA BELUM LOGIN - TAMPILKAN GUEST UI =====
  if (!isLoggedIn) {
    return (
      <div className="profile-container">
        <div className="profile-guest-card">
          <UserCircle size={80} className="guest-icon" />
          <h2>Pengguna Tamu</h2>
          <p className="guest-message">Silakan login untuk melihat profil lengkap dan riwayat voting Anda</p>
          
          <button 
            className="btn btn-primary login-button"
            onClick={() => {
              console.log("Guest user clicking Login Sekarang");
              onNavigate("signin");
            }}
          >
            <User size={18} /> Login Sekarang
          </button>
          
          <div className="guest-benefits">
            <h3>Keuntungan Login:</h3>
            <ul>
              <li>✓ Lihat profil lengkap Anda</li>
              <li>✓ Riwayat voting dari blockchain</li>
              <li>✓ Kelola preferensi akun</li>
              <li>✓ Upload foto profil</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // ===== JIKA SUDAH LOGIN - TAMPILKAN PROFIL LENGKAP =====
  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-picture-container">
            {profilePicture ? (
              <img 
                src={profilePicture} 
                alt="Profile" 
                className="profile-picture"
              />
            ) : (
              <div className="profile-picture-placeholder">
                <User size={64} />
              </div>
            )}
            <label htmlFor="picture-input" className="picture-upload-btn">
              <Upload size={16} />
              <input 
                id="picture-input"
                type="file" 
                accept="image/*" 
                onChange={handleProfilePictureChange}
                disabled={uploadLoading}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className="profile-info">
            <h1>{currentUser?.name || currentUser?.username || 'User'}</h1>
            <p className="member-since">
              <BookOpen size={16} />
              Member sejak {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : 'N/A'}
            </p>
          </div>

          <button 
            className="logout-btn"
            onClick={handleLogout}
            title="Logout dari akun Anda"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* User Details */}
        <div className="profile-details">
          <div className="detail-item">
            <Mail size={18} />
            <div>
              <label>Email</label>
              <p>{currentUser?.email || '-'}</p>
            </div>
          </div>

          <div className="detail-item">
            <User size={18} />
            <div>
              <label>Nama</label>
              <p>{currentUser?.name || currentUser?.username || '-'}</p>
            </div>
          </div>

          <div className="detail-item">
            <Award size={18} />
            <div>
              <label>Status</label>
              <p className="status-badge">Peserta Voting Aktif</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {uploadError && (
          <div className="alert alert-error">
            {uploadError}
          </div>
        )}
        {uploadSuccess && (
          <div className="alert alert-success">
            {uploadSuccess}
          </div>
        )}

        {/* Voting History Section */}
        <div className="voting-history-section">
          <h2>
            <Award size={20} /> Riwayat Voting
          </h2>

          {loadingHistory && (
            <div className="loading-spinner">
              <p>⏳ Mengambil riwayat voting dari blockchain...</p>
            </div>
          )}

          {historyError && (
            <div className="alert alert-error">
              <p>❌ {historyError}</p>
              <small>Pastikan MetaMask terinstall dan wallet terkoneksi ke Sepolia testnet</small>
            </div>
          )}

          {!loadingHistory && votingHistory.length > 0 ? (
            <div className="voting-history-list">
              {votingHistory.map((entry, index) => (
                <div key={index} className="voting-history-item">
                  <div className="history-left">
                    <div className="history-icon">
                      <Clock size={20} />
                    </div>
                    <div className="history-content">
                      <h4>{entry.event}</h4>
                      <p className="history-choice">
                        <strong>Pilihan:</strong> {entry.candidateName}
                      </p>
                      <small className="history-date">{entry.date}</small>
                    </div>
                  </div>
                  <div className={`history-status status-${entry.status.toLowerCase()}`}>
                    ✓ {entry.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loadingHistory && (
              <div className="empty-history">
                <p>📭 Belum ada riwayat voting</p>
                <small>Mulai voting sekarang untuk melihat riwayat Anda</small>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
