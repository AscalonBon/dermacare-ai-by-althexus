import React, { useState } from 'react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
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
    <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-[radial-gradient(circle_at_80%_45%,#e9f4ff_0%,#f5f9ff_35%,#ffffff_70%)] font-[Arial,Helvetica,sans-serif]">
      <div className="w-full max-w-[420px] bg-white border border-[#E2E7EF] rounded-2xl px-8 pt-10 pb-8 shadow-[0_12px_35px_rgba(35,77,130,0.08)] max-sm:px-5 max-sm:pt-7 max-sm:pb-6 max-sm:rounded-xl">
        {/* Brand */}
        <div className="text-center mb-7">
          <div className="w-14 h-14 mx-auto mb-3.5 rounded-[14px] bg-gradient-to-br from-[#2878e8] to-[#173d9c] text-white flex items-center justify-center text-[28px] font-bold max-sm:w-12 max-sm:h-12 max-sm:text-2xl">
            ✚
          </div>
          <h1 className="text-2xl font-bold text-[#10245C] mb-1.5 max-sm:text-[22px]">
            DermaCare AI
          </h1>
          <p className="text-sm text-[#5F6D84] m-0">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-[18px]" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-[13px] font-semibold text-[#10245C]">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                className="w-full px-3.5 py-3 text-sm font-[Arial,Helvetica,sans-serif] border-[1.5px] border-[#E2E7EF] rounded-lg bg-[#F5F9FF] text-[#1A1A1A] transition-all duration-200 box-border focus:outline-none focus:border-[#2168D7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(33,104,215,0.1)] placeholder:text-[#A0AEC0] max-sm:px-3 max-sm:py-[11px]"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[13px] font-semibold text-[#10245C]">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className="w-full px-3.5 py-3 text-sm font-[Arial,Helvetica,sans-serif] border-[1.5px] border-[#E2E7EF] rounded-lg bg-[#F5F9FF] text-[#1A1A1A] transition-all duration-200 box-border focus:outline-none focus:border-[#2168D7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(33,104,215,0.1)] placeholder:text-[#A0AEC0] max-sm:px-3 max-sm:py-[11px]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[13px] font-semibold text-[#10245C]">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className="w-full px-3.5 py-3 text-sm font-[Arial,Helvetica,sans-serif] border-[1.5px] border-[#E2E7EF] rounded-lg bg-[#F5F9FF] text-[#1A1A1A] transition-all duration-200 box-border focus:outline-none focus:border-[#2168D7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(33,104,215,0.1)] placeholder:text-[#A0AEC0] max-sm:px-3 max-sm:py-[11px]"
            />
          </div>

          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-[13px] font-semibold text-[#10245C]">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full px-3.5 py-3 text-sm font-[Arial,Helvetica,sans-serif] border-[1.5px] border-[#E2E7EF] rounded-lg bg-[#F5F9FF] text-[#1A1A1A] transition-all duration-200 box-border focus:outline-none focus:border-[#2168D7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(33,104,215,0.1)] placeholder:text-[#A0AEC0] max-sm:px-3 max-sm:py-[11px]"
              />
            </div>
          )}

          {message.text && (
            <div
              className={`px-3.5 py-2.5 rounded-lg text-[13px] font-medium leading-[1.5] border-l-[3px] ${
                message.type === 'error'
                  ? 'bg-[#FEF2F2] text-[#B91C1C] border-[#DC2626]'
                  : 'bg-[#F0FDF4] text-[#166534] border-[#22C55E]'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-[13px] text-[15px] font-semibold font-[Arial,Helvetica,sans-serif] text-white bg-[#123a91] border-none rounded-[10px] cursor-pointer transition-all duration-200 mt-1.5 hover:bg-[#0B2C78] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(18,58,145,0.25)] active:translate-y-0 focus-visible:outline-[3px] focus-visible:outline-[#2168D7] focus-visible:outline-offset-2 max-sm:py-3 max-sm:text-sm"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        {/* Switch Mode */}
        <div className="text-center mt-5 text-sm text-[#5F6D84]">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={switchMode}
                className="bg-none border-none text-[#2168D7] font-semibold text-sm font-[Arial,Helvetica,sans-serif] cursor-pointer p-0 transition-colors duration-200 hover:text-[#10245C] hover:underline focus-visible:outline-2 focus-visible:outline-[#2168D7] focus-visible:outline-offset-2 focus-visible:rounded"
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={switchMode}
                className="bg-none border-none text-[#2168D7] font-semibold text-sm font-[Arial,Helvetica,sans-serif] cursor-pointer p-0 transition-colors duration-200 hover:text-[#10245C] hover:underline focus-visible:outline-2 focus-visible:outline-[#2168D7] focus-visible:outline-offset-2 focus-visible:rounded"
              >
                Login
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#69758A] mt-6 mb-0 leading-[1.5]">
          By continuing, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;