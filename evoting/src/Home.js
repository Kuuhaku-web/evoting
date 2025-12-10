// Home.js - Simpan di folder src/components/Home.js
import React, { useState, useEffect } from 'react';
import { Vote, Users, CheckSquare, Smartphone, Shield, TrendingUp, UserCircle, LogOut } from "lucide-react";
import './Home.css';

function Home({ onNavigate, user, onAuth }) {
  const [currentUser, setCurrentUser] = useState(user);

  // Watch for user prop changes
  useEffect(() => {
    console.log('👁️ Home - user prop changed:', user);
    console.log('📊 currentUser state will be:', user);
    setCurrentUser(user);
  }, [user]);

  // Also watch localStorage for real-time updates
  useEffect(() => {
    const checkUserInStorage = () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        console.log('Home - localStorage user:', storedUser);
        setCurrentUser(storedUser);
      } catch (err) {
        console.error('Error reading localStorage:', err);
      }
    };

    const interval = setInterval(checkUserInStorage, 500); // Check every 500ms
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
    if (onAuth) onAuth(null);
    onNavigate('home');
    window.location.hash = '';
  };
  return (
    <div className="home-container">
      {/* Navigation */}
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
            <a href="#results" className="nav-link" onClick={() => onNavigate("results")}>
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
                <span className="username-display" style={{
                  color: '#4b5563',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  {currentUser.username}
                </span>
                <button className="login-btn" onClick={handleLogout} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
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

      {/* TEMPORARY: Debug Section - Bisa dihapus nanti */}
      {currentUser && (
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #0ea5e9',
          padding: '1.5rem',
          margin: '1rem 2rem',
          borderRadius: '8px',
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <h3 style={{ color: '#0369a1', marginBottom: '0.5rem' }}>✅ Login Status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
            <div>
              <strong>Username:</strong> <span style={{ color: '#2563eb' }}>{currentUser.username}</span>
            </div>
            <div>
              <strong>Email:</strong> <span style={{ color: '#2563eb' }}>{currentUser.email}</span>
            </div>
            <div>
              <strong>User ID:</strong> <span style={{ color: '#2563eb', fontSize: '0.85rem' }}>{currentUser.userId}</span>
            </div>
            <div>
              <strong>Profile Picture:</strong> <span style={{ color: '#2563eb' }}>{currentUser.profilePicture ? '✓ Uploaded' : '✗ Not set'}</span>
            </div>
          </div>
        </div>
      )}
      
      {!currentUser && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fcd34d',
          padding: '1.5rem',
          margin: '1rem 2rem',
          borderRadius: '8px',
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#92400e', marginBottom: '0.5rem' }}>⏱️ Not Logged In</h3>
          <p style={{ color: '#78350f' }}>Please click "Login / Register" to access voting features</p>
        </div>
      )}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-illustration">
            <div className="illustration-wrapper">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
              <div className="circle circle-3"></div>
              <div className="circle circle-4"></div>
            </div>
          </div>
          <div className="hero-text">
            <h1 className="hero-title">Your Voice, Your Choice, Shape Your UKM's Future.</h1>
            <p className="hero-description">
              Welcome to the official E-Voting platform for student activity units. Participate in your UKM's governance with a secure, transparent, and easy-to-use system. Make your voice heard, help build a better community, and lead the
              change you want to see.
            </p>
            <button className="cta-btn">View Elections</button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Casting your vote is a simple and secure process. Follow these three easy steps to participate in the elections.</p>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon">
              <Users size={32} />
            </div>
            <h3 className="step-title">1. Register & Verify</h3>
            <p className="step-description">Quickly sign up using your student credentials and verify your identity to get started.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">
              <Vote size={32} />
            </div>
            <h3 className="step-title">2. Browse Candidates</h3>
            <p className="step-description">Learn about the candidates and their platforms to make an informed decision.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">
              <CheckSquare size={32} />
            </div>
            <h3 className="step-title">3. Cast Your Vote</h3>
            <p className="step-description">Submit your vote securely and confidentially from anywhere, on any device.</p>
          </div>
        </div>
      </section>

      {/* Upcoming Elections */}
      <section className="upcoming-elections">
        <h2 className="section-title">Upcoming Elections</h2>
        <div className="elections-grid">
          <div className="election-card">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop" alt="Photography Club" className="election-image" />
            <div className="election-info">
              <h3 className="election-title">Photography Club Election</h3>
              <p className="election-date">Voting Period: Oct 15 - Oct 18</p>
              <button className="learn-more-btn">Learn More</button>
            </div>
          </div>
          <div className="election-card">
            <img src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=250&fit=crop" alt="Student Debate" className="election-image" />
            <div className="election-info">
              <h3 className="election-title">Student Debate Union Presidency</h3>
              <p className="election-date">Voting Period: Oct 20 - Oct 23</p>
              <button className="learn-more-btn">Learn More</button>
            </div>
          </div>
          <div className="election-card">
            <img src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=250&fit=crop" alt="Environmental Club" className="election-image" />
            <div className="election-info">
              <h3 className="election-title">Environmental Club Leadership</h3>
              <p className="election-date">Voting Period: Oct 25 - Oct 28</p>
              <button className="learn-more-btn">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Why E-Voting Matters */}
      <section className="why-matters">
        <h2 className="section-title">Why E-Voting Matters</h2>
        <p className="section-subtitle">Our platform is built to make student governance more accessible, secure, and transparent for everyone.</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Smartphone size={32} />
            </div>
            <h3 className="feature-title">Vote from Anywhere</h3>
            <p className="feature-description">Cast your ballot conveniently from your laptop, tablet, or smartphone.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Shield size={32} />
            </div>
            <h3 className="feature-title">Secure & Anonymous</h3>
            <p className="feature-description">We use advanced encryption to protect your vote and ensure your privacy.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <TrendingUp size={32} />
            </div>
            <h3 className="feature-title">Transparent Results</h3>
            <p className="feature-description">Access real-time, verifiable results as soon as the election period ends.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to make a difference?</h2>
          <p className="cta-description">Join thousands of students who have already made their voices heard. Your participation strengthens our community and shapes the future of our student activity units.</p>
          <button className="cta-btn-white" onClick={() => onNavigate("signup")}>
            Cast Your Vote Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">© 2024 E-Voting System. All Rights Reserved.</p>
          <div className="footer-links">
            <a href="#about" className="footer-link">
              About Us
            </a>
            <a href="#privacy" className="footer-link">
              Privacy Policy
            </a>
            <a href="#contact" className="footer-link">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;