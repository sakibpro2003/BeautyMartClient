/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { addToCart } from "@/services/Cart";
import { getSingleProduct } from "@/services/Products";
import { fetchProductReviews } from "@/services/Reviews";
import Image from "next/image";
import React, { useEffect, useMemo, useState, use } from "react";
import { StarRating } from "@/components/StarRating";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader2 } from "lucide-react";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { formatBDT } from "@/utils/currency";
import { TReview } from "@/types/review";

const ProductDetails = ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [reviews, setReviews] = useState<TReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const isOutOfStock = !product?.inStock || product?.quantity <= 0;
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getSingleProduct(productId);
        setProduct(response?.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const res = await fetchProductReviews(productId);
        if (res?.success) {
          setReviews(res.data);
        }
      } catch (error) {
        console.error("Error fetching product reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [productId]);

  type TAddCart = {
    quantity: number;
    product: string;
  };

  const handleAddToCart = async (id: string) => {
    if (isOutOfStock) {
      toast.error("Product is out of stock.");
      return;
    }

    setIsAddingToCart(true);
    const payload: TAddCart = { quantity: 1, product: id };

    try {
      const res = await addToCart(payload);
      if (res?.unauthorized) {
        toast.error("Please log in to add items to your cart.");
        router.push("/login");
        return;
      }
      if (res?.success) {
        toast.success("Added to cart successfully!");
      } else {
        toast.error("Failed to add to cart.");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const averageRating = useMemo(() => {
    if (reviews.length) {
      const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
      return total / reviews.length;
    }
    return product?.rating || 0;
  }, [reviews, product]);

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen text-pink-600 text-xl font-semibold">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-pink-50 pb-16">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto px-4 lg:px-6 pt-10">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-pink-600/80">
          <span className="rounded-full bg-white/70 px-3 py-1 ring-1 ring-pink-100">Products</span>
          <span className="rounded-full bg-pink-50 px-3 py-1 ring-1 ring-pink-100">
            {product?.category || "Beauty"}
          </span>
          <span
            className={`rounded-full px-3 py-1 ring-1 ${
              isOutOfStock
                ? "bg-rose-50 text-rose-700 ring-rose-100"
                : "bg-emerald-50 text-emerald-700 ring-emerald-100"
            }`}
          >
            {isOutOfStock ? "Out of stock" : "In stock"}
          </span>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative rounded-3xl bg-white/80 p-6 shadow-[0_25px_80px_rgba(255,183,197,0.25)] ring-1 ring-pink-100/70 backdrop-blur">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-50 via-white to-amber-50 blur-2xl -z-10" />
            <div className="grid gap-6">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-pink-50 to-amber-50 ring-1 ring-pink-100/60 shadow-inner">
                <Image
                  width={600}
                  height={500}
                  src={product?.image || "/placeholder.jpg"}
                  alt={product?.name || "Product Image"}
                  className="mx-auto h-[420px] w-full object-contain transition duration-500 hover:scale-[1.02]"
                  unoptimized
                />
                {product?.discount ? (
                  <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-gradient-to-r from-rose-500 to-orange-400 px-3 py-1 text-[11px] font-semibold text-white shadow-lg shadow-rose-200/50">
                    {product.discount}% off
                  </span>
                ) : null}
              </div>

              <div className="grid gap-4 rounded-2xl bg-white/90 p-4 ring-1 ring-gray-100 shadow-sm">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-pink-50 px-4 py-3 ring-1 ring-pink-100">
                    <p className="text-xs font-semibold uppercase text-pink-600">Price</p>
                    <p className="text-2xl font-bold text-gray-900">${product?.price || "N/A"}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100">
                    <p className="text-xs font-semibold uppercase text-gray-500">Quantity</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {product?.quantity ?? "N/A"}{" "}
                      <span className="text-sm font-medium text-gray-500">units left</span>
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase text-gray-500">Brand</p>
                    <p className="text-sm font-medium text-gray-900">
                      {product?.manufacturer?.name || product?.brand || "Unknown"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase text-gray-500">Form</p>
                    <p className="text-sm font-medium text-gray-900">
                      {product?.form || "Standard"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase text-gray-500">Expiry</p>
                    <p className="text-sm font-medium text-gray-900">
                      {product?.expiryDate
                        ? new Date(product.expiryDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl bg-white/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    {product?.name || "No Name"}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {product?.description || "No description available."}
                  </p>
                </div>
                <div className="rounded-2xl bg-amber-50 px-4 py-2 text-center ring-1 ring-amber-100">
                  <p className="text-xs font-semibold text-amber-700">Rating</p>
                  <p className="text-xl font-bold text-amber-800">
                    {averageRating ? averageRating.toFixed(1) : "New"}
                  </p>
                  <p className="text-[11px] font-semibold text-amber-700">
                    {reviews.length} review{reviews.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-gradient-to-r from-pink-600 to-orange-500 px-5 py-4 text-white shadow-lg shadow-pink-200/60">
                  <p className="text-sm font-semibold">Total</p>
                  <p className="text-3xl font-bold">
                    {product?.price ? formatBDT(product.price) : "N/A"}
                    <span className="ml-2 text-sm font-medium text-orange-100">incl. taxes</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                      isOutOfStock ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {isOutOfStock ? "!" : "✓"}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Availability</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {isOutOfStock ? "Currently unavailable" : "Ready to ship"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <button
                  onClick={() => handleAddToCart(productId)}
                  className={`w-full py-3 text-white text-lg font-semibold rounded-2xl transition flex justify-center items-center shadow-md ${
                    isOutOfStock
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-pink-600 hover:-translate-y-0.5 hover:shadow-lg hover:bg-pink-700"
                  }`}
                  disabled={isAddingToCart || isOutOfStock}
                >
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Adding to Cart...
                    </>
                  ) : (
                    "Add To Cart"
                  )}
                </button>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Free delivery on orders over BDT 5,000
                  </span>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-gray-100 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Product details</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase text-gray-500">Category</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {product?.category || "General"}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase text-gray-500">Manufacturer</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {product?.manufacturer?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {product?.manufacturer?.address || "Address not provided"}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase text-gray-500">Contact</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {product?.manufacturer?.contact || "N/A"}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/70 px-4 py-3 text-sm text-pink-800">
                Lovingly curated for self-care enthusiasts. Check availability before purchase to
                ensure timely delivery.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 lg:px-6 pt-6">
        <div className="rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-gray-100 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Reviews</p>
              <h2 className="text-xl font-bold text-gray-900">
                What customers say about this product
              </h2>
              <p className="text-sm text-gray-600">
                Average rating {averageRating ? averageRating.toFixed(1) : "New"} •{" "}
                {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 px-4 py-2 text-center ring-1 ring-amber-100">
              <p className="text-xs font-semibold text-amber-700">Rating</p>
              <p className="text-xl font-bold text-amber-800">
                {averageRating ? averageRating.toFixed(1) : "New"}
              </p>
              <p className="text-[11px] font-semibold text-amber-700">
                {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {reviewsLoading ? (
            <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
              No reviews yet. Be the first to share your experience.
            </div>
          ) : (
            <div className="grid gap-3">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {review.user?.name || "Verified buyer"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-amber-500">
                      <StarRating rating={review.rating} />
                      <span className="text-gray-600">{review.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-800">{review.comment}</p>
                  {review.adminReply ? (
                    <div className="mt-2 rounded-xl bg-pink-50 px-3 py-2 text-xs text-pink-800 ring-1 ring-pink-100">
                      Admin reply: {review.adminReply}
                    </div>
                  ) : null}
                  {review.keywords?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {review.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-700"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
