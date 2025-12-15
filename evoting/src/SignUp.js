// SignUp.js - Simpan di folder src/components/SignUp.js
import React, { useState } from "react";
import { Check, X, ArrowLeft } from "lucide-react";
import "./SignIn.css";

function SignUp({ onSwitchToSignIn, onBack, onNavigate, onAuth, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username wajib diisi";
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }
    if (!formData.rePassword) {
      newErrors.rePassword = "Konfirmasi password wajib diisi";
    } else if (formData.password !== formData.rePassword) {
      newErrors.rePassword = "Password tidak cocok";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://evoting-git-main-edwins-projects-0fa94835.vercel.app';
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Sign up gagal');
      }

      const data = await res.json();
      console.log('Sign up berhasil:', data);

      // Handle both flat dan nested user structure
      const userData = data.user || data;

      // Simpan user ke localStorage
      const user = {
        userId: userData.userId || userData._id || userData.id,
        email: userData.email,
        username: userData.username,
        profilePicture: userData.profilePicture || null,
        createdAt: userData.createdAt,
        token: data.token
      };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', data.token);

      // Panggil onAuth jika ada
      if (onAuth) {
        console.log('Calling onAuth with user:', user);
        onAuth(user);
      }

      // ===== PANGGIL onLoginSuccess (PENTING) =====
      if (onLoginSuccess) {
        console.log('🎉 Calling onLoginSuccess callback');
        onLoginSuccess();
      }

      // Tampilkan popup sukses
      setShowPopup(true);

      // Setelah 2 detik, navigasi ke home
      setTimeout(() => {
        if (onNavigate) onNavigate('home');
        window.location.hash = '';
      }, 2000);

    } catch (err) {
      setApiError(err.message || 'Terjadi kesalahan saat sign up');
      console.error('Sign up error:', err);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setFormData({ username: "", email: "", password: "", rePassword: "" });
  };

  return (
    <div className="container">
      <div className="form-card">
        <h1 className="title">Sign Up</h1>

        {apiError && <div style={{
          backgroundColor: '#fee',
          color: '#c00',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          fontSize: '14px'
        }}>{apiError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="label">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className={`input-field ${errors.username ? "input-error" : ""}`} disabled={loading} />
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>

          <div className="input-group">
            <label className="label">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@gmail.com" className={`input-field ${errors.email ? "input-error" : ""}`} disabled={loading} />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="input-group">
            <label className="label">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="************" className={`input-field ${errors.password ? "input-error" : ""}`} disabled={loading} />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="input-group">
            <label className="label">Re-password</label>
            <input type="password" name="rePassword" value={formData.rePassword} onChange={handleChange} placeholder="************" className={`input-field ${errors.rePassword ? "input-error" : ""}`} disabled={loading} />
            {errors.rePassword && <p className="error-text">{errors.rePassword}</p>}
          </div>

          <button type="submit" className="submit-btn submit-btn-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="footer-text text-center">
          Already have an account?
          <span className="link-text" onClick={onSwitchToSignIn}>
            Sign In
          </span>
        </p>
      </div>

      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closePopup}>
              <X size={24} color="#ef4444" />
            </button>

            <div className="success-icon">
              <Check size={40} color="white" strokeWidth={4} />
            </div>

            <h2 className="success-title">Sign up berhasil!</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;
