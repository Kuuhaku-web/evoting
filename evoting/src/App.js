import React, { useState, useEffect, useCallback } from "react";

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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // State user dari localStorage
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  // ===== BARU: State Login Global =====
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      return storedUser && storedUser.token ? true : false;
    } catch {
      return false;
    }
  });

  // Persist user ke localStorage setiap kali user berubah
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Listen untuk changes di localStorage (dari SignIn/SignUp)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const updatedUser = JSON.parse(localStorage.getItem('user')) || null;
        console.log('🔍 Storage event - updating user:', updatedUser);
        setUser(updatedUser);
      } catch (err) {
        console.error('Error reading user from localStorage:', err);
      }
    };

    // Listen untuk storage changes dari tab lain
    window.addEventListener('storage', handleStorageChange);

    // Also poll localStorage setiap 200ms untuk catch changes dari tab yang sama
    const pollInterval = setInterval(() => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && JSON.stringify(storedUser) !== JSON.stringify(user)) {
          console.log('📡 Polling detected new user:', storedUser);
          setUser(storedUser);
        }
      } catch (err) {
        // Ignore
      }
    }, 200);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollInterval);
    };
  }, [user]);

  const handleResetPopup = () => {
    setShowSuccessPopup(false);
  };

  // ===== HANDLER LOGIN SUCCESS =====
  const handleLoginSuccess = useCallback(() => {
    console.log("✅ Login success - setting isLoggedIn to true");
    setIsLoggedIn(true);
  }, []);

  // ===== HANDLER LOGOUT =====
  const handleLogoutGlobal = useCallback(() => {
    console.log("🚪 Logout - clearing user and isLoggedIn");
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage("home");
    window.location.hash = '';
  }, []);

  // Callback untuk update user state
  const handleSetUser = useCallback((userData) => {
    console.log('handleSetUser called with:', userData);
    setUser(userData);
  }, []);

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
      {currentPage === "home" && <Home onNavigate={handleNavigate} user={user} onAuth={handleSetUser} />}

      {currentPage === "election" && (
        <Election
          onNavigate={handleNavigate}
          showSuccessPopup={showSuccessPopup}
          onPopupClose={handleResetPopup}
          user={user}
          onAuth={handleSetUser}
        />
      )}

      {/* JIKA currentPage = "results", TAMPILKAN ResultsReal */}
      {/* Kalau isi file resultsReal.js sudah diganti (poin 1), tampilannya pasti beda sama Election */}
      {currentPage === "results" && <ResultsReal onNavigate={handleNavigate} user={user} onAuth={handleSetUser} />}

      {currentPage === "ukmdetail" && <UkmDetail onNavigate={handleNavigate} ukmName={selectedUkm} user={user} onAuth={handleSetUser} />}
      {currentPage === "result" && <Result onNavigate={handleNavigate} ukmName={selectedUkm} user={user} onAuth={handleSetUser} />} 
      {currentPage === "help" && <Help onNavigate={handleNavigate} user={user} onAuth={handleSetUser} />}
      
      {/* ===== UPDATE: Teruskan isLoggedIn dan onLogout ke Profile ===== */}
      {currentPage === "profile" && (
        <Profile 
          onNavigate={handleNavigate} 
          user={user} 
          onAuth={handleSetUser}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogoutGlobal}
        />
      )}
      
      {currentPage === "voteconfirmation" && candidateData && (
        <VoteConfirmation onNavigate={handleNavigate} candidateData={candidateData} />
      )}

      {/* ===== UPDATE: Teruskan onLoginSuccess ke SignIn ===== */}
      {currentPage === "signin" && (
        <SignIn
          onSwitchToSignUp={() => handleNavigate("signup")}
          onBack={() => handleNavigate("home")}
          onNavigate={handleNavigate}
          onAuth={handleSetUser}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* ===== UPDATE: Teruskan onLoginSuccess ke SignUp ===== */}
      {currentPage === "signup" && (
        <SignUp
          onSwitchToSignIn={() => handleNavigate("signin")}
          onBack={() => handleNavigate("home")}
          onNavigate={handleNavigate}
          onAuth={handleSetUser}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;