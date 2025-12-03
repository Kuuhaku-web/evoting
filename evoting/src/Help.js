import React, { useState } from "react";
import { UserCircle, HelpCircle, ShieldCheck, Database, Lock, ChevronDown, ChevronUp } from "lucide-react";
import "./Help.css";

function Help({ onNavigate }) {
  // State untuk mengontrol accordion FAQ
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Apa itu E-Voting Berbasis Blockchain?",
      answer: "Aplikasi ini menggunakan teknologi blockchain untuk merekam setiap suara. Artinya, setiap suara yang masuk dicatat dalam buku besar digital (ledger) yang aman, transparan, dan tidak dapat diubah oleh siapapun, termasuk admin."
    },
    {
      question: "Mengapa sistem ini disebut Terdesentralisasi?",
      answer: "Desentralisasi berarti data suara tidak disimpan di satu server pusat saja, melainkan tersebar di banyak node jaringan. Ini mencegah manipulasi data, serangan peretas pada satu titik pusat, dan menjamin keberlangsungan sistem."
    },
    {
      question: "Apakah suara saya benar-benar rahasia?",
      answer: "Ya. Kami menggunakan kriptografi canggih. Identitas Anda diverifikasi saat login, namun saat Anda memberikan suara, pilihan Anda dienkripsi dan dipisahkan dari identitas pribadi Anda di dalam blockchain, menjamin anonimitas total."
    },
    {
      question: "Bisakah saya mengubah pilihan saya setelah voting?",
      answer: "Tidak. Salah satu sifat utama blockchain adalah 'Immutability' (Kekekalan). Setelah transaksi (suara) dikirim dan diverifikasi ke dalam blok, data tersebut tidak dapat diedit atau dihapus. Pastikan pilihan Anda sudah benar sebelum konfirmasi."
    },
    {
      question: "Bagaimana cara memverifikasi bahwa suara saya telah dihitung?",
      answer: "Setelah memilih, Anda akan mendapatkan 'Transaction Hash' atau ID unik. Anda dapat menggunakan ID ini untuk melacak keberadaan suara Anda di jaringan blockchain publik kami tanpa mengungkapkan siapa yang Anda pilih."
    }
  ];

  return (
    <div className="help-container">
      {/* Navbar (Konsisten dengan halaman lain) */}
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
            <a href="#result" className="nav-link" onClick={() => onNavigate("result")}>
              Result
            </a>
            <a href="#help" className="nav-link active">
              Help/FAQ
            </a>
            
            {/* Profile Icon */}
            <button className="profile-btn" onClick={() => console.log("Profile Clicked")}>
              <UserCircle size={32} color="#1f2937" />
            </button>

            {/* Login Button */}
            <button className="login-btn" onClick={() => onNavigate("signup")}>
              Login / Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="help-hero">
        <div className="help-hero-content">
          <HelpCircle size={64} color="#2563eb" className="hero-icon" />
          <h1 className="help-title">Pusat Bantuan & FAQ</h1>
          <p className="help-subtitle">
            Memahami bagaimana teknologi Blockchain mengamankan suara Anda di Unit Kegiatan Mahasiswa.
          </p>
        </div>
      </header>

      {/* Features Grid */}
      <section className="tech-features">
        <div className="feature-item">
          <ShieldCheck size={40} className="feature-icon" />
          <h3>Keamanan Tinggi</h3>
          <p>Data dilindungi kriptografi SHA-256.</p>
        </div>
        <div className="feature-item">
          <Database size={40} className="feature-icon" />
          <h3>Transparansi</h3>
          <p>Audit suara dapat dilakukan secara realtime.</p>
        </div>
        <div className="feature-item">
          <Lock size={40} className="feature-icon" />
          <h3>Anti Manipulasi</h3>
          <p>Data suara permanen dan tidak bisa diubah.</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="faq-heading">Pertanyaan Umum</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                {faq.question}
                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">© 2024 E-Voting System (Blockchain Powered). All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Help;