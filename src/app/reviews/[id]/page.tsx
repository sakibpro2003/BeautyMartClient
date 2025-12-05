/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { StarRating } from "@/components/StarRating";
import { fetchReviewById } from "@/services/Reviews";
import { TReview } from "@/types/review";

export default function ReviewDetails() {
  const params = useParams<{ id: string }>();
  const reviewId = params?.id;
  const [review, setReview] = useState<TReview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!reviewId) return;
      setLoading(true);
      const res = await fetchReviewById(reviewId);
      if (res?.success) {
        setReview(res.data);
      } else {
        setReview(null);
      }
      setLoading(false);
    };
    load();
  }, [reviewId]);

  const avatar = useMemo(() => {
    if (!review) return "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg";
    return (
      review.user?.profileImage ||
      review.product?.image ||
      "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
    );
  }, [review]);

  const sentimentTone = (sentiment?: string) => {
    if (sentiment === "positive") return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (sentiment === "negative") return "bg-rose-50 text-rose-700 border-rose-100";
    return "bg-amber-50 text-amber-700 border-amber-100";
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <main className="w-11/12 max-w-4xl mx-auto mt-16 mb-16">
        {!review ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg ring-1 ring-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">Review not found</h1>
            <p className="mt-2 text-gray-600">This review is no longer available.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-pink-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 relative rounded-full overflow-hidden border-4 border-pink-200">
                  <Image
                    src={avatar}
                    alt={review.user?.name || "Customer"}
                    fill
                    className="object-cover"
                    sizes="80px"
                    unoptimized
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-pink-600">
                    {review.title || "Customer feedback"}
                  </h1>
                  <p className="text-gray-600 text-sm">
                    by <span className="font-medium">{review.user?.name || "Verified buyer"}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:mt-0 flex flex-col items-end gap-2">
                <StarRating rating={review.rating} />
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${sentimentTone(review.sentiment)}`}
                >
                  {review.sentiment} tone
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Product reviewed</p>
                <p className="text-base text-gray-800">{review.product?.name}</p>
              </div>
              {review.keywords?.length ? (
                <div className="flex flex-wrap gap-2">
                  {review.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mt-6">
              <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line">
                {review.comment}
              </p>
            </div>

            {review.adminReply ? (
              <div className="mt-8 rounded-2xl bg-gradient-to-r from-pink-50 to-amber-50 p-4 border border-pink-100">
                <p className="text-xs font-semibold uppercase text-pink-600">Admin reply</p>
                <p className="text-sm text-gray-800 mt-1">{review.adminReply}</p>
              </div>
            ) : (
              <div className="mt-8 text-center">
                <p className="text-pink-600 font-medium text-sm">
                  Loved this review? Explore more from our customers!
                </p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
