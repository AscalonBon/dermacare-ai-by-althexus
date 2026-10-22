import { useEffect, useMemo, useState } from "react";
import AdminLayout, {
  AdminIcon,
  getErrorMessage,
  redirectToLogin,
} from "./AdminLayout";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminReports() {
  const [reports, setReports] = useState([]);
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
        redirectToLogin();
        return;
      }

      const response = await fetch(`${API_BASE}/api/admin/reports`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (response.status === 401 || response.status === 403) {
        redirectToLogin();
        return;
      }

      if (!response.ok) {
        throw new Error(getErrorMessage(data, "Failed to fetch reports"));
      }

      setReports(data?.reports || []);
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
    const search = searchTerm.toLowerCase().trim();

    return reports.filter((report) => {
      const matchesSearch =
        !search ||
        report.title?.toLowerCase().includes(search) ||
        report.summary?.toLowerCase().includes(search) ||
        report.user?.name?.toLowerCase().includes(search) ||
        report.user?.email?.toLowerCase().includes(search) ||
        report.skinAnalysis?.skinType?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, searchTerm, statusFilter]);

  const generatedCount = reports.filter(
    (report) => report.status === "generated"
  ).length;

  const reviewedCount = reports.filter(
    (report) => report.status === "reviewed"
  ).length;

  return (
    <AdminLayout
      activePage="Reports"
      searchPlaceholder="Search reports, users or analysis..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
    >
      {/* Page Heading */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h1 className="text-[38px] font-bold leading-tight tracking-[-1px] text-[#121b31]">
            Reports
          </h1>

          <p className="mt-2 text-[16px] text-[#66727d]">
            Manage and review skin analysis reports generated for users.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReports}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#176b52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#125640] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <AdminIcon name="refresh" size={17} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-[#dce9e5] bg-[#eefaf6] p-6">
          <p className="text-sm font-medium text-gray-500">Total Reports</p>
          <h2 className="mt-3 text-3xl font-bold text-[#182238]">
            {reports.length}
          </h2>
          <p className="mt-2 text-xs text-gray-500">All generated reports</p>
        </div>

        <div className="rounded-2xl border border-[#dce5f4] bg-[#f0f6ff] p-6">
          <p className="text-sm font-medium text-gray-500">Generated</p>
          <h2 className="mt-3 text-3xl font-bold text-[#176b52]">
            {generatedCount}
          </h2>
          <p className="mt-2 text-xs text-gray-500">Reports awaiting review</p>
        </div>

        <div className="rounded-2xl border border-[#e2ddf0] bg-[#f7f2ff] p-6">
          <p className="text-sm font-medium text-gray-500">Reviewed</p>
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
            <p className="text-sm text-gray-500">Loading reports...</p>
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

            <p className="mt-2 text-sm text-red-500">{error}</p>

            <button
              type="button"
              onClick={fetchReports}
              className="mt-5 rounded-lg bg-[#176b52] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && reports.length === 0 && (
          <div className="p-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef7f4] text-[#176b52]">
              <AdminIcon name="reports" size={27} />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-[#182238]">
              No Reports Yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Generated skin analysis reports will appear here once reports are
              created in the system.
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
                <AdminIcon name="search" size={24} />
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
        {!loading && !error && filteredReports.length > 0 && (
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
                    <td className="px-6 py-5">
                      <p className="font-semibold text-gray-800">
                        {report.user?.name || "Unknown User"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {report.user?.email || "No email"}
                      </p>
                    </td>

                    <td className="max-w-[300px] px-6 py-5">
                      <p className="font-medium text-gray-800">
                        {report.title || "Untitled Report"}
                      </p>
                      <p className="mt-1 truncate text-sm text-gray-500">
                        {report.summary || "No summary available"}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium capitalize text-green-700">
                        {report.skinAnalysis?.skinType || "—"}
                      </span>
                    </td>

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

                    <td className="px-6 py-5 text-sm text-gray-500">
                      {report.createdAt
                        ? new Date(report.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          alert("Report details view will be connected next.")
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#176b52] hover:text-[#176b52]"
                      >
                        <AdminIcon name="eye" size={15} />
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
    </AdminLayout>
  );
}

export default AdminReports;