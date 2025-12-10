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
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Login gagal');
      }

      const data = await res.json();
      console.log('Login berhasil:', data);

      // Simpan user ke localStorage
      const user = {
        userId: data.userId,
        email: data.email,
        username: data.username,
        profilePicture: data.profilePicture,
        token: data.token
      };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', data.token);

      // Panggil callback onAuth jika ada
      if (onAuth) onAuth(user);

      // Navigasi ke home
      onNavigate('home');
      window.location.hash = '';
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat login');
      console.error('Login error:', err);
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