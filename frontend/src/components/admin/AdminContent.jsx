import { useEffect, useMemo, useState } from "react";
import AdminLayout, {
  AdminIcon,
  getErrorMessage,
  redirectToLogin,
} from "./AdminLayout";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const EMPTY_FORM = {
  title: "",
  category: "",
  description: "",
  content: "",
  status: "draft",
};

function AdminContent() {
  const [contents, setContents] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const getToken = () => localStorage.getItem("adminToken");

  // Shared request helper: adds the token, handles expired sessions and errors.
  const apiRequest = async (path, options = {}) => {
    const token = getToken();

    if (!token) {
      redirectToLogin();
      throw new Error("Please log in again.");
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json().catch(() => null);

    if (response.status === 401 || response.status === 403) {
      redirectToLogin();
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      throw new Error(getErrorMessage(data, "Request failed."));
    }

    return data;
  };

  const fetchContents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/api/admin/content");
      setContents(data?.contents || data?.content || data?.items || []);
    } catch (err) {
      console.error("Fetch content error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setEditingContent(null);
    setForm(EMPTY_FORM);
    setMessage("");
    setError("");
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingContent(item);

    setForm({
      title: item.title || "",
      category: item.category || "",
      description: item.description || "",
      content: item.content || "",
      status: item.status || "draft",
    });

    setMessage("");
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingContent(null);
    setError("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveContent = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }

    try {
      setSaving(true);

      const path = editingContent
        ? `/api/admin/content/${editingContent._id}`
        : "/api/admin/content";

      await apiRequest(path, {
        method: editingContent ? "PUT" : "POST",
        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category.trim(),
          description: form.description,
          content: form.content,
          status: form.status,
        }),
      });

      setShowModal(false);
      setEditingContent(null);

      setMessage(
        editingContent
          ? "Content updated successfully."
          : "Content created successfully."
      );

      await fetchContents();
    } catch (err) {
      console.error("Save content error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteContent = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this content?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await apiRequest(`/api/admin/content/${id}`, { method: "DELETE" });

      setMessage("Content deleted successfully.");
      await fetchContents();
    } catch (err) {
      console.error("Delete content error:", err);
      setError(err.message);
    }
  };

  const changeStatus = async (item) => {
    const newStatus = item.status === "published" ? "draft" : "published";

    try {
      setError("");
      setMessage("");

      await apiRequest(`/api/admin/content/${item._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      setMessage(
        newStatus === "published"
          ? "Content published successfully."
          : "Content moved to draft."
      );

      await fetchContents();
    } catch (err) {
      console.error("Status update error:", err);
      setError(err.message);
    }
  };

  const filteredContents = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return contents;

    return contents.filter(
      (item) =>
        item.title?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.status?.toLowerCase().includes(search)
    );
  }, [contents, searchTerm]);

  const totalContent = contents.length;
  const publishedCount = contents.filter(
    (item) => item.status === "published"
  ).length;
  const draftCount = contents.filter((item) => item.status === "draft").length;

  return (
    <AdminLayout
      activePage="Manage Content"
      searchPlaceholder="Search content..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
    >
      {/* HEADER */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h1 className="text-[38px] font-bold leading-tight tracking-[-1px] text-[#121b31]">
            Manage Content
          </h1>

          <p className="mt-2 text-[16px] text-[#66727d]">
            Manage and organize the content used across DermaCare AI.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#176b52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#125640]"
        >
          <AdminIcon name="plus" size={17} />
          Add Content
        </button>
      </div>

      {/* MESSAGES */}
      {message && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {message}
        </div>
      )}

      {error && !showModal && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* OVERVIEW */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-[#d9eee6] bg-[#ecfaf5] p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d0f1e4] text-[#188b65]">
            <AdminIcon name="content" size={21} />
          </div>
          <p className="mt-5 text-sm text-[#586870]">Content Items</p>
          <h2 className="mt-1 text-[30px] font-bold text-[#111b31]">
            {totalContent}
          </h2>
          <p className="mt-1 text-xs text-[#718087]">Total content records</p>
        </div>

        <div className="rounded-2xl border border-[#dce9fa] bg-[#eff6ff] p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dcecff] text-[#397fd1]">
            <AdminIcon name="edit" size={21} />
          </div>
          <p className="mt-5 text-sm text-[#586870]">Published</p>
          <h2 className="mt-1 text-[30px] font-bold text-[#111b31]">
            {publishedCount}
          </h2>
          <p className="mt-1 text-xs text-[#718087]">Published content</p>
        </div>

        <div className="rounded-2xl border border-[#e8ddf7] bg-[#f6f0ff] p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9ddfb] text-[#7751c5]">
            <AdminIcon name="content" size={21} />
          </div>
          <p className="mt-5 text-sm text-[#586870]">Drafts</p>
          <h2 className="mt-1 text-[30px] font-bold text-[#111b31]">
            {draftCount}
          </h2>
          <p className="mt-1 text-xs text-[#718087]">Draft content</p>
        </div>
      </div>

      {/* CONTENT LIBRARY */}
      <div className="rounded-2xl border border-[#e1e8eb] bg-white shadow-[0_3px_15px_rgba(20,50,60,0.03)]">
        <div className="flex flex-col justify-between gap-3 border-b border-[#edf0f1] px-6 py-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-bold text-[#182238]">
              Content Library
            </h2>
            <p className="mt-1 text-sm text-[#7b878e]">
              Manage website and application content.
            </p>
          </div>

          <div className="text-sm text-[#68767d]">
            Showing{" "}
            <span className="font-semibold text-[#182238]">
              {filteredContents.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#182238]">
              {contents.length}
            </span>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="py-16 text-center text-sm text-[#718087]">
              Loading content...
            </div>
          ) : filteredContents.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eef7f4] text-[#176b52]">
                <AdminIcon name="content" size={34} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#182238]">
                {searchTerm ? "No content found" : "No content yet"}
              </h3>

              <p className="mt-2 text-sm text-[#718087]">
                {searchTerm
                  ? "Try a different search term."
                  : "Create your first content item to get started."}
              </p>

              {!searchTerm && (
                <button
                  type="button"
                  onClick={openAddModal}
                  className="mt-5 rounded-xl bg-[#176b52] px-5 py-3 text-sm font-semibold text-white hover:bg-[#125640]"
                >
                  Add Content
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {filteredContents.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-[#e3e9eb] bg-white p-5 transition hover:border-[#cbdad7] hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="break-words text-lg font-bold text-[#182238]">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#176b52]">
                        {item.category}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#69767d]">
                    {item.description ||
                      item.content ||
                      "No description available."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-[#edf0f1] pt-4">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#dce4e6] px-3 py-2 text-xs font-semibold text-[#34434b] hover:bg-[#f6f8f9]"
                    >
                      <AdminIcon name="edit" size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => changeStatus(item)}
                      className="rounded-lg border border-[#dce4e6] px-3 py-2 text-xs font-semibold text-[#176b52] hover:bg-[#eef7f4]"
                    >
                      {item.status === "published"
                        ? "Move to Draft"
                        : "Publish"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteContent(item._id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <AdminIcon name="trash" size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e7ecee] px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-[#182238]">
                  {editingContent ? "Edit Content" : "Add Content"}
                </h2>

                <p className="mt-1 text-sm text-[#718087]">
                  {editingContent
                    ? "Update this content item."
                    : "Create a new content item."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#66747b] hover:bg-[#f1f4f5]"
                aria-label="Close"
              >
                <AdminIcon name="close" size={19} />
              </button>
            </div>

            <form onSubmit={saveContent} className="px-6 py-6">
              {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#182238]">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    placeholder="Enter content title"
                    className="w-full rounded-lg border border-[#d9e1e4] px-4 py-3 text-sm outline-none focus:border-[#2878e8] focus:ring-2 focus:ring-[#2878e8]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#182238]">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    placeholder="e.g. Skincare"
                    className="w-full rounded-lg border border-[#d9e1e4] px-4 py-3 text-sm outline-none focus:border-[#2878e8] focus:ring-2 focus:ring-[#2878e8]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#182238]">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-[#d9e1e4] bg-white px-4 py-3 text-sm outline-none focus:border-[#2878e8] focus:ring-2 focus:ring-[#2878e8]/10"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#182238]">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    placeholder="Enter a short description"
                    rows={3}
                    className="w-full resize-none rounded-lg border border-[#d9e1e4] px-4 py-3 text-sm outline-none focus:border-[#2878e8] focus:ring-2 focus:ring-[#2878e8]/10"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#182238]">
                    Content
                  </label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleFormChange}
                    placeholder="Write your content here..."
                    rows={7}
                    className="w-full resize-none rounded-lg border border-[#d9e1e4] px-4 py-3 text-sm outline-none focus:border-[#2878e8] focus:ring-2 focus:ring-[#2878e8]/10"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-[#edf0f1] pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-[#d9e1e4] px-5 py-3 text-sm font-semibold text-[#526067] hover:bg-[#f6f8f9]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#176b52] px-6 py-3 text-sm font-semibold text-white hover:bg-[#125640] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingContent
                    ? "Update Content"
                    : "Create Content"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminContent;