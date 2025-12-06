/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import withCustomerAuth from "@/hoc/withCustomerAuth";
import { fetchMyFeedback, submitFeedback } from "@/services/Feedback";
import { FeedbackStatus, FeedbackType, TFeedback } from "@/types/feedback";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import { CheckCircle2, MessageCircle, MessageSquare, Send, Sparkles } from "lucide-react";

const typeOptions: { value: FeedbackType; label: string }[] = [
  { value: "complaint", label: "Complaint" },
  { value: "suggestion", label: "Suggestion" },
  { value: "question", label: "Question" },
];

const statusTone = (status: FeedbackStatus) => {
  if (status === "resolved") return "bg-emerald-100 text-emerald-800";
  if (status === "in-progress") return "bg-blue-100 text-blue-800";
  return "bg-amber-100 text-amber-800";
};

const SupportPage = () => {
  const [feedback, setFeedback] = useState<TFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<{ type: FeedbackType; subject: string; message: string }>({
    type: "complaint",
    subject: "",
    message: "",
  });

  const load = async () => {
    setLoading(true);
    const res = await fetchMyFeedback();
    if (res?.success) {
      setFeedback(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
    if (!form.subject.trim() || !form.message.trim()) {
      toast.error("Please add a subject and message.");
      return;
    }
    setSubmitting(true);
    const res = await submitFeedback({
      type: form.type,
      subject: form.subject.trim(),
      message: form.message.trim(),
    });
    if (res?.unauthorized) {
      toast.error("Please log in to submit feedback.");
      setSubmitting(false);
      return;
    }
    if (res?.success) {
      toast.success("Thanks for sharing! We'll review it soon.");
      setFeedback((prev) => [res.data, ...prev]);
      setForm({ type: "complaint", subject: "", message: "" });
    } else {
      toast.error(res?.message || "Failed to send feedback.");
    }
    setSubmitting(false);
  };

  const openCount = useMemo(
    () => feedback.filter((f) => f.status !== "resolved").length,
    [feedback]
  );

  return (
    <div className="space-y-6">
      {loading ? <Loader /> : null}
      <div className="rounded-3xl bg-white/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Support</p>
            <h1 className="text-2xl font-bold text-gray-900">Complaints & suggestions</h1>
            <p className="text-sm text-gray-600">
              Tell us what's not working or share an idea. We'll respond with an update or fix.
            </p>
          </div>
          <div className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-sm">
            Open items: {openCount}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
                New message
              </p>
              <h2 className="text-xl font-bold text-gray-900">Submit feedback</h2>
            </div>
            <Sparkles className="text-pink-500" size={18} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-gray-500">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as FeedbackType }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-gray-500">Subject</label>
              <input
                value={form.subject}
                onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                placeholder="Tell us the topic"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-gray-500">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
              rows={5}
              className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
              placeholder="Describe the issue or share your idea"
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <Send size={16} />
              {submitting ? "Sending..." : "Send feedback"}
            </button>
          </div>
        </div>

        <div className="space-y-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
                Updates
              </p>
              <h2 className="text-xl font-bold text-gray-900">Your messages</h2>
              <p className="text-sm text-gray-600">See status and replies from the support team.</p>
            </div>
            <MessageCircle className="text-pink-500" size={18} />
          </div>

          {feedback.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/60 p-6 text-center text-sm text-gray-600">
              You haven't sent any feedback yet.
            </div>
          ) : (
            <div className="space-y-3">
              {feedback.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.subject} • {typeOptions.find((t) => t.value === item.type)?.label || item.type}
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
                  <p className="mt-2 text-sm text-gray-700">{item.message}</p>
                  {item.adminReply ? (
                    <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                      <div className="flex items-center gap-2 font-semibold">
                        <CheckCircle2 size={16} />
                        Reply from support
                      </div>
                      <p className="mt-1 text-emerald-900">{item.adminReply}</p>
                    </div>
                  ) : (
                    <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-gray-600 ring-1 ring-gray-200">
                      <MessageSquare size={14} />
                      Awaiting reply
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withCustomerAuth(SupportPage);
