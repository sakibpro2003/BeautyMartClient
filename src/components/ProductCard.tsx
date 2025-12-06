/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllProducts } from "@/services/AuthService";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "@/services/Wishlist";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { StarRating } from "./StarRating";
import { formatBDT } from "@/utils/currency";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";

const limit = 8;
const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Top Rated" },
  { value: "name-asc", label: "Name A-Z" },
];
const categories = [
  "Skincare",
  "Haircare",
  "Makeup",
  "Fragrance",
  "Bath",
  "Nails",
  "Men",
  "Lip",
];
const forms = [
  "Cream",
  "Serum",
  "Lotion",
  "Cleanser",
  "Mask",
  "Oil",
  "Toner",
  "Gel",
  "Mist",
  "Balm",
];

const ProductCard = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{ page: number; totalPages: number; total: number }>({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [formFilter, setFormFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [brandFilterLocal, setBrandFilterLocal] = useState("");
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [compareItems, setCompareItems] = useState<
    { id: string; name: string; image: string; price: number; category?: string; form?: string; typeKey: string }[]
  >([]);
  const compareStorageKey = "beautymart_compare";

  const searchParams = useSearchParams();
  const brandFilter = searchParams.get("brand");
  const categoryQuery = searchParams.get("category");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));

    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    const effectiveCategory = categoryQuery || categoryFilter;
    if (effectiveCategory) params.set("category", effectiveCategory);
    if (formFilter) params.set("form", formFilter);
    if (stockFilter) params.set("inStock", stockFilter === "in" ? "true" : "false");
    const effectiveBrand = brandFilter || brandFilterLocal;
    if (effectiveBrand) params.set("brand", effectiveBrand);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minRating) params.set("minRating", minRating);

    switch (sortOption) {
      case "price-asc":
        params.set("sortBy", "price");
        params.set("sortOrder", "asc");
        break;
      case "price-desc":
        params.set("sortBy", "price");
        params.set("sortOrder", "desc");
        break;
      case "rating-desc":
        params.set("sortBy", "rating");
        params.set("sortOrder", "desc");
        break;
      case "name-asc":
        params.set("sortBy", "name");
        params.set("sortOrder", "asc");
        break;
      default:
        params.set("sortBy", "created_at");
        params.set("sortOrder", "desc");
    }
    return params.toString();
  }, [
    page,
    searchQuery,
    categoryFilter,
    categoryQuery,
    formFilter,
    stockFilter,
    minPrice,
    maxPrice,
    minRating,
    sortOption,
    brandFilter,
    brandFilterLocal,
  ]);

  const activeFilters = useMemo(() => {
    const chips: string[] = [];
    if (searchQuery) chips.push(`Search: ${searchQuery}`);
    if (brandFilterLocal || brandFilter) chips.push(`Brand: ${brandFilterLocal || brandFilter}`);
    if (categoryQuery || categoryFilter) chips.push(`Category: ${categoryQuery || categoryFilter}`);
    if (formFilter) chips.push(`Form: ${formFilter}`);
    if (minPrice) chips.push(`Min BDT ${minPrice}`);
    if (maxPrice) chips.push(`Max BDT ${maxPrice}`);
    if (minRating) chips.push(`Rating ≥ ${minRating}`);
    if (stockFilter) chips.push(stockFilter === "in" ? "In stock" : "Out of stock");
    return chips;
  }, [
    searchQuery,
    brandFilterLocal,
    brandFilter,
    categoryQuery,
    categoryFilter,
    formFilter,
    minPrice,
    maxPrice,
    minRating,
    stockFilter
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    searchQuery,
    categoryFilter,
    categoryQuery,
    formFilter,
    stockFilter,
    minPrice,
    maxPrice,
    minRating,
    sortOption,
    brandFilter,
    brandFilterLocal,
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getAllProducts(queryString);
        if (Array.isArray(response?.data)) {
          setProducts(response.data);
          setMeta({
            page: response?.meta?.page || 1,
            totalPages: response?.meta?.totalPages || 1,
            total: response?.meta?.total || response?.data?.length || 0,
          });
        } else {
          console.log("Unexpected API response:", response);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchProducts();
  }, [queryString]);

  useEffect(() => {
    const loadWishlist = async () => {
      const res = await fetchWishlist();
      if (res?.success && Array.isArray(res.data)) {
        setWishlistIds(
          res.data
            .map((item: any) => item?.product?._id || item.product)
            .filter(Boolean)
        );
      }
    };
    loadWishlist();
  }, []);

  const toggleWishlist = async (productId: string) => {
    if (!productId) return;
    const isSaved = wishlistIds.includes(productId);
    if (isSaved) {
      const res = await removeFromWishlist(productId);
      if (res?.unauthorized) {
        toast.error("Please login to manage your wishlist.");
        return;
      }
      if (res?.success) {
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
        toast.success("Removed from wishlist");
      }
      return;
    }
    const res = await addToWishlist(productId);
    if (res?.unauthorized) {
      toast.error("Please login to save favorites.");
      return;
    }
    if (res?.success) {
      setWishlistIds((prev) => [...prev, productId]);
      toast.success("Saved to wishlist");
    } else if (res?.message) {
      toast.error(res.message);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setFormFilter("");
    setStockFilter("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setBrandFilterLocal("");
    setSortOption("newest");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(compareStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCompareItems(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load compare list", err);
    }
  }, []);

  const persistCompare = (next: typeof compareItems) => {
    setCompareItems(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(compareStorageKey, JSON.stringify(next));
    }
  };

  const removeCompareItem = (id: string) => {
    persistCompare(compareItems.filter((c) => c.id !== id));
  };

  const toggleCompare = (product: any) => {
    const typeKey = (product?.category || product?.form || "").toLowerCase();
    if (!product?._id) return;
    if (!typeKey) {
      toast.error("This product is missing a type to compare.");
      return;
    }

    const exists = compareItems.some((c) => c.id === product._id);
    if (exists) {
      removeCompareItem(product._id);
      toast.info("Removed from compare");
      return;
    }

    if (compareItems.length >= 2) {
      toast.error("You can compare up to 2 products at a time.");
      return;
    }

    if (compareItems.length > 0 && compareItems[0].typeKey !== typeKey) {
      toast.error("Pick products of the same type (e.g., both facewash).");
      return;
    }

    const next = [
      ...compareItems,
      {
        id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        category: product.category,
        form: product.form,
        typeKey,
      },
    ];
    persistCompare(next);
    toast.success("Added to compare");
  };

  return (
    <div className="w-11/12 mx-auto py-10">
      <div className="rounded-3xl bg-white/85 p-6 md:p-8 shadow-[0_18px_60px_rgba(0,0,0,0.08)] ring-1 ring-pink-100/70 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-600/80">Shop all</p>
            <h1 className="text-3xl font-bold text-gray-900">Beauty essentials</h1>
            <p className="text-gray-600 text-sm">{meta.total} products curated for you</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-full border border-pink-100 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>
            <input
              type="text"
              placeholder="Brand"
              value={brandFilterLocal || brandFilter || ""}
              onChange={(e) => setBrandFilterLocal(e.target.value)}
              className="rounded-full border border-pink-100 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="rounded-full border border-pink-100 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={clearFilters}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-pink-200 hover:text-pink-700"
            >
              Clear
            </button>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700 ring-1 ring-pink-100"
              >
                {chip}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">Filters</h3>
                {(categoryFilter ||
                  formFilter ||
                  stockFilter ||
                  minPrice ||
                  maxPrice ||
                  minRating ||
                  brandFilterLocal) && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-pink-600 hover:text-pink-700"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-3">
                <label className="text-xs font-semibold text-gray-600">Brand</label>
                <input
                  type="text"
                  value={brandFilterLocal || brandFilter || ""}
                  onChange={(e) => setBrandFilterLocal(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                  placeholder="e.g. Nivea"
                />

                <label className="text-xs font-semibold text-gray-600">Category</label>
                <select
                  value={categoryFilter || categoryQuery || ""}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                >
                  <option value="">All</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <label className="text-xs font-semibold text-gray-600">Form</label>
                <select
                  value={formFilter}
                  onChange={(e) => setFormFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                >
                  <option value="">All</option>
                  {forms.map((form) => (
                    <option key={form} value={form}>
                      {form}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-600">Min price</label>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600">Max price</label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                      placeholder="500"
                    />
                  </div>
                </div>

                <label className="text-xs font-semibold text-gray-600">Minimum rating</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                  placeholder="e.g. 4"
                />

                <label className="text-xs font-semibold text-gray-600">Availability</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setStockFilter(stockFilter === "in" ? "" : "in")}
                    className={`rounded-xl border px-3 py-2 text-sm ${
                      stockFilter === "in"
                        ? "border-pink-300 bg-pink-50 text-pink-700"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    In stock
                  </button>
                  <button
                    onClick={() => setStockFilter(stockFilter === "out" ? "" : "out")}
                    className={`rounded-xl border px-3 py-2 text-sm ${
                      stockFilter === "out"
                        ? "border-pink-300 bg-pink-50 text-pink-700"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    Out
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {initialLoading ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-64 rounded-2xl bg-gray-50 shadow-inner animate-pulse"
                  />
                ))
              ) : products.length === 0 ? (
                <p className="text-center col-span-full text-gray-500">No products found</p>
              ) : (
                products.map((p) => (
                  <div key={p._id} className="group relative h-full">
                    <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-pink-50 via-white to-amber-50 opacity-0 blur-xl transition duration-500 group-hover:opacity-100" />
                    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/50 bg-white/85 p-4 shadow-[0_18px_60px_rgba(255,183,197,0.18)] ring-1 ring-pink-100/70 backdrop-blur-sm transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_25px_90px_rgba(255,183,197,0.3)]">
                      <div
                        aria-hidden
                        className="absolute inset-x-3 top-2 h-16 rounded-2xl bg-gradient-to-br from-white via-white/70 to-pink-50/70 blur-xl"
                      />
                      <button
                        type="button"
                        onClick={() => toggleWishlist(p._id)}
                        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-pink-600 ring-1 ring-pink-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                        aria-label="Save product"
                      >
                        <Heart
                          size={18}
                          className={wishlistIds.includes(p._id) ? "fill-pink-500 text-pink-500" : ""}
                        />
                      </button>
                      {p.discount ? (
                        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-gradient-to-r from-rose-500 to-orange-400 px-3 py-1 text-[11px] font-semibold text-white shadow-lg shadow-rose-200/50">
                          {p.discount}% off
                        </span>
                      ) : null}

                      <div className="relative flex justify-center">
                        <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 via-white to-amber-50 ring-1 ring-pink-100/60">
                          <Image
                            src={p.image}
                            alt={p.name}
                            width={260}
                            height={240}
                            className="h-full w-full object-contain transition duration-500 group-hover:scale-105 group-hover:rotate-[0.5deg]"
                            unoptimized
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex flex-1 flex-col space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {p.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-amber-500">
                          <StarRating rating={p.rating || 0} />
                          <span className="text-gray-600">
                            {p.rating ? p.rating.toFixed(1) : "New"}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>

                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-orange-500 px-3 py-1 text-sm font-bold text-white shadow-lg shadow-pink-200/60">
                            {formatBDT(p.price)}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                              p.inStock
                                ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                                : "bg-rose-50 text-rose-700 ring-rose-100"
                            }`}
                          >
                            {p.inStock ? "In stock" : "Out of stock"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="rounded-full bg-gray-100 px-2 py-1 font-semibold uppercase tracking-wide text-gray-700">
                            {p.category}
                          </span>
                          <span className="rounded-full bg-white px-2 py-1 font-semibold text-gray-700 ring-1 ring-gray-100">
                            {p.manufacturer?.name}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/products/${p._id}`}
                        className="mt-4 inline-flex items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-gray-300 transition duration-300 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-pink-600 hover:to-orange-500 md:mt-auto"
                      >
                        View details
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleCompare(p)}
                        className={`mt-2 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition ${
                          compareItems.some((c) => c.id === p._id)
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                            : "bg-white text-pink-700 ring-1 ring-pink-200 hover:bg-pink-50"
                        }`}
                      >
                        {compareItems.some((c) => c.id === p._id) ? "Added to compare" : "Compare"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {compareItems.length ? (
              <div className="sticky bottom-4 z-20 mt-4 rounded-3xl border border-gray-100 bg-white/95 p-4 shadow-[0_15px_60px_rgba(0,0,0,0.12)] backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                      Compare up to 2 similar products
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {compareItems.map((item) => (
                        <div
                          key={item.id}
                          className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-800 ring-1 ring-gray-200"
                        >
                          {item.name}
                          <button
                            onClick={() => removeCompareItem(item.id)}
                            className="text-gray-500 hover:text-rose-600"
                            aria-label="Remove from compare"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link
                    href="/compare"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
                  >
                    Compare now
                  </Link>
                </div>
              </div>
            ) : null}

            {meta.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {meta.page} of {meta.totalPages}
                </p>
                <div className="flex gap-3">
                  <button
                    className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </button>
                  <button
                    className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
                    disabled={page === meta.totalPages}
                    onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPages))}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
