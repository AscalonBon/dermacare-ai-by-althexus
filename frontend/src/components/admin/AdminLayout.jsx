import { useEffect, useMemo, useRef, useState } from "react";

const BASE = import.meta.env.BASE_URL;

// Backend errors can be { error: "text" } or { error: { code, message } }.
// This always returns a readable string (prevents "[object Object]").
export function getErrorMessage(data, fallback = "Something went wrong.") {
  if (!data) return fallback;
  if (typeof data.error === "string") return data.error;
  if (data.error && typeof data.error.message === "string") {
    return data.error.message;
  }
  if (typeof data.message === "string") return data.message;
  return fallback;
}

// Clears the admin session and goes to the login page.
export function redirectToLogin() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminData");
  window.location.href = `${BASE}admin`;
}

const MENU_ITEMS = [
  { name: "Dashboard", icon: "dashboard", route: "admin/dashboard" },
  { name: "Users", icon: "users", route: "admin/users" },
  { name: "Skin Analysis", icon: "analysis", route: "admin/skin-analysis" },
  { name: "Reports", icon: "reports", route: "admin/reports" },
  { name: "Manage Content", icon: "content", route: "admin/content" },
  { name: "Feedback", icon: "feedback", route: "admin/feedback" },
  { name: "Settings", icon: "settings", route: "admin/settings" },
];

export function AdminIcon({ name, size = 20, strokeWidth = 1.9 }) {
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
    refresh: (
      <>
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.5 9a9 9 0 0 1 14.5-3L23 10" />
        <path d="M20.5 15a9 9 0 0 1-14.5 3L1 14" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16" />
        <path d="M10 11v6M14 11v6" />
        <path d="M6 7l1 14h10l1-14" />
        <path d="M9 7V4h6v3" />
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
    menu: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </>
    ),
    close: (
      <>
        <path d="M6 6l12 12M18 6L6 18" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || paths.dashboard}</svg>;
}

function decodeJwtPayload(token) {
  const part = token.split(".")[1];
  const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
}

function getStoredAdmin(token) {
  try {
    const stored = JSON.parse(localStorage.getItem("adminData"));
    if (stored && typeof stored === "object") return stored;
  } catch {
    // ignore bad JSON
  }

  try {
    const payload = decodeJwtPayload(token);
    return { name: payload.name, email: payload.email };
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  try {
    const payload = decodeJwtPayload(token);
    return Boolean(payload.exp) && payload.exp * 1000 < Date.now();
  } catch {
    return false;
  }
}

function AdminLayout({
  children,
  activePage,
  showSearch = true,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
}) {
  const token = localStorage.getItem("adminToken");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const profileRef = useRef(null);

  const admin = useMemo(() => (token ? getStoredAdmin(token) : null), [token]);

  const displayName =
    admin?.name || (admin?.email ? admin.email.split("@")[0] : "Admin");
  const displayEmail = admin?.email || "";

  const goTo = (route) => {
    window.location.href = `${BASE}${route}`;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    goTo("admin");
  };

  const currentPage =
    activePage ||
    MENU_ITEMS.find((item) => window.location.pathname.includes(item.route))
      ?.name ||
    "Dashboard";

  const sessionInvalid = !token || isTokenExpired(token);

  useEffect(() => {
    if (sessionInvalid) logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionInvalid]);

  // Close the profile dropdown on outside click or Escape.
  useEffect(() => {
    const handleClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMobileNavOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  if (sessionInvalid) return null;

  const sidebarBody = (
    <>
      <div className="flex h-[96px] shrink-0 items-center px-7">
        <div className="flex h-[62px] w-[230px] items-center overflow-hidden rounded-xl bg-white px-2">
          <img
            src={`${BASE}logo.png`}
            alt="DermaCare AI"
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      <nav className="mt-3 flex-1 overflow-y-auto px-4">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => goTo(item.route)}
            className={`mb-2 flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium transition ${
              currentPage === item.name
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
      </nav>

      <div className="shrink-0 border-t border-[#31504e] px-4 py-3">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium text-white transition hover:bg-[#194743]"
        >
          <span className="flex w-6 items-center justify-center">
            <AdminIcon name="logout" size={19} />
          </span>
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f7fafb] text-[#172033]">
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[285px] flex-col bg-[#102f2e] text-white lg:flex">
        {sidebarBody}
      </aside>

      {/* MOBILE SIDEBAR */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[285px] flex-col bg-[#102f2e] text-white shadow-xl">
            {sidebarBody}
          </aside>
        </div>
      )}

      <div className="lg:ml-[285px]">
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-[#e6ecee] bg-white/95 px-5 backdrop-blur md:px-8">
          <div className="flex w-full max-w-[570px] items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="text-[#172033] lg:hidden"
              aria-label="Open navigation menu"
            >
              <AdminIcon name="menu" size={24} />
            </button>

            {showSearch && (
              <div className="relative w-full">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#607078]">
                  <AdminIcon name="search" size={18} />
                </span>

                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  {...(onSearchChange
                    ? {
                        value: searchValue ?? "",
                        onChange: (event) => onSearchChange(event.target.value),
                      }
                    : {})}
                  className="h-11 w-full rounded-xl border border-[#dfe7e9] bg-[#f6f8fa] pl-12 pr-4 text-sm outline-none transition focus:border-[#58a99b] focus:bg-white"
                />
              </div>
            )}
          </div>

          <div className="ml-5 flex items-center gap-5">
            <button
              type="button"
              className="relative hidden text-[#172033] sm:block"
              aria-label="Notifications"
            >
              <AdminIcon name="bell" size={20} />
            </button>

            <div className="hidden h-9 w-px bg-[#e1e7e9] sm:block" />

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-gray-50"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                aria-label="Admin profile menu"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8e8f4] text-[#25304a]">
                  <AdminIcon name="profile" size={21} />
                </div>

                <div className="hidden text-left md:block">
                  <p className="text-sm font-bold text-[#172033]">
                    {displayName}
                  </p>
                  <p className="text-xs text-[#69767e]">Administrator</p>
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
                <div
                  role="menu"
                  className="absolute right-0 top-14 z-50 w-64 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
                >
                  <div className="px-3 py-3">
                    <p className="text-sm font-bold text-[#172033]">
                      {displayName}
                    </p>
                    {displayEmail && (
                      <p className="mt-1 text-xs text-[#69767e]">
                        {displayEmail}
                      </p>
                    )}
                  </div>

                  <div className="my-1 border-t border-gray-100" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setProfileOpen(false);
                      goTo("admin/settings");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#25304a] transition hover:bg-gray-50"
                  >
                    <AdminIcon name="settings" size={18} />
                    <span>Settings</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={logout}
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

        {/* PAGE CONTENT */}
        <main className="px-5 py-7 md:px-8">
          {children}

          <div className="py-8 text-center text-xs text-[#87939b]">
            © 2026 DermaCare AI. Admin Panel.
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;