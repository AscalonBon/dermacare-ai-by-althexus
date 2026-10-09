import { useEffect, useMemo, useState } from "react";

function AdminIcon({ type, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    dashboard: (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),

    users: (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),

    analysis: (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 15l2-2 2 2 4-5" />
        <path d="M8 8h.01" />
      </svg>
    ),

    reports: (
      <svg {...common}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    ),

    content: (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="7" y1="8" x2="17" y2="8" />
        <line x1="7" y1="12" x2="17" y2="12" />
        <line x1="7" y1="16" x2="13" y2="16" />
      </svg>
    ),

    feedback: (
      <svg {...common}>
        <path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 8.5 8.5 0 0 1-4-.98L3 21l1.98-4.02A8.5 8.5 0 1 1 21 11.5z" />
        <line x1="8" y1="11" x2="8.01" y2="11" />
        <line x1="12" y1="11" x2="12.01" y2="11" />
        <line x1="16" y1="11" x2="16.01" y2="11" />
      </svg>
    ),

    settings: (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-1.42 1.42-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21h-2v-.08a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06-1.42-1.42.06-.06A1.65 1.65 0 0 0 9.6 15a1.65 1.65 0 0 0-1.51-1H8v-2h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06 1.42-1.42.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 .99-1.51V6h2v.08a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06 1.42 1.42-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51.99H21v2h-.08A1.65 1.65 0 0 0 19.4 15z" />
      </svg>
    ),

    search: (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
    ),

    bell: (
      <svg {...common}>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),

    logout: (
      <svg {...common}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),

    eye: (
      <svg {...common}>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),

    refresh: (
      <svg {...common}>
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.5 9a9 9 0 0 1 14.5-3L23 10" />
        <path d="M20.5 15a9 9 0 0 1-14.5 3L1 14" />
      </svg>
    ),
  };

  return icons[type] || null;
}

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

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

      const response = await fetch(
        "http://localhost:5000/api/admin/reports",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch reports");
      }

      setReports(data.reports || []);
    } catch (err) {
      console.error("Reports error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        !search ||
        report.title?.toLowerCase().includes(search) ||
        report.summary?.toLowerCase().includes(search) ||
        report.user?.name?.toLowerCase().includes(search) ||
        report.user?.email?.toLowerCase().includes(search) ||
        report.skinAnalysis?.skinType?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, searchTerm, statusFilter]);

  const generatedCount = reports.filter(
    (report) => report.status === "generated"
  ).length;

  const reviewedCount = reports.filter(
    (report) => report.status === "reviewed"
  ).length;

  const goTo = (path) => {
    window.location.href = `${import.meta.env.BASE_URL}${path}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");

    window.location.href = `${import.meta.env.BASE_URL}admin`;
  };

  return (
    <div className="min-h-screen bg-[#f5f8fc] text-[#182238]">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[285px] bg-[#0c3935] text-white lg:block">

        {/* Logo */}
        <div className="flex h-[185px] items-center justify-center px-7">
          <div className="flex h-[82px] w-full items-center justify-center overflow-hidden rounded-xl bg-white">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="DermaCare AI"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4">

          <button
            onClick={() => goTo("admin/dashboard")}
            className="mb-2 flex w-full items-center gap-4 rounded-2xl px-6 py-4 text-left text-[15px] font-medium text-white/85 transition hover:bg-white/10"
          >
            <AdminIcon type="dashboard" />
            Dashboard
          </button>

          <button
            onClick={() => goTo("admin/users")}
            className="mb-2 flex w-full items-center gap-4 rounded-2xl px-6 py-4 text-left text-[15px] font-medium text-white/85 transition hover:bg-white/10"
          >
            <AdminIcon type="users" />
            Users
          </button>

          <button
            onClick={() => goTo("admin/skin-analysis")}
            className="mb-2 flex w-full items-center gap-4 rounded-2xl px-6 py-4 text-left text-[15px] font-medium text-white/85 transition hover:bg-white/10"
          >
            <AdminIcon type="analysis" />
            Skin Analysis
          </button>

          <button
            className="mb-2 flex w-full items-center gap-4 rounded-2xl bg-[#2b8177] px-6 py-4 text-left text-[15px] font-semibold text-white shadow-sm"
          >
            <AdminIcon type="reports" />
            Reports
          </button>

          <button
            onClick={() => goTo("admin/content")}
            className="mb-2 flex w-full items-center gap-4 rounded-2xl px-6 py-4 text-left text-[15px] font-medium text-white/85 transition hover:bg-white/10"
          >
            <AdminIcon type="content" />
            Manage Content
          </button>

          <button
            onClick={() => goTo("admin/feedback")}
            className="mb-2 flex w-full items-center gap-4 rounded-2xl px-6 py-4 text-left text-[15px] font-medium text-white/85 transition hover:bg-white/10"
          >
            <AdminIcon type="feedback" />
            Feedback
          </button>

          <button
            onClick={() => goTo("admin/settings")}
            className="mb-2 flex w-full items-center gap-4 rounded-2xl px-6 py-4 text-left text-[15px] font-medium text-white/85 transition hover:bg-white/10"
          >
            <AdminIcon type="settings" />
            Settings
          </button>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 w-full px-4 pb-5">
          <div className="mb-5 h-px bg-white/15" />

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-2xl px-6 py-4 text-left text-[15px] font-medium text-white/90 transition hover:bg-white/10"
          >
            <AdminIcon type="logout" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-[285px]">

        {/* Top Bar */}
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-gray-200 bg-white px-6 md:px-8">

          <div className="relative w-full max-w-[570px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <AdminIcon type="search" size={19} />
            </span>

            <input
              type="text"
              placeholder="Search reports, users or analysis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 w-full rounded-xl border border-gray-200 bg-[#f6f9fb] pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#2b8177] focus:ring-2 focus:ring-[#2b8177]/10"
            />
          </div>

          <div className="ml-6 flex items-center gap-5">

            <button
              className="relative text-[#182238] hover:text-[#176b52]"
              title="Notifications"
            >
              <AdminIcon type="bell" size={21} />
            </button>

            <div className="h-8 w-px bg-gray-200" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9edf8] text-[#182238]">
                <span className="text-sm font-semibold">
                  {admin?.name
                    ? admin.name.charAt(0).toUpperCase()
                    : "A"}
                </span>
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-[#182238]">
                  {admin?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="px-6 py-8 md:px-8">

          {/* Page Heading */}
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#182238]">
                Reports
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage and review skin analysis reports generated for users.
              </p>
            </div>

            <button
              onClick={fetchReports}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#176b52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#125640] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <AdminIcon type="refresh" size={17} />
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-[#dce9e5] bg-[#eefaf6] p-6">
              <p className="text-sm font-medium text-gray-500">
                Total Reports
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#182238]">
                {reports.length}
              </h2>

              <p className="mt-2 text-xs text-gray-500">
                All generated reports
              </p>
            </div>

            <div className="rounded-2xl border border-[#dce5f4] bg-[#f0f6ff] p-6">
              <p className="text-sm font-medium text-gray-500">
                Generated
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#176b52]">
                {generatedCount}
              </h2>

              <p className="mt-2 text-xs text-gray-500">
                Reports awaiting review
              </p>
            </div>

            <div className="rounded-2xl border border-[#e2ddf0] bg-[#f7f2ff] p-6">
              <p className="text-sm font-medium text-gray-500">
                Reviewed
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#397fd1]">
                {reviewedCount}
              </h2>

              <p className="mt-2 text-xs text-gray-500">
                Reports reviewed by admin
              </p>
            </div>
          </div>

          {/* Reports Section */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

            {/* Table Header */}
            <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-6 py-5 md:flex-row md:items-center">

              <div>
                <h2 className="text-lg font-semibold text-[#182238]">
                  All Reports
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {filteredReports.length} report
                  {filteredReports.length !== 1 ? "s" : ""} displayed
                </p>
              </div>

              <div className="flex items-center gap-3">

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-[#176b52]"
                >
                  <option value="all">All Status</option>
                  <option value="generated">Generated</option>
                  <option value="reviewed">Reviewed</option>
                </select>

              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="p-16 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#176b52]" />

                <p className="text-sm text-gray-500">
                  Loading reports...
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="p-16 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                  !
                </div>

                <h3 className="mt-4 text-lg font-semibold text-[#182238]">
                  Unable to load reports
                </h3>

                <p className="mt-2 text-sm text-red-500">
                  {error}
                </p>

                <button
                  onClick={fetchReports}
                  className="mt-5 rounded-lg bg-[#176b52] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading &&
              !error &&
              reports.length === 0 && (
                <div className="p-16 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef7f4] text-[#176b52]">
                    <AdminIcon type="reports" size={27} />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-[#182238]">
                    No Reports Yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    Generated skin analysis reports will appear here once
                    reports are created in the system.
                  </p>
                </div>
              )}

            {/* No Search Results */}
            {!loading &&
              !error &&
              reports.length > 0 &&
              filteredReports.length === 0 && (
                <div className="p-16 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <AdminIcon type="search" size={24} />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-[#182238]">
                    No matching reports
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Try changing your search or status filter.
                  </p>
                </div>
              )}

            {/* Table */}
            {!loading &&
              !error &&
              filteredReports.length > 0 && (
                <div className="overflow-x-auto">

                  <table className="w-full min-w-[1050px]">

                    <thead className="bg-[#f8fafb]">
                      <tr>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          User
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Report
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Skin Type
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Status
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Date
                        </th>

                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Action
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {filteredReports.map((report) => (
                        <tr
                          key={report._id}
                          className="border-t border-gray-100 transition hover:bg-[#fbfdfc]"
                        >

                          {/* User */}
                          <td className="px-6 py-5">
                            <div>
                              <p className="font-semibold text-gray-800">
                                {report.user?.name || "Unknown User"}
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                {report.user?.email || "No email"}
                              </p>
                            </div>
                          </td>

                          {/* Report */}
                          <td className="max-w-[300px] px-6 py-5">
                            <p className="font-medium text-gray-800">
                              {report.title || "Untitled Report"}
                            </p>

                            <p className="mt-1 truncate text-sm text-gray-500">
                              {report.summary || "No summary available"}
                            </p>
                          </td>

                          {/* Skin Type */}
                          <td className="px-6 py-5">
                            <span className="inline-flex rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium capitalize text-green-700">
                              {report.skinAnalysis?.skinType || "—"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                                report.status === "reviewed"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-green-50 text-green-700"
                              }`}
                            >
                              {report.status || "generated"}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-5 text-sm text-gray-500">
                            {report.createdAt
                              ? new Date(
                                  report.createdAt
                                ).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </td>

                          {/* Action */}
                          <td className="px-6 py-5 text-right">
                            <button
                              onClick={() =>
                                alert(
                                  "Report details view will be connected next."
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#176b52] hover:text-[#176b52]"
                            >
                              <AdminIcon type="eye" size={15} />
                              View
                            </button>
                          </td>

                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>
              )}

          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminReports;