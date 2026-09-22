
import React, { useState } from 'react';
import "../../styles/login.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Signup
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Basic validation
    if (!formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    if (!isLogin) {
      if (!formData.name) {
        setMessage({ type: 'error', text: 'Please enter your name.' });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Passwords do not match.' });
        return;
      }
    }

    // 🔄 TODO: Replace with actual API call
    // For now, just show success message
    if (isLogin) {
      setMessage({ type: 'success', text: 'Login successful! (placeholder)' });
    } else {
      setMessage({ type: 'success', text: 'Account created! (placeholder)' });
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo / Brand */}
        <div className="login-brand">
          <div className="login-logo">✚</div>
          <h1 className="login-title">DermaCare AI</h1>
          <p className="login-subtitle">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="login-field">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
          )}

          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>

          {!isLogin && (
            <div className="login-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          )}

        
          {message.text && (
            <div className={`login-message ${message.type}`}>
              {message.text}
            </div>
          )}

          
          <button type="submit" className="login-btn">
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="login-switch">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button type="button" onClick={switchMode} className="login-link">
                Create Account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={switchMode} className="login-link">
                Login
              </button>
            </>
          )}
        </div>

       
        <p className="login-footer">
          By continuing, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;