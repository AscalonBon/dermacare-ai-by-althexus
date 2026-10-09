import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE = import.meta.env.BASE_URL;

const MENU_ROUTES = {
  Dashboard: "admin/dashboard",
  Users: "admin/users",
  "Skin Analysis": "admin/skin-analysis",
  Reports: "admin/reports",
  "Manage Content": "admin/content",
  Feedback: "admin/feedback",
  Settings: "admin/settings",
};

function AdminIcon({ name, size = 20, strokeWidth = 1.9 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const paths = {
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

    chart: (
      <>
        <path d="M4 19V5M4 19h16" />
        <path d="m7 15 3-4 3 2 5-6" />
      </>
    ),

    donut: (
      <>
        <path d="M12 3a9 9 0 1 0 9 9h-9z" />
        <path d="M12 3v9h9" />
      </>
    ),

    tableUsers: (
      <>
        <circle cx="9" cy="8" r="2.5" />
        <path d="M4.5 18a4.5 4.5 0 0 1 9 0" />
        <path d="M16 7.5a2.2 2.2 0 0 1 0 4.4M17 15a3.5 3.5 0 0 1 3 3" />
      </>
    ),

    scan: (
      <>
        <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || paths.dashboard}</svg>;
}

function AdminDashboard() {
  const [admin, setAdmin] = useState(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAnalyses: 0,
    activeUsers: 0,
    recentUsers: [],
  });

  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [profileOpen, setProfileOpen] = useState(false);

  const goTo = (route) => {
    window.location.href = `${BASE}${route}`;
  };

  const clearSessionAndExit = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    goTo("admin");
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      goTo("admin");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const response = await fetch(`${API_BASE}/api/admin/dashboard`, {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          clearSessionAndExit();
          return;
        }

        const data = await response.json();
        setAdmin(data.admin);

        const statsResponse = await fetch(`${API_BASE}/api/admin/stats`, {
          method: "GET",
          headers,
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats((prev) => ({ ...prev, ...statsData }));
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    clearSessionAndExit();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f8fc]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#dce7e5] border-t-[#287f72]" />
          <p className="font-semibold text-[#173a38]">
            Loading Admin Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: "Dashboard", icon: "dashboard" },
    { name: "Users", icon: "users" },
    { name: "Skin Analysis", icon: "analysis" },
    { name: "Reports", icon: "reports" },
    { name: "Manage Content", icon: "content" },
    { name: "Feedback", icon: "feedback" },
    { name: "Settings", icon: "settings" },
  ];

  const recentUsers = (stats.recentUsers || []).map((user, index) => ({
    key: user._id || user.id || user.email || index,
    initial: user.name ? user.name.charAt(0).toUpperCase() : "U",
    name: user.name || "Unknown User",
    email: user.email || "No email",
    date: user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—",
    status: user.isActive ? "Active" : "Inactive",
  }));

  return (
    <div className="min-h-screen bg-[#f7fafb] text-[#172033]">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[285px] overflow-hidden bg-[#102f2e] text-white lg:block">

        {/* Brand */}
        <div className="flex h-[96px] items-center gap-3 px-7">
          <div className="flex h-[62px] w-[230px] items-center overflow-hidden rounded-xl bg-white px-2">
            <img
              src={`${BASE}logo.png`}
              alt="DermaCare AI"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-5 px-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                const route = MENU_ROUTES[item.name];

                if (route) {
                  goTo(route);
                  return;
                }

                setActiveMenu(item.name);
              }}
              className={`mb-2 flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium transition ${
                activeMenu === item.name
                  ? "bg-[#286d67] text-white shadow-lg"
                  : "text-[#d4e1df] hover:bg-[#194743]"
              }`}
            >
              <span className="flex w-6 items-center justify-center text-[#d4e1df]">
                <AdminIcon name={item.icon} size={19} />
              </span>

              {item.name}
            </button>
          ))}

          <div className="my-5 border-t border-[#31504e]" />

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium text-white transition hover:bg-[#194743]"
          >
            <span className="flex w-6 items-center justify-center">
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

          {/* Search */}
          <div className="relative w-full max-w-[570px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#607078]">
              <AdminIcon name="search" size={18} />
            </span>

            <input
              type="text"
              placeholder="Search users, reports or analysis..."
              className="h-11 w-full rounded-xl border border-[#dfe7e9] bg-[#f6f8fa] pl-12 pr-4 text-sm outline-none transition focus:border-[#58a99b] focus:bg-white"
            />
          </div>

          {/* Right */}
          <div className="ml-5 flex items-center gap-5">

            <button
              className="relative hidden text-[#172033] sm:block"
              aria-label="Notifications"
            >
              <AdminIcon name="bell" size={20} />
            </button>

            <div className="hidden h-9 w-px bg-[#e1e7e9] sm:block" />

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-gray-50"
                aria-expanded={profileOpen}
                aria-label="Admin profile menu"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8e8f4] text-[#25304a]">
                  <AdminIcon name="profile" size={21} />
                </div>

                <div className="hidden text-left md:block">
                  <p className="text-sm font-bold text-[#172033]">
                    {admin?.name || "Admin"}
                  </p>

                  <p className="text-xs text-[#69767e]">
                    Administrator
                  </p>
                </div>

                <span
                  className={`text-lg transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                >
                  ⌄
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 z-50 w-64 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                  <div className="px-3 py-3">
                    <p className="text-sm font-bold text-[#172033]">
                      {admin?.name || "Admin"}
                    </p>

                    <p className="mt-1 text-xs text-[#69767e]">
                      {admin?.email || "admin@email.com"}
                    </p>
                  </div>

                  <div className="my-1 border-t border-gray-100" />

                  <button
                    type="button"
                    onClick={() => goTo("admin/settings")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#25304a] transition hover:bg-gray-50"
                  >
                    <AdminIcon name="settings" size={18} />
                    <span>Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <AdminIcon name="logout" size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="px-5 py-7 md:px-8">

          {/* PAGE HEADER */}
          <div className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <h2 className="text-[38px] font-bold leading-tight tracking-[-1px] text-[#121b31]">
                Admin Dashboard
              </h2>

              <p className="mt-1 text-[17px] text-[#66727d]">
                Welcome back! Here's an overview of DermaCare AI.
              </p>
            </div>

            <div />
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {/* Users */}
            <div className="rounded-2xl border border-[#d9eee6] bg-[#ecfaf5] p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d0f1e4] text-[#188b65]">
                  <AdminIcon name="users" size={21} />
                </div>
              </div>

              <p className="mt-5 text-sm text-[#586870]">
                Total Users
              </p>

              <div className="mt-1 flex items-end gap-3">
                <h3 className="text-[30px] font-bold text-[#111b31]">
                  {stats.totalUsers}
                </h3>
              </div>

              <p className="mt-1 text-xs text-[#718087]">
                Current registered users
              </p>
            </div>

            {/* Analysis */}
            <div className="rounded-2xl border border-[#dce9fa] bg-[#eff6ff] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dcecff] text-[#397fd1]">
                <AdminIcon name="scan" size={21} />
              </div>

              <p className="mt-5 text-sm text-[#586870]">
                Total Skin Analyses
              </p>

              <div className="mt-1 flex items-end gap-3">
                <h3 className="text-[30px] font-bold text-[#111b31]">
                  {stats.totalAnalyses}
                </h3>
              </div>

              <p className="mt-1 text-xs text-[#718087]">
                Total skin analyses performed
              </p>
            </div>

            {/* Active */}
            <div className="rounded-2xl border border-[#f4e4d1] bg-[#fff6eb] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffe7c6] text-[#dc8a23]">
                <AdminIcon name="users" size={21} />
              </div>

              <p className="mt-5 text-sm text-[#586870]">
                Active Users
              </p>

              <div className="mt-1 flex items-end gap-3">
                <h3 className="text-[30px] font-bold text-[#111b31]">
                  {stats.activeUsers}
                </h3>
              </div>

              <p className="mt-1 text-xs text-[#718087]">
                Active in the last 30 days
              </p>
            </div>

            {/* Feedback */}
            <div className="rounded-2xl border border-[#e8ddf7] bg-[#f6f0ff] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9ddfb] text-[#7751c5]">
                <AdminIcon name="feedback" size={21} />
              </div>

              <p className="mt-5 text-sm text-[#586870]">
                Total Feedbacks
              </p>

              <div className="mt-1 flex items-end gap-3">
                <h3 className="text-[30px] font-bold text-[#111b31]">
                  —
                </h3>
              </div>

              <p className="mt-1 text-xs text-[#718087]">
                Feedback data not connected yet
              </p>
            </div>
          </div>

          {/* CHARTS */}
          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">

            {/* User Growth */}
            <div className="rounded-2xl border border-[#e1e8eb] bg-white p-5 shadow-[0_3px_15px_rgba(20,50,60,0.03)]">

              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[#152238]">
                    <AdminIcon name="chart" size={20} />
                  </span>

                  <h3 className="text-lg font-bold text-[#182238]">
                    User Growth
                  </h3>
                </div>

                <button className="rounded-lg border border-[#dfe6e8] px-4 py-2 text-xs font-medium">
                  Last 30 Days ⌄
                </button>
              </div>

              <div className="relative h-[255px]">

                <div className="absolute inset-0 flex flex-col justify-between">
                  {[200, 150, 100, 50, 0].map((value) => (
                    <div
                      key={value}
                      className="flex items-center gap-3"
                    >
                      <span className="w-7 text-[11px] text-[#87939b]">
                        {value}
                      </span>

                      <div className="h-px flex-1 bg-[#edf1f2]" />
                    </div>
                  ))}
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-[#87939b]">
                    User growth data will appear here as activity is recorded.
                  </p>
                </div>

                <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[11px] text-[#87939b]">
                  <span>Aug 24</span>
                  <span>Aug 29</span>
                  <span>Sep 3</span>
                  <span>Sep 8</span>
                  <span>Sep 13</span>
                  <span>Sep 18</span>
                  <span>Sep 23</span>
                </div>
              </div>
            </div>

            {/* Skin Distribution */}
            <div className="rounded-2xl border border-[#e1e8eb] bg-white p-5 shadow-[0_3px_15px_rgba(20,50,60,0.03)]">

              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AdminIcon name="donut" size={20} />

                  <h3 className="text-lg font-bold text-[#182238]">
                    Skin Condition Distribution
                  </h3>
                </div>

                <button className="rounded-lg border border-[#dfe6e8] px-4 py-2 text-xs font-medium">
                  Last 30 Days ⌄
                </button>
              </div>

              <div className="flex min-h-[255px] items-center justify-center">
                <p className="text-sm text-[#87939b]">
                  Skin analysis distribution data is not connected yet.
                </p>
              </div>
            </div>
          </div>

          {/* TABLES */}
          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">

            {/* Recent Users */}
            <div className="rounded-2xl border border-[#e1e8eb] bg-white p-5 shadow-[0_3px_15px_rgba(20,50,60,0.03)]">

              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AdminIcon name="tableUsers" size={20} />

                  <h3 className="text-lg font-bold text-[#182238]">
                    Recent Users
                  </h3>
                </div>

                <button
                  onClick={() => goTo("admin/users")}
                  className="text-sm font-semibold text-[#147bd1]"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[580px] text-sm">
                  <thead>
                    <tr className="rounded-lg bg-[#f4f6f7] text-left text-xs text-[#65727a]">
                      <th className="rounded-l-lg px-3 py-3 font-medium">
                        Name
                      </th>

                      <th className="px-3 py-3 font-medium">
                        Email
                      </th>

                      <th className="px-3 py-3 font-medium">
                        Joined On
                      </th>

                      <th className="rounded-r-lg px-3 py-3 font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-8 text-center text-sm text-[#87939b]"
                        >
                          No users registered yet.
                        </td>
                      </tr>
                    ) : (
                      recentUsers.map((user) => (
                        <tr
                          key={user.key}
                          className="border-b border-[#edf0f1] last:border-0"
                        >
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf0f2] font-semibold text-[#43515b]">
                                {user.initial}
                              </span>

                              <span className="font-medium text-[#26333c]">
                                {user.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-3 py-3 text-[#69767e]">
                            {user.email}
                          </td>

                          <td className="px-3 py-3 text-[#69767e]">
                            {user.date}
                          </td>

                          <td className="px-3 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                user.status === "Active"
                                  ? "bg-[#dcf7e9] text-[#16865e]"
                                  : "bg-[#ffe5e5] text-[#dc5555]"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Analysis */}
            <div className="rounded-2xl border border-[#e1e8eb] bg-white p-5 shadow-[0_3px_15px_rgba(20,50,60,0.03)]">

              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AdminIcon name="scan" size={20} />

                  <h3 className="text-lg font-bold text-[#182238]">
                    Recent Skin Analysis
                  </h3>
                </div>

                <button
                  onClick={() => goTo("admin/skin-analysis")}
                  className="text-sm font-semibold text-[#147bd1]"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-sm">
                  <thead>
                    <tr className="rounded-lg bg-[#f4f6f7] text-left text-xs text-[#65727a]">
                      <th className="rounded-l-lg px-3 py-3 font-medium">
                        User
                      </th>

                      <th className="px-3 py-3 font-medium">
                        Condition
                      </th>

                      <th className="px-3 py-3 font-medium">
                        Confidence
                      </th>

                      <th className="px-3 py-3 font-medium">
                        Date
                      </th>

                      <th className="rounded-r-lg px-3 py-3 font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-8 text-center text-sm text-[#87939b]"
                      >
                        No skin analysis data available yet.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="py-8 text-center text-xs text-[#87939b]">
            © 2026 DermaCare AI. Admin Panel.
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;