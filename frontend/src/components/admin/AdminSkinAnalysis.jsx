import { useEffect, useMemo, useState } from "react";
import AdminLayout, {
  AdminIcon,
  getErrorMessage,
  redirectToLogin,
} from "./AdminLayout";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminSkinAnalysis() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        redirectToLogin();
        return;
      }

      const response = await fetch(`${API_BASE}/api/admin/skin-analysis`, {
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
        throw new Error(
          getErrorMessage(data, "Failed to fetch skin analyses")
        );
      }

      setAnalyses(data?.analyses || []);
    } catch (err) {
      console.error("Skin analysis error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const filteredAnalyses = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return analyses;

    return analyses.filter(
      (analysis) =>
        analysis.user?.name?.toLowerCase().includes(search) ||
        analysis.user?.email?.toLowerCase().includes(search) ||
        analysis.skinType?.toLowerCase().includes(search) ||
        analysis.analysisResult?.toLowerCase().includes(search)
    );
  }, [analyses, searchTerm]);

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <AdminLayout
      activePage="Skin Analysis"
      searchPlaceholder="Search skin analyses..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
    >
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h1 className="text-[38px] font-bold leading-tight tracking-[-1px] text-[#121b31]">
            Skin Analysis
          </h1>

          <p className="mt-2 text-[16px] text-[#66727d]">
            View skin analysis records submitted by users.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAnalyses}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#176b52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#125640] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <AdminIcon name="refresh" size={17} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-[#d9eee6] bg-[#ecfaf5] p-6">
          <p className="text-sm font-medium text-gray-500">Total Analyses</p>
          <h2 className="mt-3 text-3xl font-bold text-[#182238]">
            {analyses.length}
          </h2>
          <p className="mt-2 text-xs text-gray-500">All analysis records</p>
        </div>

        <div className="rounded-2xl border border-[#dce9fa] bg-[#eff6ff] p-6">
          <p className="text-sm font-medium text-gray-500">Latest Analysis</p>
          <h2 className="mt-3 text-xl font-bold text-[#182238]">
            {analyses.length > 0 ? formatDate(analyses[0].createdAt) : "No data yet"}
          </h2>
          <p className="mt-2 text-xs text-gray-500">Most recent record</p>
        </div>

        <div className="rounded-2xl border border-[#e8ddf7] bg-[#f6f0ff] p-6">
          <p className="text-sm font-medium text-gray-500">Status</p>
          <h2
            className={`mt-3 text-xl font-bold ${
              error ? "text-red-600" : "text-[#176b52]"
            }`}
          >
            {error ? "Error" : loading ? "Loading..." : "Connected"}
          </h2>
          <p className="mt-2 text-xs text-gray-500">Backend connection</p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center shadow-sm">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#176b52]" />
          <p className="text-sm text-gray-500">
            Loading skin analysis records...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <p className="font-medium text-red-500">{error}</p>

          <button
            type="button"
            onClick={fetchAnalyses}
            className="mt-4 rounded-lg bg-[#176b52] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && analyses.length === 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef7f4] text-[#176b52]">
            <AdminIcon name="analysis" size={27} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-[#182238]">
            No Skin Analysis Data Yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Skin analysis records will appear here when users complete an
            analysis.
          </p>
        </div>
      )}

      {/* No search results */}
      {!loading &&
        !error &&
        analyses.length > 0 &&
        filteredAnalyses.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <AdminIcon name="search" size={24} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-[#182238]">
              No matching analyses
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try a different search term.
            </p>
          </div>
        )}

      {/* Table */}
      {!loading && !error && filteredAnalyses.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-[#182238]">
              Recent Skin Analyses
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {filteredAnalyses.length} record
              {filteredAnalyses.length !== 1 ? "s" : ""} displayed
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#f8fafb]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Skin Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Analysis Result
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAnalyses.map((analysis) => (
                  <tr
                    key={analysis._id}
                    className="border-t border-gray-100 transition hover:bg-[#fbfdfc]"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {analysis.user?.name || "Unknown User"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {analysis.user?.email || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-green-50 px-3 py-1 text-sm capitalize text-green-700">
                        {analysis.skinType || "—"}
                      </span>
                    </td>

                    <td className="max-w-md px-6 py-4 text-sm text-gray-600">
                      {analysis.analysisResult || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(analysis.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminSkinAnalysis;