import React, { useState, useEffect } from "react";
// Import semua komponen halaman
import Home from "./Home";
import Election from "./Election";
import Result from "./Result";
import Help from "./Help";
import Profile from "./Profile"; // <--- 1. IMPORT PROFILE
import SignIn from "./SignIn";
import SignUp from "./SignUp";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

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

      {currentPage === "election" && <Election onNavigate={setCurrentPage} />}

      {currentPage === "result" && <Result onNavigate={setCurrentPage} />}

      {currentPage === "help" && <Help onNavigate={setCurrentPage} />}
      
      {/* --- 2. TAMBAHKAN NAVIGASI KE PROFILE --- */}
      {currentPage === "profile" && <Profile onNavigate={setCurrentPage} />}

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