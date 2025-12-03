import React, { useState } from "react";
// Hapus import global CSS karena setiap komponen sudah import CSS-nya sendiri
import Home from "./Home";
import Election from "./Election";
import Result from "./Result"; // Import file Result.js (tanpa 's')
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import UkmDetail from "./UkmDetail";

function App() {
  // State untuk menentukan halaman yang aktif (default: 'home')
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedUkm, setSelectedUkm] = useState("");

  const handleNavigate = (page, ukmName = "") => {
    setCurrentPage(page);
    if (ukmName) {
      setSelectedUkm(ukmName);
    }
  };

  return (
    <div>
      {/* Halaman Home */}
      {currentPage === "home" && <Home onNavigate={setCurrentPage} />}

      {currentPage === "ukmdetail" && <UkmDetail onNavigate={handleNavigate} ukmName={selectedUkm} />}

      {/* Halaman Election */}
      {currentPage === "election" && <Election onNavigate={setCurrentPage} />}

      {/* Halaman Result (sebelumnya Results) */}
      {currentPage === "result" && <Result onNavigate={setCurrentPage} />}

      {/* Halaman Sign In */}
      {currentPage === "signin" && <SignIn onSwitchToSignUp={() => setCurrentPage("signup")} onBack={() => setCurrentPage("home")} />}

      {/* Halaman Sign Up */}
      {currentPage === "signup" && <SignUp onSwitchToSignIn={() => setCurrentPage("signin")} onBack={() => setCurrentPage("home")} />}
    </div>
  );
}

export default App;
