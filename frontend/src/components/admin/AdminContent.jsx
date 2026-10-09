import { useEffect, useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:5000";

function AdminIcon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),

    users: (
      <>
        <path d="M16 21v-1.8a4.2 4.2 0 0 0-4.2-4.2H7.2A4.2 4.2 0 0 0 3 19.2V21" />
        <circle cx="9.5" cy="7.5" r="3.5" />
        <path d="M16 3.8a3.5 3.5 0 0 1 0 6.8" />
        <path d="M21 21v-1.8a4.2 4.2 0 0 0-3-4" />
      </>
    ),

    analysis: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M7 16l3-3 2 2 5-6" />
        <path d="M7 7h3" />
      </>
    ),

    reports: (
      <>
        <path d="M6 2.8h9l4 4V21H6z" />
        <path d="M15 2.8V7h4" />
        <path d="M9 11h6M9 15h6M9 19h4" />
      </>
    ),

    content: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <path d="M7 8h10M7 12h10M7 16h6" />
      </>
    ),

    feedback: (
      <>
        <path d="M20.5 11.5c0 4.1-3.8 7.5-8.5 7.5-1 0-2-.2-2.9-.5L4 20l1.4-3.9C4.5 14.9 4 13.2 4 11.5 4 7.4 7.8 4 12.5 4s8 3.4 8 7.5Z" />
        <path d="M8.5 11.5h.01M12.5 11.5h.01M16.5 11.5h.01" />
      </>
    ),

    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-2.6v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6v-2.6h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.6v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2v2.6h-.2a1.7 1.7 0 0 0-1.5 1Z" />
      </>
    ),

    logout: (
      <>
        <path d="M10 5H5.5A1.5 1.5 0 0 0 4 6.5v11A1.5 1.5 0 0 0 5.5 19H10" />
        <path d="M14 8l4 4-4 4M8 12h10" />
      </>
    ),

    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.3" />
        <path d="m16 16 4.2 4.2" />
      </>
    ),

    bell: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
        <path d="M10 21h4" />
      </>
    ),

    profile: (
      <>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
      </>
    ),

    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),

    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),

    trash: (
      <>
        <path d="M4 7h16" />
        <path d="M10 11v6M14 11v6" />
        <path d="M6 7l1 14h10l1-14" />
        <path d="M9 7V4h6v3" />
      </>
    ),

    close: (
      <>
        <path d="M6 6l12 12M18 6L6 18" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}

function AdminContent() {
  const [admin, setAdmin] = useState(null);
  const [contents, setContents] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    content: "",
    status: "draft",
  });

  useEffect(() => {
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

    fetchContents();
  }, []);

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  const fetchContents = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/admin/content`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load content.");
      }

      setContents(data.contents || []);
    } catch (err) {
      console.error("Fetch content error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goTo = (path) => {
    window.location.href = `${import.meta.env.BASE_URL}${path}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");

    window.location.href = `${import.meta.env.BASE_URL}admin`;
  };

  const openAddModal = () => {
    setEditingContent(null);

    setForm({
      title: "",
      category: "",
      description: "",
      content: "",
      status: "draft",
    });

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
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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

      const token = getToken();

      const url = editingContent
        ? `${API_URL}/api/admin/content/${editingContent._id}`
        : `${API_URL}/api/admin/content`;

      const method = editingContent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category.trim(),
          description: form.description,
          content: form.content,
          status: form.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save content."
        );
      }

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

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/admin/content/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete content."
        );
      }

      setMessage("Content deleted successfully.");

      await fetchContents();
    } catch (err) {
      console.error("Delete content error:", err);
      setError(err.message);
    }
  };

  const changeStatus = async (item) => {
    const newStatus =
      item.status === "published"
        ? "draft"
        : "published";

    try {
      setError("");
      setMessage("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/admin/content/${item._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update status."
        );
      }

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

    return contents.filter((item) => {
      return (
        item.title?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.status?.toLowerCase().includes(search)
      );
    });
  }, [contents, searchTerm]);

  const totalContent = contents.length;

  const publishedCount = contents.filter(
    (item) => item.status === "published"
  ).length;

  const draftCount = contents.filter(
    (item) => item.status === "draft"
  ).length;

  return (
    <div className="min-h-screen bg-[#f7fafb] text-[#172033]">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[285px] overflow-hidden bg-[#102f2e] text-white lg:block">

        <div className="flex h-[96px] items-center px-7">
          <div className="flex h-[62px] w-[230px] items-center overflow-hidden rounded-xl bg-white px-2">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="DermaCare AI"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <nav className="mt-5 px-4">

          <button
            onClick={() => goTo("admin/dashboard")}
            className="mb-2 flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium text-[#d4e1df] transition hover:bg-[#194743]"
          >
            <span className="flex w-6 justify-center">
              <AdminIcon name="dashboard" size={19} />
            </span>
            Dashboard
          </button>

          <button
            onClick={() => goTo("admin/users")}
            className="mb-2 flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium text-[#d4e1df] transition hover:bg-[#194743]"
          >
            <span className="flex w-6 justify-center">
              <AdminIcon name="users" size={19} />
            </span>
            Users
          </button>

          <button
            onClick={() => goTo("admin/skin-analysis")}
            className="mb-2 flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium text-[#d4e1df] transition hover:bg-[#194743]"
          >
            <span className="flex w-6 justify-center">
              <AdminIcon name="analysis" size={19} />
            </span>
            Skin Analysis
          </button>

          <button
            onClick={() => goTo("admin/reports")}
            className="mb-2 flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium text-[#d4e1df] transition hover:bg-[#194743]"
          >
            <span className="flex w-6 justify-center">
              <AdminIcon name="reports" size={19} />
            </span>
            Reports
          </button>

          <button
            className="mb-2 flex w-full items-center gap-5 rounded-2xl bg-[#286d67] px-5 py-4 text-left text-[15px] font-semibold text-white shadow-lg"
          >
            <span className="flex w-6 justify-center">
              <AdminIcon name="content" size={19} />
            </span>
            Manage Content
          </button>

          <button
            onClick={() => goTo("admin/feedback")}
            className="mb-2 flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium text-[#d4e1df] transition hover:bg-[#194743]"
          >
            <span className="flex w-6 justify-center">
              <AdminIcon name="feedback" size={19} />
            </span>
            Feedback
          </button>

          <button
            onClick={() => goTo("admin/settings")}
            className="mb-2 flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium text-[#d4e1df] transition hover:bg-[#194743]"
          >
            <span className="flex w-6 justify-center">
              <AdminIcon name="settings" size={19} />
            </span>
            Settings
          </button>

          <div className="my-5 border-t border-[#31504e]" />

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left text-[15px] font-medium text-white transition hover:bg-[#194743]"
          >
            <span className="flex w-6 justify-center">
              <AdminIcon name="logout" size={19} />
            </span>
            Logout
          </button>

        </nav>
      </aside>

      {/* MAIN */}
      <div className="lg:ml-[285px]">

        {/* TOP BAR */}
        <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-[#e6ecee] bg-white/95 px-5 backdrop-blur md:px-8">

          <div className="relative w-full max-w-[570px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#607078]">
              <AdminIcon name="search" size={18} />
            </span>

            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#dfe7e9] bg-[#f6f8fa] pl-12 pr-4 text-sm outline-none transition focus:border-[#58a99b] focus:bg-white"
            />
          </div>

          <div className="ml-5 flex items-center gap-5">

            <button
              className="relative hidden text-[#172033] sm:block"
              aria-label="Notifications"
            >
              <AdminIcon name="bell" size={20} />
            </button>

            <div className="hidden h-9 w-px bg-[#e1e7e9] sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8e8f4] text-[#25304a]">
                <AdminIcon name="profile" size={21} />
              </div>

              <div className="hidden md:block">
                <p className="text-sm font-bold text-[#172033]">
                  {admin?.name || "Admin"}
                </p>

                <p className="text-xs text-[#69767e]">
                  Administrator
                </p>
              </div>

              <span className="text-lg">⌄</span>
            </div>

          </div>
        </header>

        {/* CONTENT */}
        <main className="px-5 py-7 md:px-8">

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

              <p className="mt-5 text-sm text-[#586870]">
                Content Items
              </p>

              <h2 className="mt-1 text-[30px] font-bold text-[#111b31]">
                {totalContent}
              </h2>

              <p className="mt-1 text-xs text-[#718087]">
                Total content records
              </p>
            </div>

            <div className="rounded-2xl border border-[#dce9fa] bg-[#eff6ff] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dcecff] text-[#397fd1]">
                <AdminIcon name="edit" size={21} />
              </div>

              <p className="mt-5 text-sm text-[#586870]">
                Published
              </p>

              <h2 className="mt-1 text-[30px] font-bold text-[#111b31]">
                {publishedCount}
              </h2>

              <p className="mt-1 text-xs text-[#718087]">
                Published content
              </p>
            </div>

            <div className="rounded-2xl border border-[#e8ddf7] bg-[#f6f0ff] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9ddfb] text-[#7751c5]">
                <AdminIcon name="content" size={21} />
              </div>

              <p className="mt-5 text-sm text-[#586870]">
                Drafts
              </p>

              <h2 className="mt-1 text-[30px] font-bold text-[#111b31]">
                {draftCount}
              </h2>

              <p className="mt-1 text-xs text-[#718087]">
                Draft content
              </p>
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
                    {searchTerm
                      ? "No content found"
                      : "No content yet"}
                  </h3>

                  <p className="mt-2 text-sm text-[#718087]">
                    {searchTerm
                      ? "Try a different search term."
                      : "Create your first content item to get started."}
                  </p>

                  {!searchTerm && (
                    <button
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
                          {item.status === "published"
                            ? "Published"
                            : "Draft"}
                        </span>

                      </div>

                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#69767d]">
                        {item.description ||
                          item.content ||
                          "No description available."}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2 border-t border-[#edf0f1] pt-4">

                        <button
                          onClick={() =>
                            openEditModal(item)
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-[#dce4e6] px-3 py-2 text-xs font-semibold text-[#34434b] hover:bg-[#f6f8f9]"
                        >
                          <AdminIcon name="edit" size={14} />
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            changeStatus(item)
                          }
                          className="rounded-lg border border-[#dce4e6] px-3 py-2 text-xs font-semibold text-[#176b52] hover:bg-[#eef7f4]"
                        >
                          {item.status === "published"
                            ? "Move to Draft"
                            : "Publish"}
                        </button>

                        <button
                          onClick={() =>
                            deleteContent(item._id)
                          }
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

          <div className="py-8 text-center text-xs text-[#87939b]">
            © 2026 DermaCare AI. Admin Panel.
          </div>

        </main>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-[#e7ecee] px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-[#182238]">
                  {editingContent
                    ? "Edit Content"
                    : "Add Content"}
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
              >
                <AdminIcon name="close" size={19} />
              </button>

            </div>

            {/* MODAL FORM */}
            <form
              onSubmit={saveContent}
              className="px-6 py-6"
            >

              {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">

                {/* TITLE */}
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

                {/* CATEGORY */}
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

                {/* STATUS */}
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
                    <option value="draft">
                      Draft
                    </option>

                    <option value="published">
                      Published
                    </option>
                  </select>
                </div>

                {/* DESCRIPTION */}
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

                {/* CONTENT */}
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

              {/* BUTTONS */}
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

    </div>
  );
}

export default AdminContent;