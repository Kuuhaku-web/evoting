import React, { useState } from 'react';
import './SignIn.css'; 

// --- PERBAIKAN 1: Tambahkan onNavigate di sini ---
function SignIn({ onSwitchToSignUp, onNavigate, onAuth }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Starting login with:', formData);
      
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      console.log('📍 Response status:', res.status);

      if (!res.ok) {
        const errData = await res.json();
        console.log('❌ Login error response:', errData);
        throw new Error(errData.message || 'Login gagal');
      }

      const data = await res.json();
      console.log('✅ Login berhasil, response:', data);

      // Handle both flat dan nested user structure
      const userData = data.user || data; // If data.user exists, use it; otherwise use data

      // Simpan user ke localStorage
      const user = {
        userId: userData.userId || userData._id || userData.id,
        email: userData.email,
        username: userData.username,
        profilePicture: userData.profilePicture || null,
        token: data.token
      };
      
      console.log('💾 Saving to localStorage:', user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', data.token);

      // Verify localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      console.log('✔️ Verified localStorage user:', storedUser);

      // Panggil callback onAuth untuk update state di App.js
      if (onAuth) {
        console.log('🔄 Calling onAuth with user:', user);
        onAuth(user);
      }

      // Wait sedikit kemudian navigasi agar state terupdate
      console.log('⏳ Waiting 500ms before navigation...');
      setTimeout(() => {
        console.log('🚀 Navigating to home');
        onNavigate('home');
        window.location.hash = '';
      }, 500);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat login');
      console.error('❌ Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-card signin-card">
        <h1 className="title">Sign In</h1>

        {error && <div style={{
          backgroundColor: '#fee',
          color: '#c00',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          fontSize: '14px'
        }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="input-field"
              required
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="****************"
              className="input-field"
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="footer-text text-left">
          Dont have an account? 
          <span className="link-text" onClick={onSwitchToSignUp}>
            SignUp
          </span>
          for creating a new account!
        </div>

      </div>
    </div>
  );
}

export default SignIn;