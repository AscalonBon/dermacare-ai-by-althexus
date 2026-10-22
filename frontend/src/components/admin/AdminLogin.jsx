import { useState } from "react";
import logo from "../../assets/admin-logo.png";

const API_BASE = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000" : "")
).replace(/\/$/, "");

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Admin login form submitted");
    setError("");
    setLoading(true);

    try {
      if (!API_BASE) {
        throw new Error("The API URL is not configured. Set VITE_API_URL for the frontend.");
      }

      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const responseText = await response.text();
      console.log("Login HTTP status:", response.status);
      console.log("Login response body:", responseText);

      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(
          "Backend returned an invalid response. Check the backend terminal."
        );
      }

      if (!response.ok) {
        throw new Error(typeof data.error === "string" ? data.error : data.error?.message || "Invalid email or password");
      }

      if (!data.token || !data.admin) {
        throw new Error(
          "Login response is missing the admin token or admin details."
        );
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminData", JSON.stringify(data.admin));

      window.location.assign(
        `${import.meta.env.BASE_URL}admin/dashboard`
      );
    } catch (err) {
      console.error("Admin login error:", err);

      setError(
        err instanceof TypeError
          ? "Backend se connection nahi ho raha. Check karo ki server port 5000 par running hai."
          : err.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8fc] flex items-center justify-center px-5 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_15px_40px_rgba(35,77,130,0.10)] border border-[#e4eaf2]">
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="DermaCare AI"
            className="w-[320px] h-auto object-contain"
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#10245c]">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-[#68758d]">
            Sign in to access the DermaCare AI admin dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="admin-email"
              className="block mb-2 text-sm font-semibold text-[#182440]"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              autoComplete="username"
              required
              className="w-full rounded-lg border border-[#d9e1ec] px-4 py-3 outline-none transition focus:border-[#2878e8] focus:ring-2 focus:ring-[#2878e8]/10"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block mb-2 text-sm font-semibold text-[#182440]"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-[#d9e1ec] px-4 py-3 outline-none transition focus:border-[#2878e8] focus:ring-2 focus:ring-[#2878e8]/10"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 break-words"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#123a91] py-3 font-semibold text-white transition hover:bg-[#0b2c78] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#8995aa]">
          DermaCare AI • Admin Portal
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
