"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getSingleProduct } from "@/services/Products";
import { formatBDT } from "@/utils/currency";
import { StarRating } from "@/components/StarRating";
import Loader from "@/components/Loader";

type CompareEntry = {
  _id: string;
  name: string;
  image: string;
  price: number;
  category?: string;
  form?: string;
  description?: string;
  manufacturer?: { name?: string };
  inStock?: boolean;
  quantity?: number;
  expiryDate?: string;
  rating?: number;
};

const storageKey = "beautymart_compare";

const ComparePage = () => {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [products, setProducts] = useState<CompareEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setProductIds(parsed.map((p: any) => p.id || p._id).filter(Boolean));
        }
      }
    } catch (err) {
      console.error("Failed to read compare list", err);
    }
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      if (!productIds.length) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const results = await Promise.all(
          productIds.map(async (id) => {
            const res = await getSingleProduct(id);
            return res?.data as CompareEntry;
          })
        );
        setProducts(results.filter(Boolean));
      } catch (err) {
        console.error("Failed to load compare products", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [productIds]);

  const attributes = useMemo(() => {
    return [
      { key: "price", label: "Price" },
      { key: "category", label: "Category" },
      { key: "form", label: "Form" },
      { key: "manufacturer", label: "Brand" },
      { key: "inStock", label: "Availability" },
      { key: "quantity", label: "Quantity" },
      { key: "expiryDate", label: "Expiry date" },
      { key: "rating", label: "Reviews" },
      { key: "description", label: "Highlights" },
    ];
  }, []);

  const clearCompare = () => {
    setProducts([]);
    setProductIds([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-pink-50 py-10">
      <div className="mx-auto flex w-11/12 max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-pink-100/70">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-600">Compare</p>
            <h1 className="text-2xl font-bold text-gray-900">Side-by-side product match</h1>
            <p className="text-sm text-gray-600">
              See ingredients, form, price, availability, and reviews for two similar products.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/products"
              className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              Continue shopping
            </Link>
            <button
              onClick={clearCompare}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Clear compare
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl bg-white/90 p-10 text-center shadow-sm ring-1 ring-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Nothing to compare yet</h2>
            <p className="mt-2 text-sm text-gray-600">
              Pick two products of the same type (e.g., facewash) and tap “Compare”.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-white/90 p-4 shadow-sm ring-1 ring-gray-100">
            <div className="grid min-w-[720px] grid-cols-[180px_repeat(2,1fr)] gap-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Feature
              </div>
              {products.map((p) => (
                <div
                  key={p._id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-3 shadow-sm"
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="relative h-32 w-full overflow-hidden rounded-xl bg-white ring-1 ring-gray-100">
                      <Image
                        src={p.image || "/placeholder.jpg"}
                        alt={p.name || "Product"}
                        fill
                        className="object-contain"
                        sizes="160px"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                      <p className="text-xs font-semibold text-pink-600">{formatBDT(p.price || 0)}</p>
                    </div>
                  </div>
                </div>
              ))}

              {attributes.map((attr) => (
                <React.Fragment key={attr.key}>
                  <div className="self-center text-sm font-semibold text-gray-800">{attr.label}</div>
                  {products.map((p) => {
                    const value = (() => {
                      switch (attr.key) {
                        case "price":
                          return formatBDT(p.price || 0);
                        case "manufacturer":
                          return p.manufacturer?.name || "—";
                        case "inStock":
                          return p.inStock ? "In stock" : "Out of stock";
                        case "quantity":
                          return p.quantity ?? "—";
                        case "expiryDate":
                          return p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : "—";
                        case "rating":
                          return (
                            <div className="flex items-center gap-1">
                              <StarRating rating={p.rating || 0} />
                              <span className="text-xs text-gray-600">{p.rating ? p.rating.toFixed(1) : "New"}</span>
                            </div>
                          );
                        case "description":
                          return p.description ? (
                            <span className="text-sm text-gray-700">{p.description.slice(0, 120)}{p.description.length > 120 ? "…" : ""}</span>
                          ) : (
                            "—"
                          );
                        default:
                          return (p as any)[attr.key] || "—";
                      }
                    })();
                    return (
                      <div
                        key={`${p._id}-${attr.key}`}
                        className="rounded-2xl bg-white/80 p-3 text-sm text-gray-800 ring-1 ring-gray-100"
                      >
                        {value}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
