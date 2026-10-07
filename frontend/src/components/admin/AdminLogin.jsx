import { useState } from "react";
import logo from "../../assets/admin-logo.png";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          "Backend response is not valid. Please make sure the backend is running on port 5000."
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "Invalid email or password");
      }

      if (!data.token || !data.admin) {
        throw new Error("Invalid login response from server.");
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem(
        "adminData",
        JSON.stringify(data.admin)
      );

      window.location.href =
        `${import.meta.env.BASE_URL}admin/dashboard`;

    } catch (error) {
      console.error("Admin login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8fc] flex items-center justify-center px-5">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_15px_40px_rgba(35,77,130,0.10)] border border-[#e4eaf2]">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="DermaCare AI"
            className="w-[320px] h-auto object-contain"
          />
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#10245c]">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-[#68758d]">
            Sign in to access the DermaCare AI admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#182440]">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
              className="w-full rounded-lg border border-[#d9e1ec] px-4 py-3 outline-none transition focus:border-[#2878e8] focus:ring-2 focus:ring-[#2878e8]/10"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#182440]">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full rounded-lg border border-[#d9e1ec] px-4 py-3 outline-none transition focus:border-[#2878e8] focus:ring-2 focus:ring-[#2878e8]/10"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Button */}
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