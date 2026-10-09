import React, { useState, useRef } from 'react';
import '../../styles/index.css';
import logoImage from '../../assets/logo.jpeg';
import skinImage from '../../assets/women-image.png';

// Route paths
const homePath = import.meta.env.BASE_URL;
const dashboardPath = `${import.meta.env.BASE_URL}dashboard`;
const analyzePath = `${import.meta.env.BASE_URL}analyze`;
const reportPath = `${import.meta.env.BASE_URL}report`;
const profilePath = `${import.meta.env.BASE_URL}profile`;

const sidebarItems = [
  ['▦', 'Dashboard', false],
  ['↥', 'Analysis', false],
  ['▤', 'Reports', false],
  ['◉', 'Profile', true],
  ['♙', 'Settings', false],
  ['⌂', 'Help', false],
];

function Card({ children, className = '' }) {
  return (
    <section
      className={`rounded-xl border border-[#e5eaf0] bg-white shadow-[0_3px_12px_rgba(25,53,90,0.04)] ${className}`}
    >
      {children}
    </section>
  );
}

export default function ProfilePage() {
  // 🔄 TODO: Replace with real user data from backend
  const [profile, setProfile] = useState({
    name: 'Priya Sharma',
    age: 26,
    email: 'priya@example.com',
    avatar: null,
  });

  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file.' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be under 2MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setProfile((prev) => ({ ...prev, avatar: reader.result }));
      setMessage({ type: '', text: '' });
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!profile.name.trim()) {
      setMessage({ type: 'error', text: 'Name is required.' });
      return;
    }
    if (!profile.age || profile.age < 1 || profile.age > 120) {
      setMessage({ type: 'error', text: 'Please enter a valid age (1–120).' });
      return;
    }

    setIsSaving(true);

    // 🔄 TODO: Replace with actual API call once backend endpoint is defined
    setTimeout(() => {
      setIsSaving(false);
      setMessage({ type: 'success', text: 'Profile saved! (placeholder — not persisted)' });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#182440] lg:flex">
      {/* SIDEBAR */}
      <aside className="flex w-full shrink-0 flex-col bg-[#062456] px-4 py-5 text-white lg:min-h-screen lg:w-[218px] lg:px-3">
        <a href={homePath} className="mb-7 flex items-center gap-2 px-2 lg:px-3">
          <img src={logoImage} alt="DermaCare AI logo" className="h-10 w-10 rounded-xl object-cover" />
          <div>
            <strong className="block text-[17px] leading-tight">
              DermaCare <span className="text-[#38c8c6]">AI</span>
            </strong>
            <span className="text-[9px] leading-tight text-white/75">
              AI-Powered Skin Analysis<br />&amp; Care
            </span>
          </div>
        </a>

        <nav className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:block" aria-label="Dashboard navigation">
          {sidebarItems.map(([icon, label, active]) => (
            <a
              key={label}
              href={
                label === 'Profile'
                  ? profilePath
                  : label === 'Dashboard'
                  ? dashboardPath
                  : label === 'Analysis'
                  ? analyzePath
                  : label === 'Reports'
                  ? reportPath
                  : '#'
              }
              className={`mb-1 flex min-h-11 items-center justify-center gap-3 rounded-lg px-3 text-[13px] font-semibold transition sm:flex-col sm:gap-1 lg:flex-row lg:justify-start lg:gap-3 ${
                active
                  ? 'bg-[#0aa9ad] text-white shadow-[0_5px_15px_rgba(0,196,190,0.2)]'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-lg leading-none" aria-hidden="true">{icon}</span>
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="mt-4 hidden border-t border-white/20 pt-4 lg:block">
          <a
            href={homePath}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-[13px] font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <span className="text-lg" aria-hidden="true">⇦</span>Log out
          </a>
        </div>
      </aside>

      {/* MAIN */}
      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-[-0.5px] text-[#10245c] sm:text-3xl">
              My Profile
            </h1>
            <p className="mt-1 text-sm text-[#69758a]">Manage your personal information.</p>
          </div>
          <button
            type="button"
            aria-label="Open profile menu"
            className="flex items-center gap-2"
          >
            <img
              src={preview || profile.avatar || skinImage}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover object-[48%_35%]"
            />
          </button>
        </header>

        <div className="mx-auto max-w-[720px]">
          <form onSubmit={handleSave}>
            <Card className="p-5 sm:p-7">
              {/* Profile Picture */}
              <div className="mb-8 flex flex-col items-center">
                <div
                  onClick={triggerFileInput}
                  className="group relative h-[120px] w-[120px] cursor-pointer rounded-full"
                  title="Click to change picture"
                >
                  {preview || profile.avatar ? (
                    <img
                      src={preview || profile.avatar}
                      alt="Profile"
                      className="h-full w-full rounded-full border-4 border-[#e5f8f6] object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-[#e5f8f6] bg-gradient-to-br from-[#0aa9ad] to-[#062456] text-[42px] font-bold text-white">
                      {profile.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                    Change Photo
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="mt-3 border-none bg-none text-sm font-semibold text-[#147b82] transition-colors hover:text-[#062456] hover:underline"
                >
                  Upload new photo
                </button>
                <p className="mt-1 text-[11px] text-[#69758a]">JPG or PNG, max 2MB</p>
              </div>

              {/* Fields */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-[13px] font-semibold text-[#10245c]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border-[1.5px] border-[#e5eaf0] bg-[#f7f9fc] px-3.5 py-3 text-sm text-[#182440] transition-all duration-200 placeholder:text-[#a4acbd] focus:border-[#0aa9ad] focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(10,169,173,0.1)]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="age" className="text-[13px] font-semibold text-[#10245c]">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    min="1"
                    max="120"
                    value={profile.age}
                    onChange={handleChange}
                    placeholder="Enter your age"
                    className="w-full rounded-lg border-[1.5px] border-[#e5eaf0] bg-[#f7f9fc] px-3.5 py-3 text-sm text-[#182440] transition-all duration-200 placeholder:text-[#a4acbd] focus:border-[#0aa9ad] focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(10,169,173,0.1)]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-[13px] font-semibold text-[#10245c]">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border-[1.5px] border-[#e5eaf0] bg-[#f7f9fc] px-3.5 py-3 text-sm text-[#182440] transition-all duration-200 placeholder:text-[#a4acbd] focus:border-[#0aa9ad] focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(10,169,173,0.1)]"
                  />
                </div>

                {message.text && (
                  <div
                    className={`rounded-lg border-l-[3px] px-3.5 py-2.5 text-[13px] font-medium ${
                      message.type === 'error'
                        ? 'border-[#bd3f4d] bg-[#fef2f2] text-[#b91c1c]'
                        : 'border-[#0aa9ad] bg-[#e5f8f6] text-[#147b82]'
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSaving}
                  className="mt-1.5 w-full cursor-pointer rounded-[10px] bg-[#09275d] py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0b2c78] hover:shadow-[0_8px_20px_rgba(9,39,93,0.25)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
}