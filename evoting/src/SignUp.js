import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import './SignIn.css';

function SignUp({ onSwitchToSignIn }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    rePassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username wajib diisi';
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    if (!formData.rePassword) {
      newErrors.rePassword = 'Konfirmasi password wajib diisi';
    } else if (formData.password !== formData.rePassword) {
      newErrors.rePassword = 'Password tidak cocok';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      
      setShowPopup(true);
      console.log('Form berhasil disubmit:', formData);
    } else {
      setErrors(newErrors);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    
    setFormData({ username: '', email: '', password: '', rePassword: '' });
  };

  return (
    <div className="container">
      <div className="form-card">
        <h1 className="title">Sign Up</h1>

        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label className="label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className={`input-field ${errors.username ? 'input-error' : ''}`}
            />
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>

          
          <div className="input-group">
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className={`input-field ${errors.email ? 'input-error' : ''}`}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

         
          <div className="input-group">
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="************"
              className={`input-field ${errors.password ? 'input-error' : ''}`}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          
          <div className="input-group">
            <label className="label">Re-password</label>
            <input
              type="password"
              name="rePassword"
              value={formData.rePassword}
              onChange={handleChange}
              placeholder="************"
              className={`input-field ${errors.rePassword ? 'input-error' : ''}`}
            />
            {errors.rePassword && <p className="error-text">{errors.rePassword}</p>}
          </div>

          <button type="submit" className="submit-btn submit-btn-full">
            Sign Up
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