

"use client";

import { useEffect, useMemo, useState } from "react";
import { getOrders } from "@/services/Orders";
import withCustomerAuth from "@/hoc/withCustomerAuth";
import { TOrder } from "@/types/order";
import { TReview } from "@/types/review";
import Loader from "@/components/Loader";
import { CheckCircle2, Clock, MessageSquare, Package, Send, Star, XCircle } from "lucide-react";
import { fetchMyReviews, submitReview } from "@/services/Reviews";
import { toast } from "react-toastify";

const MyOrders = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState<TReview[]>([]);
  const [reviewModal, setReviewModal] = useState<{
    orderId: string;
    productId: string;
    productName: string;
  } | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pageSize = 3;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [ordersRes, reviewsRes] = await Promise.all([getOrders(), fetchMyReviews()]);
        if (ordersRes?.success) {
          setOrders(ordersRes.data);
          setPage(1);
        }
        if (reviewsRes?.success) {
          setReviews(reviewsRes.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totals = useMemo(() => {
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const active = orders.filter((o) => o.status !== "completed" && o.status !== "cancelled").length;
    const completed = orders.filter((o) => o.status === "completed").length;
    return { totalSpent, active, completed };
  }, [orders]);

  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const paginatedOrders = useMemo(
    () => orders.slice((page - 1) * pageSize, page * pageSize),
    [orders, page],
  );

  const hasReview = (orderId: string, productId: string) =>
    reviews.some((review) => review.order === orderId && review.product?._id === productId);

  const openReviewModal = (orderId: string, productId: string, productName: string) => {
    setReviewModal({ orderId, productId, productName });
    setReviewForm({ rating: 5, title: "", comment: "" });
  };

  const handleSubmitReview = async () => {
    if (!reviewModal) return;
    if (!reviewForm.comment.trim()) {
      toast.error("Please add a short comment about your experience.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await submitReview({
        productId: reviewModal.productId,
        orderId: reviewModal.orderId,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment.trim(),
      });
      if (res?.unauthorized) {
        toast.error("Please login to submit a review.");
        return;
      }
      if (res?.success) {
        toast.success("Review submitted for moderation.");
        setReviews((prev) => [res.data, ...prev]);
        setReviewModal(null);
      } else {
        toast.error(res?.message || "Failed to submit review.");
      }
    } catch (error) {
      toast.error("Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
     <Loader></Loader>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl bg-white/90 p-10 text-center shadow-sm ring-1 ring-gray-100">
        <h2 className="text-xl font-bold text-gray-800">No orders yet</h2>
        <p className="mt-2 text-sm text-gray-600">Your purchases will appear here once placed.</p>
      </div>
    );
  }

  const statusConfig = (status: string) => {
    const key = status.toLowerCase();
    if (key === "pending") return { bg: "bg-amber-100", text: "text-amber-800", Icon: Clock };
    if (key === "processing") return { bg: "bg-blue-100", text: "text-blue-800", Icon: Package };
    if (key === "completed") return { bg: "bg-emerald-100", text: "text-emerald-800", Icon: CheckCircle2 };
    if (key === "cancelled") return { bg: "bg-rose-100", text: "text-rose-800", Icon: XCircle };
    return { bg: "bg-gray-100", text: "text-gray-800", Icon: Clock };
  };

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Customer</p>
              <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
              <p className="text-sm text-gray-600">
                Track your purchases, leave feedback, and see statuses at a glance.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <div className="rounded-2xl border border-pink-100 bg-pink-50 px-4 py-3 text-sm text-pink-800">
                <p className="text-xs font-semibold uppercase">Active</p>
                <p className="text-xl font-bold">{totals.active}</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <p className="text-xs font-semibold uppercase">Completed</p>
                <p className="text-xl font-bold">{totals.completed}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-800">
                <p className="text-xs font-semibold uppercase">Total spent</p>
                <p className="text-xl font-bold">${totals.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {paginatedOrders.map((order) => {
            const { bg, text, Icon } = statusConfig(order.status);
            return (
              <div
                key={order._id}
                className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900">Order #{order._id}</p>
                    <p className="text-xs text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${bg} ${text}`}>
                      <Icon size={16} />
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {order.status}
                      </span>
                    </div>
                    <div className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white">
                      ${order.totalAmount?.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {order.products.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-700 ring-1 ring-gray-100">
                        <Package size={18} />
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                          {item?.product?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty {item.quantity} · ${item.totalPrice}
                        </p>
                        <div className="flex items-center gap-2">
                          {hasReview(order._id, item?.product?._id) ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                              <CheckCircle2 size={14} />
                              Reviewed
                            </span>
                          ) : (
                            <button
                              disabled={order.status !== "completed" || !item?.product?._id}
                              onClick={() =>
                                openReviewModal(
                                  order._id,
                                  item?.product?._id,
                                  item?.product?.name || "Product"
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-pink-600 ring-1 ring-pink-100 transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                            >
                              <MessageSquare size={14} />
                              {order.status !== "completed" ? "Wait for delivery" : "Leave review"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {orders.length > pageSize && (
          <div className="flex flex-col items-center justify-between gap-3 rounded-2xl bg-white/90 p-4 text-sm text-gray-700 shadow-sm ring-1 ring-gray-100 md:flex-row">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, orders.length)} of{" "}
              {orders.length}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {reviewModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-pink-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Feedback</p>
                <h3 className="text-xl font-bold text-gray-900">
                  Review {reviewModal.productName}
                </h3>
                <p className="text-sm text-gray-600">
                  Share your experience to help others and the seller improve.
                </p>
              </div>
              <button
                onClick={() => setReviewModal(null)}
                className="text-sm font-semibold text-gray-500 hover:text-gray-800"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-gray-500">Rating</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setReviewForm((prev) => ({ ...prev, rating: num }))}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition ${
                        num <= reviewForm.rating
                          ? "border-pink-200 bg-pink-50 text-pink-700"
                          : "border-gray-200 bg-white text-gray-600"
                      }`}
                    >
                      <Star
                        size={16}
                        className={num <= reviewForm.rating ? "fill-pink-500 text-pink-500" : ""}
                      />
                      <span className="sr-only">{num} star</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-gray-500">
                  Title (optional)
                </label>
                <input
                  value={reviewForm.title}
                  onChange={(e) =>
                    setReviewForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-100"
                  placeholder="Great product for daily use"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-gray-500">
                  Comment
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-100"
                  placeholder="What did you like or dislike about this product?"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setReviewModal(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <Send size={16} />
                {isSubmitting ? "Submitting..." : "Submit review"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default withCustomerAuth(MyOrders);
