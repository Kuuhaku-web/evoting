// VoteConfirmation.js - Simpan di folder src/components/VoteConfirmation.js
import React from "react";
import { CheckSquare } from "lucide-react";
import "./VoteConfirmation.css";

function VoteConfirmation({ onNavigate, candidateData }) {
  // Destructure candidate data
  const { name, position, photo, ukmName } = candidateData || {};

  // Generate Transaction ID (mock)
  const transactionId = `0x830dj...dj8023jdksjfdksjl8320`;

  // Handler untuk ubah pilihan
  const handleChangeVote = () => {
    onNavigate("ukmdetail", ukmName);
  };

  // Handler untuk submit vote
  const handleSubmitVote = () => {
    // Logic untuk submit vote ke backend/blockchain
    console.log("Vote submitted for:", candidateData);

    // Redirect ke halaman election dengan flag showSuccessPopup
    onNavigate("election", "", null, true);
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
            <span className="detail-value">{transactionId}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span className="detail-value status">Menunggu Konfirmasi</span>
          </div>
        </div>

        {/* Warning Message */}
        <div className="warning-box">Suara yang telah dikonfirmasi bersifat final dan tidak dapat diubah.</div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn-change" onClick={handleChangeVote}>
            Ubah Pilihan
          </button>
          <button className="btn-submit" onClick={handleSubmitVote}>
            Kirim Suara
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoteConfirmation;
