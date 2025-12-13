import React, { useState } from "react";
import { CheckSquare } from "lucide-react";
import { BrowserProvider, Contract } from "ethers";
import "./VoteConfirmation.css";
import BinusUKMVotingABI from "./utils/BinusUKMVoting.json";

const CONTRACT_ADDRESS = "0x928F125a5e2a633CACbc3C65dA60f19ac4D11323";

// Mapping UKM Name ke Category ID di Blockchain
// CATATAN: Mapping ini harus di-update sesuai dengan kategori yang sudah di-create di blockchain
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

function VoteConfirmation({ onNavigate, candidateData }) {
  // Destructure candidate data
  const { name, position, photo, ukmName } = candidateData || {};
  
  // State untuk voting
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);

  // Generate Transaction ID (mock) - akan di-update setelah voting
  const transactionId = transactionHash || `0x830dj...dj8023jdksjfdksjl8320`;

  // Handler untuk ubah pilihan
  const handleChangeVote = () => {
    onNavigate("ukmdetail", ukmName);
  };

  // ========== HANDLER UNTUK CONFIRM VOTE ==========
  const handleConfirmVote = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔐 Starting vote confirmation...");
      console.log("Candidate Name:", name);
      console.log("UKM Name:", ukmName);

      // ===== STEP 1: Check MetaMask =====
      if (!window.ethereum) {
        throw new Error("❌ MetaMask atau wallet browser tidak terdeteksi. Silakan install MetaMask.");
      }

      console.log("✅ MetaMask ditemukan");

      // ===== STEP 2: Setup Provider & Contract =====
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, BinusUKMVotingABI, signer);

      console.log("✅ Provider & Contract initialized");
      console.log("📍 Signer Address:", await signer.getAddress());

      // ===== STEP 3: Get Category ID dari UKM Name =====
      const categoryId = UKM_NAME_TO_CATEGORY_ID[ukmName];
      if (!categoryId) {
        throw new Error(`❌ UKM "${ukmName}" tidak ditemukan dalam mapping. Silakan periksa nama UKM.`);
      }

      console.log(`✅ Category ID untuk "${ukmName}": ${categoryId}`);

      // ===== STEP 4: Get Candidates dalam Category =====
      console.log(`📡 Mengambil daftar kandidat untuk kategori ${categoryId}...`);
      
      // Cek apakah kategori valid dengan call getCategory
      let categoryData;
      try {
        categoryData = await contract.getCategory(categoryId);
        console.log(`✅ Kategori ${categoryId} ditemukan: ${categoryData[1]}`);
      } catch (err) {
        // Jika kategori tidak ada, coba fetch total categoryCount untuk debugging
        const totalCategories = await contract.categoryCount();
        throw new Error(
          `❌ Kategori ID ${categoryId} tidak ditemukan di blockchain. ` +
          `Total kategori yang ada: ${Number(totalCategories)}. ` +
          `Silakan pastikan kategori sudah di-create di blockchain.`
        );
      }

      const candidateIds = await contract.getCandidatesByCategory(categoryId);
      console.log(`✅ Total kandidat di kategori ${categoryId}: ${candidateIds.length}`);
      console.log("Candidate IDs:", candidateIds.map(id => id.toString()));

      // ===== STEP 5: Match Candidate Name dengan ID =====
      let selectedCandidateId = null;

      for (const candidateId of candidateIds) {
        const candidateData = await contract.getCandidate(candidateId);
        const [id, candidateName, description, imageUrl, voteCount, isActive] = candidateData;

        console.log(`  - ID: ${id}, Name: ${candidateName}, Active: ${isActive}`);

        // Cocokkan nama kandidat (case-insensitive)
        if (candidateName.toLowerCase().trim() === name.toLowerCase().trim()) {
          selectedCandidateId = Number(id);
          console.log(`✅ Kandidat "${name}" ditemukan dengan ID: ${selectedCandidateId}`);
          break;
        }
      }

      if (!selectedCandidateId) {
        throw new Error(
          `❌ Kandidat "${name}" tidak ditemukan dalam kategori "${ukmName}". ` +
          `Silakan pilih kandidat yang terdaftar.`
        );
      }

      // ===== STEP 6: Execute Vote Transaction =====
      console.log(`\n🚀 Melakukan voting...`);
      console.log(`   Category ID: ${categoryId}`);
      console.log(`   Candidate ID: ${selectedCandidateId}`);

      const tx = await contract.vote(categoryId, selectedCandidateId);
      console.log(`📝 Transaction sent: ${tx.hash}`);
      setTransactionHash(tx.hash);

      // ===== STEP 7: Wait for Transaction Confirmation =====
      console.log("⏳ Menunggu konfirmasi transaksi...");
      const receipt = await tx.wait();

      if (receipt && receipt.status === 1) {
        console.log(`✅ Transaksi berhasil!\nTx Hash: ${tx.hash}`);
        console.log(`Block Number: ${receipt.blockNumber}`);

        // Tampilkan alert sukses
        alert(
          `🎉 Suara Anda berhasil terkirim!\n\n` +
          `Kandidat: ${name}\n` +
          `UKM: ${ukmName}\n` +
          `Tx Hash: ${tx.hash}`
        );

        // ===== STEP 8: Redirect ke Results =====
        setTimeout(() => {
          console.log("🔄 Redirecting ke halaman results...");
          onNavigate("results");
        }, 2000);
      } else {
        throw new Error("❌ Transaksi gagal atau ditolak oleh network.");
      }

    } catch (err) {
      console.error("❌ Error saat voting:", err);
      
      // Handle specific error messages
      let errorMessage = err.message;
      
      if (err.message.includes("User rejected")) {
        errorMessage = "❌ Anda menolak transaksi di MetaMask.";
      } else if (err.message.includes("insufficient funds")) {
        errorMessage = "❌ Saldo ETH Anda tidak cukup untuk gas fee.";
      } else if (err.message.includes("already voted")) {
        errorMessage = "❌ Anda sudah melakukan voting untuk UKM ini.";
      } else if (err.message.includes("not a registered voter")) {
        errorMessage = "❌ Anda belum terdaftar sebagai voter di blockchain.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  // Guard clause jika data kandidat tidak ada
  if (!candidateData) {
    return (
      <div className="confirmation-container">
        <div className="confirmation-card">
          <p>Data kandidat tidak ditemukan.</p>
          <button onClick={() => onNavigate("election")}>Kembali ke Election</button>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        {/* Icon */}
        <div className="confirmation-icon">
          <CheckSquare size={64} strokeWidth={2} />
        </div>

        {/* Title */}
        <h1 className="confirmation-title">Konfirmasi Pilihan Anda</h1>
        <p className="confirmation-subtitle">
          Harap Periksa kembali Suara Anda sebelum mengirimkannya.
          <br />
          Pilihan ini bersifat final.
        </p>

        {/* Candidate Info Box */}
        <div className="candidate-box">
          <div className="candidate-box-info">
            <p className="candidate-label">Pemilihan Ketua Umum</p>
            <h2 className="candidate-box-name">{name}</h2>
            <p className="candidate-box-position">{position}</p>
          </div>
          <div className="candidate-box-photo">
            <img
              src={photo}
              alt={name}
              className="candidate-box-image"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/80?text=No+Image";
              }}
            />
          </div>
        </div>

        {/* Transaction Details */}
        <div className="transaction-details">
          <div className="detail-row">
            <span className="detail-label">ID Transaksi</span>
            <span className="detail-value">
              {transactionHash ? `${transactionHash.slice(0, 10)}...${transactionHash.slice(-8)}` : transactionId}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">UKM</span>
            <span className="detail-value">{ukmName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span className="detail-value status">
              {loading ? "⏳ Memproses..." : "Menunggu Konfirmasi"}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              border: "1px solid #fca5a5",
              color: "#dc2626",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              fontSize: "0.875rem",
              lineHeight: "1.5",
            }}
          >
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        {/* Warning Message */}
        <div className="warning-box">
          Suara yang telah dikonfirmasi bersifat final dan tidak dapat diubah.
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn-change"
            onClick={handleChangeVote}
            disabled={loading}
            style={{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Ubah Pilihan
          </button>
          <button
            className="btn-submit"
            onClick={handleConfirmVote}
            disabled={loading}
            style={{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {loading ? "⏳ Memproses..." : "Konfirmasi & Kirim Suara"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoteConfirmation;