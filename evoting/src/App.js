import React, { useState, useEffect } from "react";
// Import semua komponen halaman
import Home from "./Home";
import Election from "./Election";
import Result from "./Result";
import Help from "./Help";
import Profile from "./Profile";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import UkmDetail from "./UkmDetail";
import VoteConfirmation from "./VoteConfirmation";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedUkm, setSelectedUkm] = useState("");
  const [candidateData, setCandidateData] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

   const handleResetPopup = () => {
     // Fungsi baru untuk mereset state pop-up
     setShowSuccessPopup(false);
   };

  const handleNavigate = (page, ukmName = "", candidate = null, showPopup = false) => {
    console.log("Navigating to:", page, "UKM:", ukmName, "Candidate:", candidate, "ShowPopup:", showPopup);

    setCurrentPage(page);

    // Update UKM name jika ada
    if (ukmName) {
      setSelectedUkm(ukmName);
    }

    // Update candidate data jika ada
    if (candidate) {
      setCandidateData(candidate);
    }

    // Update success popup flag
    setShowSuccessPopup(showPopup);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setCurrentPage(hash);
      } else {
        setCurrentPage("home");
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div>
      {currentPage === "home" && <Home onNavigate={setCurrentPage} />}

      {currentPage === "ukmdetail" && <UkmDetail onNavigate={handleNavigate} ukmName={selectedUkm} />}

      {/* Halaman Election */}
      {currentPage === "election" && (
        <Election
          onNavigate={setCurrentPage}
          showSuccessPopup={showSuccessPopup} // Teruskan state
          onPopupClose={handleResetPopup} // Teruskan fungsi reset
        />
      )}

      {currentPage === "result" && <Result onNavigate={setCurrentPage} />}

      {currentPage === "help" && <Help onNavigate={setCurrentPage} />}

      {currentPage === "profile" && <Profile onNavigate={setCurrentPage} />}

      {currentPage === "voteconfirmation" && candidateData && <VoteConfirmation onNavigate={handleNavigate} candidateData={candidateData} />}

      {currentPage === "signin" && (
        <SignIn
          onSwitchToSignUp={() => {
            setCurrentPage("signup");
            window.location.hash = "signup";
          }}
          onBack={() => {
            setCurrentPage("home");
            window.location.hash = "";
          }}
          // --- PERBAIKAN 2: TAMBAHKAN BARIS INI ---
          onNavigate={(page) => {
            setCurrentPage(page);
            // Opsional: Reset URL hash saat kembali ke home
            if (page === "home") window.location.hash = "";
          }}
        />
      )}

      {currentPage === "signup" && (
        <SignUp
          onSwitchToSignIn={() => {
            setCurrentPage("signin");
            window.location.hash = "signin";
          }}
          onBack={() => {
            setCurrentPage("home");
            window.location.hash = "";
          }}
        />
      )}
    </div>
  );
}

export default App;
