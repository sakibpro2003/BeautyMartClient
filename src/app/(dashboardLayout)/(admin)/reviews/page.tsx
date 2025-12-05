"use client";

import { useEffect, useState } from "react";
import withAdminAuth from "@/hoc/withAdminAuth";
import Loader from "@/components/Loader";
import {
  fetchAdminReviews,
  fetchReplyTemplates,
  fetchReviewSummary,
  updateReviewModeration,
} from "@/services/Reviews";
import { TReview } from "@/types/review";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  Filter,
  MessageSquare,
  Shield,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

type SummaryState = {
  total: number;
  pending: number;
  averageRating: number;
  sentiments: { positive: number; negative: number; neutral: number };
  topKeywords: { keyword: string; count: number }[];
};

const statusOptions = ["all", "pending", "approved", "rejected"];

const sentimentTone = (sentiment: string) => {
  if (sentiment === "positive") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (sentiment === "negative") return "bg-rose-50 text-rose-700 ring-rose-100";
  return "bg-amber-50 text-amber-700 ring-amber-100";
};

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<TReview[]>([]);
  const [summary, setSummary] = useState<SummaryState>({
    total: 0,
    pending: 0,
    averageRating: 0,
    sentiments: { positive: 0, negative: 0, neutral: 0 },
    topKeywords: [],
  });
  const [templates, setTemplates] = useState<string[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusDrafts, setStatusDrafts] = useState<Record<string, string>>({});
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [reviewsRes, summaryRes] = await Promise.all([
        fetchAdminReviews(filter),
        fetchReviewSummary(),
      ]);
      if (reviewsRes?.success) {
        setReviews(reviewsRes.data);
      }
      if (summaryRes?.success) {
        setSummary(summaryRes.data);
      }
      if (!templates.length) {
        const templateRes = await fetchReplyTemplates();
        if (templateRes?.success) setTemplates(templateRes.data);
      }
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    setStatusDrafts((prev) => {
      const next = { ...prev };
      reviews.forEach((r) => {
        if (!next[r._id]) next[r._id] = r.status;
      });
      return next;
    });
    setReplyDrafts((prev) => {
      const next = { ...prev };
      reviews.forEach((r) => {
        if (next[r._id] === undefined) next[r._id] = r.adminReply || "";
      });
      return next;
    });
  }, [reviews]);

  const handleModeration = async (id: string) => {
    setUpdatingId(id);
    try {
      const res = await updateReviewModeration(id, {
        status: statusDrafts[id],
        adminReply: replyDrafts[id],
      });
      if (res?.success) {
        toast.success("Review updated");
        setReviews((prev) => prev.map((r) => (r._id === id ? res.data : r)));
        const summaryRes = await fetchReviewSummary();
        if (summaryRes?.success) setSummary(summaryRes.data);
      } else {
        toast.error(res?.message || "Failed to update review");
      }
    } catch (error) {
      toast.error("Failed to update review");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-pink-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Admin</p>
            <h1 className="text-2xl font-bold text-gray-900">Reviews moderation</h1>
            <p className="text-sm text-gray-600">
              Approve, reply, and watch sentiment trends from verified buyers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm focus:border-pink-400 focus:outline-none"
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "all" ? "All statuses" : opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Total reviews</p>
              <p className="text-3xl font-bold text-gray-900">{summary.total}</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase text-amber-700">Pending moderation</p>
              <p className="text-3xl font-bold text-amber-800">{summary.pending}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase text-emerald-700">Average rating</p>
              <p className="text-3xl font-bold text-emerald-800">
                {summary.averageRating?.toFixed(1)}
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              <ThumbsUp size={18} />
              Positive: {summary.sentiments.positive}
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
              <Sparkles size={18} />
              Neutral: {summary.sentiments.neutral}
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              <ThumbsDown size={18} />
              Negative: {summary.sentiments.negative}
            </div>
          </div>
          {summary.topKeywords?.length ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Top keywords</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {summary.topKeywords.map((kw) => (
                  <span
                    key={kw.keyword}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-800 ring-1 ring-gray-200"
                  >
                    #{kw.keyword}
                    <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-bold text-white">
                      {kw.count}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-gray-900 via-black to-gray-800 p-5 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <Shield size={18} />
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-pink-200">Reply kit</p>
              <h3 className="text-lg font-bold">Templates</h3>
              <p className="text-sm text-gray-200">
                Quick responses to keep conversations on-brand.
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {templates.map((tpl, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white/5 p-3 text-sm text-gray-100 ring-1 ring-white/10"
              >
                {tpl}
              </div>
            ))}
            {!templates.length ? (
              <p className="text-sm text-gray-200">No templates configured.</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="rounded-3xl bg-white/90 p-10 text-center shadow-sm ring-1 ring-gray-100">
            <p className="text-lg font-semibold text-gray-800">No reviews found</p>
            <p className="text-sm text-gray-600 mt-2">New reviews will appear here.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-pink-700 ring-1 ring-pink-100">
                      <MessageSquare size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {review.user?.name || "Customer"} on {review.product?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${sentimentTone(review.sentiment)}`}
                    >
                      {review.sentiment}
                    </span>
                    <span className="text-xs font-semibold text-gray-700">
                      Rating: {review.rating}/5
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${
                        review.status === "approved"
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                          : review.status === "rejected"
                          ? "bg-rose-50 text-rose-700 ring-rose-100"
                          : "bg-amber-50 text-amber-700 ring-amber-100"
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>
                </div>
                {review.keywords?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {review.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-700"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <p className="mt-4 text-sm text-gray-800">{review.comment}</p>
              {review.adminReply ? (
                <div className="mt-3 rounded-2xl bg-pink-50 px-3 py-2 text-sm text-pink-800 ring-1 ring-pink-100">
                  Admin reply: {review.adminReply}
                </div>
              ) : null}

              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-gray-500">
                    Status
                  </label>
                  <select
                    value={statusDrafts[review._id] || review.status}
                    onChange={(e) =>
                      setStatusDrafts((prev) => ({ ...prev, [review._id]: e.target.value }))
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm focus:border-pink-400 focus:outline-none"
                  >
                    {statusOptions
                      .filter((s) => s !== "all")
                      .map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-gray-500">
                    Reply (optional)
                  </label>
                  <select
                    onChange={(e) =>
                      setReplyDrafts((prev) => ({
                        ...prev,
                        [review._id]: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm focus:border-pink-400 focus:outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Choose template
                    </option>
                    {templates.map((tpl, idx) => (
                      <option key={idx} value={tpl}>
                        {tpl.slice(0, 80)}
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={replyDrafts[review._id] ?? ""}
                    onChange={(e) =>
                      setReplyDrafts((prev) => ({
                        ...prev,
                        [review._id]: e.target.value,
                      }))
                    }
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-100"
                    placeholder="Add a short response"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => handleModeration(review._id)}
                    disabled={updatingId === review._id}
                    className="w-full rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {updatingId === review._id ? "Saving..." : "Save changes"}
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

export default withAdminAuth(ReviewsPage);
