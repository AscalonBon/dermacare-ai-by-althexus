import { useEffect, useState } from "react";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = `${import.meta.env.BASE_URL}admin`;
        return;
      }

      const response = await fetch("http://localhost:5000/api/admin/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load users");
      }

      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (err) {
      console.error("Admin users error:", err);
      setError(err.message || "Something went wrong while loading users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const activeUsers = users.filter((user) => {
    if (!user.isActive || !user.lastActiveAt) return false;

    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    );

    return new Date(user.lastActiveAt) >= thirtyDaysAgo;
  }).length;

  return (
    <div className="min-h-screen bg-[#f5f8fc] p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#172033]">Users</h1>
            <p className="mt-1 text-sm text-[#718087]">
              View registered DermaCare AI users.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            className="rounded-lg bg-[#287f72] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#20695f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : "Refresh Users"}
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#dce7e5] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#718087]">Total Registered Users</p>
            <p className="mt-2 text-3xl font-bold text-[#172033]">
              {users.length}
            </p>
          </div>

          <div className="rounded-xl border border-[#dce7e5] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#718087]">Active Users</p>
            <p className="mt-2 text-3xl font-bold text-[#172033]">
              {activeUsers}
            </p>
            <p className="mt-1 text-xs text-[#718087]">
              Based on activity in the last 30 days
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#dce7e5] bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#dce7e5] border-t-[#287f72]" />
                <p className="text-sm font-medium text-[#718087]">
                  Loading users...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[280px] items-center justify-center p-6">
              <div className="max-w-lg rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <h2 className="font-semibold text-red-700">
                  Unable to load users
                </h2>
                <p className="mt-2 text-sm text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={fetchUsers}
                  className="mt-4 rounded-lg bg-[#287f72] px-4 py-2 text-sm font-semibold text-white"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex min-h-[280px] items-center justify-center p-6">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e5f2ef] text-[#287f72]">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="9" cy="7" r="4" />
                    <path
                      d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h2 className="mt-4 text-lg font-semibold text-[#172033]">
                  No users found
                </h2>

                <p className="mt-1 text-sm text-[#718087]">
                  Registered users will appear here when user profiles are
                  created.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-[#e8eeee] bg-[#f8fbfa]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#718087]">
                      User
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#718087]">
                      Age
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#718087]">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#718087]">
                      Skin Type
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#718087]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#718087]">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#edf1f1]">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="transition hover:bg-[#f8fbfa]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dcefeb] font-bold text-[#287f72]">
                            {user.name
                              ? user.name.charAt(0).toUpperCase()
                              : "U"}
                          </div>

                          <div>
                            <p className="font-semibold text-[#172033]">
                              {user.name || "Unknown User"}
                            </p>
                            <p className="text-sm text-[#718087]">
                              {user.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-[#172033]">
                        {user.age ?? "—"}
                      </td>

                      <td className="px-6 py-4 text-sm capitalize text-[#172033]">
                        {user.gender || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm capitalize text-[#172033]">
                        {user.skinType || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.isActive
                              ? "bg-[#e3f6ed] text-[#16805a]"
                              : "bg-[#f1f3f4] text-[#718087]"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-[#718087]">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
