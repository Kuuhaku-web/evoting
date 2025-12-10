import React, { useState, useEffect } from "react";

// --- IMPORT COMPONENT ---
import Home from "./Home";
import Election from "./Election";
import ResultsReal from "./resultsReal"; // Pastikan file resultsReal.js isinya SUDAH DIGANTI dengan kode di atas (poin 1)
import Help from "./Help";
import Profile from "./Profile";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import UkmDetail from "./UkmDetail";
import VoteConfirmation from "./VoteConfirmation";
import Result from "./Result"; 

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedUkm, setSelectedUkm] = useState("");
  const [candidateData, setCandidateData] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleResetPopup = () => {
    setShowSuccessPopup(false);
  };

  const handleNavigate = (page, ukmName = "", candidate = null, showPopup = false) => {
    console.log("Navigating to:", page);
    setCurrentPage(page);

    // Update URL hash manual
    if (page === "home") window.location.hash = "";
    else window.location.hash = page;

    if (ukmName) setSelectedUkm(ukmName);
    if (candidate) setCandidateData(candidate);
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
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div>
      {currentPage === "home" && <Home onNavigate={handleNavigate} />}

      {currentPage === "election" && (
        <Election
          onNavigate={handleNavigate}
          showSuccessPopup={showSuccessPopup}
          onPopupClose={handleResetPopup}
        />
      )}

      {/* JIKA currentPage = "results", TAMPILKAN ResultsReal */}
      {/* Kalau isi file resultsReal.js sudah diganti (poin 1), tampilannya pasti beda sama Election */}
      {currentPage === "results" && <ResultsReal onNavigate={handleNavigate} />}

      {currentPage === "ukmdetail" && <UkmDetail onNavigate={handleNavigate} ukmName={selectedUkm} />}
      {currentPage === "result" && <Result onNavigate={handleNavigate} />} 
      {currentPage === "help" && <Help onNavigate={handleNavigate} />}
      {currentPage === "profile" && <Profile onNavigate={handleNavigate} />}
      {currentPage === "voteconfirmation" && candidateData && (
        <VoteConfirmation onNavigate={handleNavigate} candidateData={candidateData} />
      )}

      {currentPage === "signin" && (
        <SignIn
          onSwitchToSignUp={() => handleNavigate("signup")}
          onBack={() => handleNavigate("home")}
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === "signup" && (
        <SignUp
          onSwitchToSignIn={() => handleNavigate("signin")}
          onBack={() => handleNavigate("home")}
        />
      )}
    </div>
  );
}

export default App;