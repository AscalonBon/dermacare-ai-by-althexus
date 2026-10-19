import { useEffect, useState } from "react";
import AdminLayout, {
  AdminIcon,
  getErrorMessage,
  redirectToLogin,
} from "./AdminLayout";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminSettings() {
  const [admin, setAdmin] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const applyAdmin = (adminData) => {
    setAdmin(adminData);
    setName(adminData?.name || "");
    setEmail(adminData?.email || "");
  };

  // Load the profile: show saved data instantly, then refresh from the server.
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      redirectToLogin();
      return;
    }

    try {
      const savedAdmin = JSON.parse(localStorage.getItem("adminData"));
      if (savedAdmin) applyAdmin(savedAdmin);
    } catch {
      // ignore bad JSON
    }

    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401 || response.status === 403) {
          redirectToLogin();
          return;
        }

        if (!response.ok) return;

        const data = await response.json();
        if (data?.admin) {
          applyAdmin(data.admin);
          localStorage.setItem("adminData", JSON.stringify(data.admin));
        }
      } catch (err) {
        console.error("Load profile error:", err);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      redirectToLogin();
      return;
    }

    if (password.trim() && password.trim().length < 8) {
      setError("Password must be at least 8 characters.");
      setTimeout(() => setError(""), 3500);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/admin/profile`, {
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

      const data = await response.json().catch(() => null);

      if (response.status === 401 || response.status === 403) {
        redirectToLogin();
        return;
      }

      if (!response.ok) {
        throw new Error(getErrorMessage(data, "Failed to update profile"));
      }

      applyAdmin(data.admin);
      setPassword("");
      localStorage.setItem("adminData", JSON.stringify(data.admin));
      setSaved(true);

      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setTimeout(() => setError(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout activePage="Settings" showSearch={false}>
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
              className="h-12 w-full rounded-xl border border-[#dfe7e9] bg-[#f8fafb] px-4 text-sm text-[#45525b] outline-none focus:border-[#176b52]"
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
              className="h-12 w-full rounded-xl border border-[#dfe7e9] bg-[#f8fafb] px-4 text-sm text-[#45525b] outline-none focus:border-[#176b52]"
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
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#176b52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#125640] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <AdminIcon name="save" size={17} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* SECURITY */}
      <div className="mb-6 rounded-2xl border border-[#e1e8eb] bg-white shadow-[0_3px_15px_rgba(20,50,60,0.03)]">
        <div className="border-b border-[#edf0f1] px-6 py-5">
          <div className="flex items-center gap-3">
            <AdminIcon name="shield" size={21} />

            <div>
              <h2 className="text-lg font-bold text-[#182238]">Security</h2>

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
                  Set a new password (at least 8 characters).
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
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
              <h2 className="text-lg font-bold text-[#182238]">Session</h2>

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
            type="button"
            onClick={redirectToLogin}
            className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </div>

      {/* TOASTS */}
      {error && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 shadow-lg">
          {error}
        </div>
      )}

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-[#176b52] px-5 py-3 text-sm font-semibold text-white shadow-lg">
          Settings saved successfully.
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminSettings;