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

    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.3" />
        <path d="m16 16 4.2 4.2" />
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
  };

  return <svg {...common}>{icons[name]}</svg>;
}

function AdminFeedback() {
  const [admin, setAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      window.location.href = `${import.meta.env.BASE_URL}admin`;
      return;
    }

    const savedAdmin = localStorage.getItem("adminData");

    if (savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
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
            className="mb-2 flex w-full items-center gap-5 rounded-2xl bg-[#286d67] px-5 py-4 text-left text-[15px] font-semibold text-white shadow-lg"
          >
            <span className="flex w-6 justify-center">
              <AdminIcon name="feedback" size={19} />
            </span>
            Feedback
          </button>

          <button
            onClick={() => goTo("admin/settings")}
            className="mb-2 flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium text-[#d4e1df] transition hover:bg-[#194743]"
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
        <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-[#e6ecee] bg-white/95 px-5 backdrop-blur md:px-8">

          <div className="relative w-full max-w-[570px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#607078]">
              <AdminIcon name="search" size={18} />
            </span>

            <input
              type="text"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#dfe7e9] bg-[#f6f8fa] pl-12 pr-4 text-sm outline-none transition focus:border-[#58a99b] focus:bg-white"
            />
          </div>

          <div className="ml-5 flex items-center gap-5">

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
              Feedback
            </h1>

            <p className="mt-2 text-[16px] text-[#66727d]">
              Review feedback submitted by DermaCare AI users.
            </p>
          </div>

          {/* STATS */}
          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-[#d9eee6] bg-[#ecfaf5] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d0f1e4] text-[#188b65]">
                <AdminIcon name="feedback" size={21} />
              </div>

              <p className="mt-5 text-sm text-[#586870]">
                Total Feedback
              </p>

              <h2 className="mt-1 text-[30px] font-bold text-[#111b31]">
                —
              </h2>

              <p className="mt-1 text-xs text-[#718087]">
                Feedback data not connected yet
              </p>
            </div>

            <div className="rounded-2xl border border-[#dce9fa] bg-[#eff6ff] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dcecff] text-[#397fd1]">
                <AdminIcon name="feedback" size={21} />
              </div>

              <p className="mt-5 text-sm text-[#586870]">
                New Feedback
              </p>

              <h2 className="mt-1 text-[30px] font-bold text-[#111b31]">
                —
              </h2>

              <p className="mt-1 text-xs text-[#718087]">
                New feedback data not connected yet
              </p>
            </div>

            <div className="rounded-2xl border border-[#e8ddf7] bg-[#f6f0ff] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9ddfb] text-[#7751c5]">
                <AdminIcon name="feedback" size={21} />
              </div>

              <p className="mt-5 text-sm text-[#586870]">
                Reviewed
              </p>

              <h2 className="mt-1 text-[30px] font-bold text-[#111b31]">
                —
              </h2>

              <p className="mt-1 text-xs text-[#718087]">
                Review data not connected yet
              </p>
            </div>

          </div>

          {/* FEEDBACK TABLE */}
          <div className="overflow-hidden rounded-2xl border border-[#e1e8eb] bg-white shadow-[0_3px_15px_rgba(20,50,60,0.03)]">

            <div className="border-b border-[#edf0f1] px-6 py-5">
              <h2 className="text-lg font-bold text-[#182238]">
                User Feedback
              </h2>

              <p className="mt-1 text-sm text-[#7b878e]">
                Feedback records from users will appear here.
              </p>
            </div>

            <div className="p-16 text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eef7f4] text-[#176b52]">
                <AdminIcon name="feedback" size={34} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#182238]">
                No Feedback Yet
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#718087]">
                User feedback will appear here once the feedback
                system is connected to the backend.
              </p>

            </div>
          </div>

          {/* FOOTER */}
          <div className="py-8 text-center text-xs text-[#87939b]">
            © 2026 DermaCare AI. Admin Panel.
          </div>

        </main>
      </div>
    </div>
  );
}

export default AdminFeedback;