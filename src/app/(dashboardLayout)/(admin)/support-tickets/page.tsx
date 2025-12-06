/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import withAdminAuth from "@/hoc/withAdminAuth";
import { fetchAdminFeedback, replyToFeedback } from "@/services/Feedback";
import { FeedbackStatus, FeedbackType, TFeedback } from "@/types/feedback";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import { CheckCircle2, Megaphone, Reply, User2 } from "lucide-react";

type DraftState = {
  reply: string;
  status: FeedbackStatus;
};

const statusOptions: FeedbackStatus[] = ["open", "in-progress", "resolved"];
const typeLabels: Record<FeedbackType, string> = {
  complaint: "Complaint",
  suggestion: "Suggestion",
  question: "Question",
};

const statusTone = (status: FeedbackStatus) => {
  if (status === "resolved") return "bg-emerald-100 text-emerald-800";
  if (status === "in-progress") return "bg-blue-100 text-blue-800";
  return "bg-amber-100 text-amber-800";
};

const SupportTicketsPage = () => {
  const [feedback, setFeedback] = useState<TFeedback[]>([]);
  const [drafts, setDrafts] = useState<Record<string, DraftState>>({});
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<FeedbackType | "all">("all");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetchAdminFeedback();
    if (res?.success) {
      setFeedback(res.data || []);
      const draftMap: Record<string, DraftState> = {};
      (res.data || []).forEach((item: TFeedback) => {
        draftMap[item._id] = { reply: item.adminReply || "", status: item.status || "open" };
      });
      setDrafts(draftMap);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return feedback.filter((item) => {
      const statusOk = statusFilter === "all" || item.status === statusFilter;
      const typeOk = typeFilter === "all" || item.type === typeFilter;
      return statusOk && typeOk;
    });
  }, [feedback, statusFilter, typeFilter]);

  const handleReply = async (id: string) => {
    const draft = drafts[id];
    setSavingId(id);
    const res = await replyToFeedback(id, {
      adminReply: draft?.reply ?? "",
      status: draft?.status,
    });
    if (res?.success) {
      toast.success("Reply updated");
      setFeedback((prev) => prev.map((f) => (f._id === id ? res.data : f)));
      setDrafts((prev) => ({
        ...prev,
        [id]: { reply: res.data?.adminReply || "", status: res.data?.status || "open" },
      }));
    } else if (res?.unauthorized) {
      toast.error("Admin access required.");
    } else {
      toast.error(res?.message || "Failed to reply.");
    }
    setSavingId(null);
  };

  return (
    <div className="space-y-6">
      {loading ? <Loader /> : null}
      <div className="rounded-3xl bg-white/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Support</p>
            <h1 className="text-2xl font-bold text-gray-900">Customer feedback</h1>
            <p className="text-sm text-gray-600">
              Review complaints and suggestions, reply, and mark resolutions.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow">
            <Megaphone size={16} />
            {feedback.length} threads
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-gray-100">
          Status:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FeedbackStatus | "all")}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs"
          >
            <option value="all">All</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-gray-100">
          Type:
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as FeedbackType | "all")}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs"
          >
            <option value="all">All</option>
            {Object.entries(typeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/60 p-8 text-center text-sm text-gray-700">
            No feedback found for the selected filters.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item._id}
              className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm ring-1 ring-gray-50"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {item.subject} • {typeLabels[item.type] || item.type}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : "Just now"}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold ${statusTone(item.status)}`}
                >
                  {item.status}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                <User2 size={14} />
                <span className="font-semibold text-gray-800">
                  {item.user?.name || "Unknown user"}
                </span>
                {item.user?.email ? <span>• {item.user.email}</span> : null}
              </div>

              <p className="mt-2 text-sm text-gray-800">{item.message}</p>

              <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-gray-500">
                    Reply to customer
                  </label>
                  <textarea
                    value={drafts[item._id]?.reply || ""}
                    onChange={(e) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [item._id]: { reply: e.target.value, status: prev[item._id]?.status || item.status },
                      }))
                    }
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                    placeholder="Share an update or resolution"
                  />
                  {item.adminReply ? (
                    <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                      <CheckCircle2 size={14} />
                      Reply sent
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3">
                  <label className="text-xs font-semibold uppercase text-gray-500">
                    Status
                  </label>
                  <select
                    value={drafts[item._id]?.status || item.status}
                    onChange={(e) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [item._id]: { reply: prev[item._id]?.reply || "", status: e.target.value as FeedbackStatus },
                      }))
                    }
                    className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm focus:border-pink-400 focus:ring-pink-300"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleReply(item._id)}
                    disabled={savingId === item._id}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    <Reply size={16} />
                    {savingId === item._id ? "Saving..." : "Save reply"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default withAdminAuth(SupportTicketsPage);
