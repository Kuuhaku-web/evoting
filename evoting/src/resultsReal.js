import React, { useState, useEffect } from "react";
import { UserCircle, BarChart2, LogOut } from "lucide-react";
import { BrowserProvider, Contract } from "ethers";
import "./Home.css";
import BinusUKMVotingABI from "./utils/BinusUKMVoting.json";

const CONTRACT_ADDRESS = "0x928F125a5e2a633CACbc3C65dA60f19ac4D11323";
const COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#8b5cf6", "#3b82f6", "#06b6d4", "#14b8a6"];

function ResultsReal({ onNavigate, user, onAuth }) {
  const [currentUser, setCurrentUser] = useState(user);
  const [ukmList, setUkmList] = useState([]);
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
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if window.ethereum exists
        if (!window.ethereum) {
          throw new Error("MetaMask atau wallet browser tidak terdeteksi. Silakan install MetaMask.");
        }

        // Setup provider dan contract
        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract(CONTRACT_ADDRESS, BinusUKMVotingABI, provider);

        console.log("📡 Mengambil data kategori dari blockchain...");

        // Get total categories
        const categoryCount = await contract.categoryCount();
        const totalCategories = Number(categoryCount);

        console.log(`✅ Total UKM/Kategori: ${totalCategories}`);

        // Fetch setiap kategori
        const categories = [];
        for (let i = 1; i <= totalCategories; i++) {
          try {
            const categoryData = await contract.getCategory(i);
            
            // Destructure data dari struct
            const [id, name, description, isActive, totalVotes, candidateCount] = categoryData;

            const totalVotesNumber = Number(totalVotes);

            // FILTERING: Hanya masukkan UKM yang sudah ada votes
            if (totalVotesNumber > 0) {
              categories.push({
                id: Number(id),
                name: name,
                description: description,
                isActive: isActive,
                totalVotes: totalVotesNumber,
                candidateCount: Number(candidateCount),
                color: COLORS[i % COLORS.length]
              });

              console.log(`✅ Kategori ${i}: ${name} - ${totalVotesNumber} suara (DITAMPILKAN)`);
            } else {
              console.log(`⏭️ Kategori ${i}: ${name} - ${totalVotesNumber} suara (DILEWATI - belum ada votes)`);
            }
          } catch (err) {
            console.error(`❌ Error fetching kategori ${i}:`, err);
          }
        }

        setUkmList(categories);
        console.log("✅ Data blockchain berhasil dimuat:", categories);
        console.log(`📊 Total UKM dengan votes: ${categories.length}`);


      } catch (err) {
        console.error("❌ Error mengambil data blockchain:", err);
        setError(err.message || "Gagal mengambil data dari blockchain");
        
        // Fallback ke data dummy
        setUkmList([
          { id: 1, name: "Badminton", totalVotes: 150, color: "#6366f1", description: "Badminton Club" },
          { id: 2, name: "Basketball", totalVotes: 120, color: "#ec4899", description: "Basketball Team" },
          { id: 3, name: "Binusian Gaming", totalVotes: 200, color: "#10b981", description: "Gaming Community" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            {ukmList.length > 0 ? (
              ukmList.map((ukm) => (
                <div 
                  key={ukm.id}
                  onClick={() => onNavigate("result", ukm.name)} // Pass nama UKM ke Result page
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
                    <span style={{ color: "#3b82f6", fontWeight: "600", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "5px" }}>
                      📊 {ukm.totalVotes} suara
                    </span>
                    <span style={{ color: "#6b7280", fontWeight: "500", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "5px", marginTop: "8px" }}>
                      Lihat Detail Kandidat &rarr;
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "60px 20px",
                backgroundColor: "#f3f4f6",
                borderRadius: "12px",
                color: "#6b7280"
              }}>
                <p style={{ fontSize: "1.1rem", marginBottom: "10px" }}>📭 Belum ada UKM dengan suara</p>
                <p style={{ fontSize: "0.95rem" }}>Proses voting masih berlangsung. Silakan kembali lagi nanti untuk melihat hasilnya.</p>
              </div>
            )}
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