import { useEffect, useState } from "react";

function AdminIcon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),

    users: (
      <>
        <path d="M16 21v-1.8a4.2 4.2 0 0 0-4.2-4.2H7.2A4.2 4.2 0 0 0 3 19.2V21" />
        <circle cx="9.5" cy="7.5" r="3.5" />
        <path d="M16 3.8a3.5 3.5 0 0 1 0 6.8" />
        <path d="M21 21v-1.8a4.2 4.2 0 0 0-3-4" />
      </>
    ),

    analysis: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M7 16l3-3 2 2 5-6" />
        <path d="M7 7h3" />
      </>
    ),

    reports: (
      <>
        <path d="M6 2.8h9l4 4V21H6z" />
        <path d="M15 2.8V7h4" />
        <path d="M9 11h6M9 15h6M9 19h4" />
      </>
    ),

    content: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <path d="M7 8h10M7 12h10M7 16h6" />
      </>
    ),

    feedback: (
      <>
        <path d="M20.5 11.5c0 4.1-3.8 7.5-8.5 7.5-1 0-2-.2-2.9-.5L4 20l1.4-3.9C4.5 14.9 4 13.2 4 11.5 4 7.4 7.8 4 12.5 4s8 3.4 8 7.5Z" />
        <path d="M8.5 11.5h.01M12.5 11.5h.01M16.5 11.5h.01" />
      </>
    ),

    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-2.6v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6v-2.6h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.6v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2v2.6h-.2a1.7 1.7 0 0 0-1.5 1Z" />
      </>
    ),

    logout: (
      <>
        <path d="M10 5H5.5A1.5 1.5 0 0 0 4 6.5v11A1.5 1.5 0 0 0 5.5 19H10" />
        <path d="M14 8l4 4-4 4M8 12h10" />
      </>
    ),

    bell: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
        <path d="M10 21h4" />
      </>
    ),

    profile: (
      <>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
      </>
    ),

    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),

    shield: (
      <>
        <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),

    save: (
      <>
        <path d="M5 3h12l3 3v15H4V3h1Z" />
        <path d="M8 3v6h8V3" />
        <path d="M8 21v-7h8v7" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}

function AdminSettings() {
  const [admin, setAdmin] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      window.location.href = `${import.meta.env.BASE_URL}admin`;
      return;
    }

    const savedAdmin = localStorage.getItem("adminData");

    if (savedAdmin) {
      try {
        const parsedAdmin = JSON.parse(savedAdmin);
        setAdmin(parsedAdmin);
        setName(parsedAdmin.name || "");
        setEmail(parsedAdmin.email || "");
      } catch {
        setAdmin(null);
      }
    }
  }, []);

  const goTo = (path) => {
    window.location.href = `${import.meta.env.BASE_URL}${path}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");

    window.location.href = `${import.meta.env.BASE_URL}admin`;
  };

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      window.location.href = `${import.meta.env.BASE_URL}admin`;
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          ...(password.trim() ? { password: password.trim() } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setAdmin(data.admin);
      setName(data.admin.name || "");
      setEmail(data.admin.email || "");
      setPassword("");
      localStorage.setItem("adminData", JSON.stringify(data.admin));
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fafb] text-[#172033]">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[285px] overflow-hidden bg-[#102f2e] text-white lg:block">

        <div className="flex h-[96px] items-center px-7">
          <div className="flex h-[62px] w-[230px] items-center overflow-hidden rounded-xl bg-white px-2">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="DermaCare AI"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <nav className="mt-5 px-4">

          <button
            onClick={() => goTo("admin/dashboard")}
            className="mb-2 flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium text-[#d4e1df] transition hover:bg-[#194743]"
          >
            <span className="flex w-6 justify-center">
              <AdminIcon name="dashboard" size={19} />
            </span>
            Dashboard
          </button>

          <button
            onClick={() => goTo("admin/users")}
            className="mb-2 flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium text-[#d4e1df] transition hover:bg-[#194743]"
          >
            <span className="flex w-6 justify-center">
              <AdminIcon name="users" size={19} />
            </span>
            Users
          </button>

          <button
            onClick={() => goTo("admin/skin-analysis")}
            className="mb-2 flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium text-[#d4e1df] transition hover:bg-[#194743]"
          >
            <span className="flex w-6 justify-center">
              <AdminIcon name="analysis" size={19} />
            </span>
            Skin Analysis
          </button>

          <button
            onClick={() => goTo("admin/reports")}
            className="mb-2 flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium text-[#d4e1df] transition hover:bg-[#194743]"
          >
            <span className="flex w-6 justify-center">
              <AdminIcon name="reports" size={19} />
            </span>
            Reports
          </button>

          <button
            onClick={() => goTo("admin/content")}
            className="mb-2 flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium text-[#d4e1df] transition hover:bg-[#194743]"
          >
            <span className="flex w-6 justify-center">
              <AdminIcon name="content" size={19} />
            </span>
            Manage Content
          </button>

          <button
            onClick={() => goTo("admin/feedback")}
            className="mb-2 flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium text-[#d4e1df] transition hover:bg-[#194743]"
          >
            <span className="flex w-6 justify-center">
              <AdminIcon name="feedback" size={19} />
            </span>
            Feedback
          </button>

          <button
            className="mb-2 flex w-full items-center gap-5 rounded-2xl bg-[#286d67] px-5 py-4 text-left text-[15px] font-semibold text-white shadow-lg"
          >
            <span className="flex w-6 justify-center">
              <AdminIcon name="settings" size={19} />
            </span>
            Settings
          </button>

          <div className="my-5 border-t border-[#31504e]" />

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium text-white transition hover:bg-[#194743]"
          >
            <span className="flex w-6 justify-center">
              <AdminIcon name="logout" size={19} />
            </span>
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="lg:ml-[285px]">

        {/* TOP BAR */}
        <header className="sticky top-0 z-30 flex h-[78px] items-center justify-end border-b border-[#e6ecee] bg-white/95 px-5 backdrop-blur md:px-8">

          <div className="flex items-center gap-5">

            <button
              className="relative hidden text-[#172033] sm:block"
              aria-label="Notifications"
            >
              <AdminIcon name="bell" size={20} />
            </button>

            <div className="hidden h-9 w-px bg-[#e1e7e9] sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8e8f4] text-[#25304a]">
                <AdminIcon name="profile" size={21} />
              </div>

              <div className="hidden md:block">
                <p className="text-sm font-bold text-[#172033]">
                  {admin?.name || "Admin"}
                </p>

                <p className="text-xs text-[#69767e]">
                  Administrator
                </p>
              </div>

              <span className="text-lg">⌄</span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="px-5 py-7 md:px-8">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-[38px] font-bold leading-tight tracking-[-1px] text-[#121b31]">
              Settings
            </h1>

            <p className="mt-2 text-[16px] text-[#66727d]">
              Manage your administrator account and security settings.
            </p>
          </div>

          {/* PROFILE */}
          <div className="mb-6 rounded-2xl border border-[#e1e8eb] bg-white shadow-[0_3px_15px_rgba(20,50,60,0.03)]">

            <div className="border-b border-[#edf0f1] px-6 py-5">
              <div className="flex items-center gap-3">
                <AdminIcon name="profile" size={21} />

                <div>
                  <h2 className="text-lg font-bold text-[#182238]">
                    Administrator Profile
                  </h2>

                  <p className="mt-1 text-sm text-[#7b878e]">
                    Your current administrator account information.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#44515a]">
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Admin name"
                  className="h-12 w-full rounded-xl border border-[#dfe7e9] bg-[#f8fafb] px-4 text-sm text-[#45525b] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#44515a]">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin email"
                  className="h-12 w-full rounded-xl border border-[#dfe7e9] bg-[#f8fafb] px-4 text-sm text-[#45525b] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#44515a]">
                  Role
                </label>

                <input
                  type="text"
                  value={admin?.role || "admin"}
                  readOnly
                  className="h-12 w-full rounded-xl border border-[#dfe7e9] bg-[#f8fafb] px-4 text-sm capitalize text-[#45525b] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#44515a]">
                  Account Status
                </label>

                <div className="flex h-12 items-center">
                  <span className="rounded-full bg-[#dcf7e9] px-4 py-2 text-xs font-semibold text-[#16865e]">
                    Active
                  </span>
                </div>
              </div>

            </div>

            <div className="flex justify-end border-t border-[#edf0f1] px-6 py-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-xl bg-[#176b52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#125640]"
              >
                <AdminIcon name="save" size={17} />
                Save Changes
              </button>
            </div>

          </div>

          {/* SECURITY */}
          <div className="mb-6 rounded-2xl border border-[#e1e8eb] bg-white shadow-[0_3px_15px_rgba(20,50,60,0.03)]">

            <div className="border-b border-[#edf0f1] px-6 py-5">
              <div className="flex items-center gap-3">
                <AdminIcon name="shield" size={21} />

                <div>
                  <h2 className="text-lg font-bold text-[#182238]">
                    Security
                  </h2>

                  <p className="mt-1 text-sm text-[#7b878e]">
                    Manage administrator account security.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">

              <div className="flex flex-col justify-between gap-5 rounded-xl border border-[#e5ebed] bg-[#f8fafb] p-5 md:flex-row md:items-center">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eaf3ff] text-[#397fd1]">
                    <AdminIcon name="lock" size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#26333c]">
                      Password & Authentication
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#7b878e]">
                      Set a new password for your administrator account.
                    </p>
                  </div>

                </div>

                <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="h-11 flex-1 rounded-lg border border-[#d8e1e4] bg-white px-4 text-sm text-[#45525b] outline-none focus:border-[#176b52]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="rounded-lg border border-[#d8e1e4] bg-white px-4 py-2.5 text-sm font-semibold text-[#45525b] transition hover:border-[#176b52] hover:text-[#176b52]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!password.trim() || saving}
                    className="rounded-lg bg-[#176b52] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#125640] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Change Password
                  </button>
                </div>

              </div>

            </div>
          </div>

          {/* SESSION */}
          <div className="rounded-2xl border border-[#e1e8eb] bg-white shadow-[0_3px_15px_rgba(20,50,60,0.03)]">

            <div className="border-b border-[#edf0f1] px-6 py-5">
              <div className="flex items-center gap-3">
                <AdminIcon name="shield" size={21} />

                <div>
                  <h2 className="text-lg font-bold text-[#182238]">
                    Session
                  </h2>

                  <p className="mt-1 text-sm text-[#7b878e]">
                    Manage your current administrator session.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-5 p-6 md:flex-row md:items-center">

              <div>
                <h3 className="font-semibold text-[#26333c]">
                  Sign out of Admin Panel
                </h3>

                <p className="mt-1 text-sm text-[#7b878e]">
                  Your current authentication session will be removed.
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                Logout
              </button>

            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 shadow-lg">
              {error}
            </div>
          )}

          {/* SAVE MESSAGE */}
          {saved && (
            <div className="fixed bottom-6 right-6 rounded-xl bg-[#176b52] px-5 py-3 text-sm font-semibold text-white shadow-lg">
              Settings saved successfully.
            </div>
          )}

          {/* FOOTER */}
          <div className="py-8 text-center text-xs text-[#87939b]">
            © 2026 DermaCare AI. Admin Panel.
          </div>

        </main>
      </div>
    </div>
  );
}

export default AdminSettings;