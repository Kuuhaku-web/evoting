import React, { useState, useEffect } from "react";
import { TrendingUp, UserCircle, LogOut } from "lucide-react";
import { BrowserProvider, Contract } from "ethers";
import "./Result.css";
import BinusUKMVotingABI from "./utils/BinusUKMVoting.json";

const CONTRACT_ADDRESS = "0x928F125a5e2a633CACbc3C65dA60f19ac4D11323";
const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"];

// Mapping UKM Name ke Category ID
const UKM_NAME_TO_CATEGORY_ID = {
  "Badminton": 1,
  "Basketball": 2,
  "Binusian Gaming": 3,
  "Sepakbola": 4,
  "Musik": 5,
  "B-Preneur": 6,
  "KMBD": 7,
  "Wushu": 8,
};

function Result({ onNavigate, ukmName, user, onAuth }) {
  const [currentUser, setCurrentUser] = useState(user);
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState("0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch data dari blockchain
  useEffect(() => {
    const fetchCandidateResults = async () => {
      try {
        setLoading(true);
        setError(null);

        // Type check - pastikan ukmName adalah string
        if (!ukmName || typeof ukmName !== 'string') {
          throw new Error("UKM Name tidak valid atau tidak ditemukan");
        }

        console.log(`📡 Mengambil hasil voting untuk UKM: ${ukmName}`);

        // Check MetaMask
        if (!window.ethereum) {
          throw new Error("MetaMask atau wallet browser tidak terdeteksi.");
        }

        // Setup provider
        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract(CONTRACT_ADDRESS, BinusUKMVotingABI, provider);

        // ===== STEP 1: Cari Category ID berdasarkan nama UKM =====
        const categoryId = UKM_NAME_TO_CATEGORY_ID[ukmName];
        if (!categoryId) {
          throw new Error(`❌ UKM "${ukmName}" tidak ditemukan dalam mapping`);
        }

        console.log(`✅ Category ID untuk "${ukmName}": ${categoryId}`);

        // ===== STEP 2: Call getCategoryResults untuk mendapatkan data kandidat =====
        console.log(`📡 Mengambil hasil kategori ${categoryId}...`);
        const [candidateIds, voteCounts, names] = await contract.getCategoryResults(categoryId);

        console.log(`✅ Total kandidat: ${candidateIds.length}`);
        console.log("Candidate IDs:", candidateIds.map(id => id.toString()));
        console.log("Vote Counts:", voteCounts.map(v => v.toString()));
        console.log("Names:", names);

        // ===== STEP 3: Kalkulasi total votes =====
        let totalVotesNumber = 0;
        for (const voteCount of voteCounts) {
          totalVotesNumber += Number(voteCount);
        }

        console.log(`✅ Total Votes: ${totalVotesNumber}`);

        // ===== STEP 4: Build kandidat array dengan percentage =====
        const candidatesData = names.map((name, index) => {
          const votes = Number(voteCounts[index]);
          const percentage = totalVotesNumber > 0 ? (votes / totalVotesNumber) * 100 : 0;

          return {
            id: Number(candidateIds[index]),
            name: name,
            role: "Kandidat",
            votes: votes.toLocaleString('id-ID'),
            votesNumber: votes,
            percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
            color: COLORS[index % COLORS.length]
          };
        });

        // Sort by votes descending
        candidatesData.sort((a, b) => b.votesNumber - a.votesNumber);

        setCandidates(candidatesData);
        setTotalVotes(totalVotesNumber.toLocaleString('id-ID'));

        console.log("✅ Candidates data loaded:", candidatesData);

      } catch (err) {
        console.error("❌ Error fetching candidate results:", err);
        setError(err.message || "Gagal mengambil data voting");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateResults();
  }, [ukmName]);

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
          <h1 className="result-title">
            Hasil Suara - {typeof ukmName === 'string' ? ukmName : "Loading..."}
          </h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#6b7280",
            fontSize: "1.1rem"
          }}>
            <p>⏳ Mengambil data dari blockchain...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{
            backgroundColor: "#fee2e2",
            border: "1px solid #fca5a5",
            color: "#dc2626",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            textAlign: "center"
          }}>
            <p><strong>⚠️ Error:</strong> {error}</p>
            <button 
              onClick={() => onNavigate("results")}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.95rem"
              }}
            >
              Kembali ke Results
            </button>
          </div>
        )}

        {/* Data State */}
        {!loading && !error && (
          <>
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
          </>
        )}

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