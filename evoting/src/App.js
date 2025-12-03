import React, { useState, useEffect } from "react";
// Import semua komponen halaman
import Home from "./Home";
import Election from "./Election";
import Result from "./Result";
import Help from "./Help"; 
import SignIn from "./SignIn";
import SignUp from "./SignUp";

function App() {
  // State untuk menentukan halaman yang aktif (default: 'home')
  const [currentPage, setCurrentPage] = useState("home");

  // --- TAMBAHAN KODE DI SINI ---
  // Gunakan useEffect untuk mengecek URL saat aplikasi pertama dibuka atau saat hash berubah
  useEffect(() => {
    const handleHashChange = () => {
      // Ambil hash dari URL (misal: #help -> help)
      const hash = window.location.hash.replace("#", "");
      
      // Jika ada hash yang valid, update state currentPage
      if (hash) {
        setCurrentPage(hash);
      } else {
        setCurrentPage("home");
      }
    };

    // Jalankan fungsi saat komponen pertama kali dimuat (untuk refresh page)
    handleHashChange();

    // Dengarkan perubahan hash (saat user klik link href="#help")
    window.addEventListener("hashchange", handleHashChange);

    // Bersihkan listener saat komponen di-unmount (best practice)
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);
  // --- AKHIR TAMBAHAN KODE ---

  return (
    <div>
      {/* Navigasi ke Halaman Home */}
      {currentPage === "home" && <Home onNavigate={setCurrentPage} />}

      {/* Navigasi ke Halaman Election */}
      {currentPage === "election" && <Election onNavigate={setCurrentPage} />}

      {/* Navigasi ke Halaman Result */}
      {currentPage === "result" && <Result onNavigate={setCurrentPage} />}

      {/* Navigasi ke Halaman Help/FAQ */}
      {currentPage === "help" && <Help onNavigate={setCurrentPage} />}

      {/* Navigasi ke Halaman Sign In */}
      {currentPage === "signin" && (
        <SignIn 
          onSwitchToSignUp={() => {
            setCurrentPage("signup");
            window.location.hash = "signup"; // Opsional: update URL juga
          }} 
          onBack={() => {
            setCurrentPage("home");
            window.location.hash = ""; // Opsional: reset URL
          }} 
        />
      )}

      {/* Navigasi ke Halaman Sign Up */}
      {currentPage === "signup" && (
        <SignUp 
          onSwitchToSignIn={() => {
            setCurrentPage("signin");
            window.location.hash = "signin"; // Opsional: update URL juga
          }} 
          onBack={() => {
            setCurrentPage("home");
            window.location.hash = ""; // Opsional: reset URL
          }} 
        />
      )}
    </div>
  );
}

export default App;