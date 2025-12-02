import React, { useState } from 'react';
import './SignIn.css'; 

function SignIn({ onSwitchToSignUp }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Data:', formData);
   
  };

  return (
    <div className="container">
     
      <div className="form-card signin-card">
        <h1 className="title">Sign In</h1>

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
            />
          </div>

          
          <button 
            type="submit" 
            className="signin-btn"
          >
            Sign In
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