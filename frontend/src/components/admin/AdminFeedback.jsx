import { useState } from "react";
import AdminLayout, { AdminIcon } from "./AdminLayout";

function AdminFeedback() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AdminLayout
      activePage="Feedback"
      searchPlaceholder="Search feedback..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
    >
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-[38px] font-bold leading-tight tracking-[-1px] text-[#121b31]">
          Feedback
        </h1>

        <p className="mt-2 text-[16px] text-[#66727d]">
          Review feedback submitted by DermaCare AI users.
        </p>
      </div>

      {/* STATS */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-[#d9eee6] bg-[#ecfaf5] p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d0f1e4] text-[#188b65]">
            <AdminIcon name="feedback" size={21} />
          </div>
          <p className="mt-5 text-sm text-[#586870]">Total Feedback</p>
          <h2 className="mt-1 text-[30px] font-bold text-[#111b31]">—</h2>
          <p className="mt-1 text-xs text-[#718087]">
            Feedback data not connected yet
          </p>
        </div>

        <div className="rounded-2xl border border-[#dce9fa] bg-[#eff6ff] p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dcecff] text-[#397fd1]">
            <AdminIcon name="feedback" size={21} />
          </div>
          <p className="mt-5 text-sm text-[#586870]">New Feedback</p>
          <h2 className="mt-1 text-[30px] font-bold text-[#111b31]">—</h2>
          <p className="mt-1 text-xs text-[#718087]">
            New feedback data not connected yet
          </p>
        </div>

        <div className="rounded-2xl border border-[#e8ddf7] bg-[#f6f0ff] p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9ddfb] text-[#7751c5]">
            <AdminIcon name="feedback" size={21} />
          </div>
          <p className="mt-5 text-sm text-[#586870]">Reviewed</p>
          <h2 className="mt-1 text-[30px] font-bold text-[#111b31]">—</h2>
          <p className="mt-1 text-xs text-[#718087]">
            Review data not connected yet
          </p>
        </div>
      </div>

      {/* FEEDBACK LIST */}
      <div className="overflow-hidden rounded-2xl border border-[#e1e8eb] bg-white shadow-[0_3px_15px_rgba(20,50,60,0.03)]">
        <div className="border-b border-[#edf0f1] px-6 py-5">
          <h2 className="text-lg font-bold text-[#182238]">User Feedback</h2>

          <p className="mt-1 text-sm text-[#7b878e]">
            Feedback records from users will appear here.
          </p>
        </div>

        <div className="p-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eef7f4] text-[#176b52]">
            <AdminIcon name="feedback" size={34} />
          </div>

          <h3 className="mt-6 text-xl font-bold text-[#182238]">
            No Feedback Yet
          </h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#718087]">
            User feedback will appear here once the feedback system is
            connected to the backend.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminFeedback;