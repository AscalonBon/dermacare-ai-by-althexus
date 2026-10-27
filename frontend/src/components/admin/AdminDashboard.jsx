import { useEffect, useState } from "react";
import AdminLayout, { AdminIcon } from "./AdminLayout";
import { getErrorMessage, redirectToLogin } from "./adminUtils";
import { API_BASE_URL } from "../../lib/api";

const API_BASE = API_BASE_URL;
const BASE = import.meta.env.BASE_URL;

const goTo = (route) => {
  window.location.href = `${BASE}${route}`;
};

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAnalyses: 0,
    activeUsers: 0,
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    const fetchDashboard = async () => {
      try {
        const [statsResponse, usersResponse] = await Promise.all([
          fetch(`${API_BASE}/api/admin/stats`, { headers }),
          fetch(`${API_BASE}/api/admin/users`, { headers }),
        ]);

        if (
          [statsResponse.status, usersResponse.status].some(
            (status) => status === 401 || status === 403
          )
        ) {
          redirectToLogin();
          return;
        }

        if (!statsResponse.ok) {
          const errorData = await statsResponse.json().catch(() => null);
          throw new Error(
            getErrorMessage(errorData, "Unable to load dashboard statistics.")
          );
        }

        const statsData = await statsResponse.json();
        const usersData = usersResponse.ok
          ? await usersResponse.json().catch(() => ({}))
          : {};
        const users = Array.isArray(usersData.users) ? usersData.users : [];

        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const computedActive = users.filter((user) => {
          if (user.isActive === false) return false;
          const last = user.lastActiveAt || user.updatedAt || user.createdAt;
          return last ? new Date(last).getTime() >= thirtyDaysAgo : false;
        }).length;

        setStats({
          totalUsers: statsData.totalUsers ?? users.length,
          totalAnalyses: statsData.totalAnalyses ?? 0,
          activeUsers: statsData.activeUsers ?? computedActive,
          recentUsers: statsData.recentUsers ?? users.slice(0, 5),
        });

        if (!usersResponse.ok) {
          setError("Some dashboard data could not be loaded.");
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message || "Unable to load the admin dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

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
    status: user.isActive === false ? "Inactive" : "Active",
  }));

  return (
    <AdminLayout
      activePage="Dashboard"
      searchPlaceholder="Search users, reports or analysis..."
    >
      {/* PAGE HEADER */}
      <div className="mb-7">
        <h2 className="text-[38px] font-bold leading-tight tracking-[-1px] text-[#121b31]">
          Admin Dashboard
        </h2>
        <p className="mt-1 text-[17px] text-[#66727d]">
          Welcome back! Here's an overview of DermaCare AI.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="self-start rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 sm:self-auto"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#dce7e5] border-t-[#287f72]" />
            <p className="font-semibold text-[#173a38]">
              Loading Admin Dashboard...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* STAT CARDS */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[#d9eee6] bg-[#ecfaf5] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d0f1e4] text-[#188b65]">
                <AdminIcon name="users" size={21} />
              </div>
              <p className="mt-5 text-sm text-[#586870]">Total Users</p>
              <h3 className="mt-1 text-[30px] font-bold text-[#111b31]">
                {stats.totalUsers}
              </h3>
              <p className="mt-1 text-xs text-[#718087]">
                Current registered users
              </p>
            </div>

            <div className="rounded-2xl border border-[#dce9fa] bg-[#eff6ff] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dcecff] text-[#397fd1]">
                <AdminIcon name="scan" size={21} />
              </div>
              <p className="mt-5 text-sm text-[#586870]">
                Total Skin Analyses
              </p>
              <h3 className="mt-1 text-[30px] font-bold text-[#111b31]">
                {stats.totalAnalyses}
              </h3>
              <p className="mt-1 text-xs text-[#718087]">
                Total skin analyses performed
              </p>
            </div>

            <div className="rounded-2xl border border-[#f4e4d1] bg-[#fff6eb] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffe7c6] text-[#dc8a23]">
                <AdminIcon name="users" size={21} />
              </div>
              <p className="mt-5 text-sm text-[#586870]">Active Users</p>
              <h3 className="mt-1 text-[30px] font-bold text-[#111b31]">
                {stats.activeUsers}
              </h3>
              <p className="mt-1 text-xs text-[#718087]">
                Active in the last 30 days
              </p>
            </div>

            <div className="rounded-2xl border border-[#e8ddf7] bg-[#f6f0ff] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9ddfb] text-[#7751c5]">
                <AdminIcon name="feedback" size={21} />
              </div>
              <p className="mt-5 text-sm text-[#586870]">Total Feedbacks</p>
              <h3 className="mt-1 text-[30px] font-bold text-[#111b31]">—</h3>
              <p className="mt-1 text-xs text-[#718087]">
                Feedback data not connected yet
              </p>
            </div>
          </div>

          {/* CHARTS */}
          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
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
                <button
                  type="button"
                  className="rounded-lg border border-[#dfe6e8] px-4 py-2 text-xs font-medium"
                >
                  Last 30 Days ⌄
                </button>
              </div>

              <div className="relative h-[255px]">
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[200, 150, 100, 50, 0].map((value) => (
                    <div key={value} className="flex items-center gap-3">
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
              </div>
            </div>

            <div className="rounded-2xl border border-[#e1e8eb] bg-white p-5 shadow-[0_3px_15px_rgba(20,50,60,0.03)]">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AdminIcon name="donut" size={20} />
                  <h3 className="text-lg font-bold text-[#182238]">
                    Skin Condition Distribution
                  </h3>
                </div>
                <button
                  type="button"
                  className="rounded-lg border border-[#dfe6e8] px-4 py-2 text-xs font-medium"
                >
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
            <div className="rounded-2xl border border-[#e1e8eb] bg-white p-5 shadow-[0_3px_15px_rgba(20,50,60,0.03)]">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AdminIcon name="tableUsers" size={20} />
                  <h3 className="text-lg font-bold text-[#182238]">
                    Recent Users
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => goTo("admin/users")}
                  className="text-sm font-semibold text-[#147bd1]"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[580px] text-sm">
                  <thead>
                    <tr className="bg-[#f4f6f7] text-left text-xs text-[#65727a]">
                      <th className="rounded-l-lg px-3 py-3 font-medium">
                        Name
                      </th>
                      <th className="px-3 py-3 font-medium">Email</th>
                      <th className="px-3 py-3 font-medium">Joined On</th>
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

            <div className="rounded-2xl border border-[#e1e8eb] bg-white p-5 shadow-[0_3px_15px_rgba(20,50,60,0.03)]">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AdminIcon name="scan" size={20} />
                  <h3 className="text-lg font-bold text-[#182238]">
                    Recent Skin Analysis
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => goTo("admin/skin-analysis")}
                  className="text-sm font-semibold text-[#147bd1]"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-sm">
                  <thead>
                    <tr className="bg-[#f4f6f7] text-left text-xs text-[#65727a]">
                      <th className="rounded-l-lg px-3 py-3 font-medium">
                        User
                      </th>
                      <th className="px-3 py-3 font-medium">Condition</th>
                      <th className="px-3 py-3 font-medium">Confidence</th>
                      <th className="px-3 py-3 font-medium">Date</th>
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
        </>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;