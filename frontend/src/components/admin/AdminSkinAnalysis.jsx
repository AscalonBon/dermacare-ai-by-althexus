import { useEffect, useState } from "react";

function AdminSkinAnalysis() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = `${import.meta.env.BASE_URL}admin`;
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/skin-analysis",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch skin analyses");
      }

      setAnalyses(data.analyses || []);
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

  return (
    <div className="min-h-screen bg-[#f5f8fc] p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Skin Analysis
            </h1>
            <p className="text-gray-500 mt-1">
              View skin analysis records submitted by users.
            </p>
          </div>

          <button
            onClick={fetchAnalyses}
            className="px-4 py-2 bg-[#176b52] text-white rounded-lg hover:bg-[#125640] transition"
          >
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Analyses</p>
            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {analyses.length}
            </h2>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Latest Analysis</p>
            <h2 className="text-lg font-semibold text-gray-800 mt-2">
              {analyses.length > 0
                ? new Date(analyses[0].createdAt).toLocaleDateString()
                : "No data yet"}
            </h2>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Status</p>
            <h2 className="text-lg font-semibold text-[#176b52] mt-2">
              Connected
            </h2>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm">
            <p className="text-gray-500">
              Loading skin analysis records...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <p className="text-red-500 font-medium">{error}</p>

            <button
              onClick={fetchAnalyses}
              className="mt-4 px-4 py-2 bg-[#176b52] text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && analyses.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <div className="text-5xl mb-4">⌕</div>

            <h2 className="text-xl font-semibold text-gray-800">
              No Skin Analysis Data Yet
            </h2>

            <p className="text-gray-500 mt-2">
              Skin analysis records will appear here when users complete
              an analysis.
            </p>
          </div>
        )}

        {/* Analysis Table */}
        {!loading && !error && analyses.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Skin Analyses
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      User
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Email
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Skin Type
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Analysis Result
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {analyses.map((analysis) => (
                    <tr
                      key={analysis._id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {analysis.user?.name || "Unknown User"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {analysis.user?.email || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm capitalize">
                          {analysis.skinType}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                        {analysis.analysisResult}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(
                          analysis.createdAt
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSkinAnalysis;