"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { addToCart } from "@/services/Cart";
import { fetchWishlist, removeFromWishlist } from "@/services/Wishlist";
import { toast } from "react-toastify";
import { Loader2, HeartOff, ShoppingBag } from "lucide-react";

type TWishlistItem = {
  _id: string;
  product: {
    _id: string;
    name: string;
    image?: string;
    price?: number;
    category?: string;
    inStock?: boolean;
  };
};

const WishlistPage = () => {
  const [items, setItems] = useState<TWishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadWishlist = async () => {
    setLoading(true);
    const res = await fetchWishlist();
    if (res?.unauthorized) {
      toast.error("Please login to see your wishlist.");
      setLoading(false);
      return;
    }
    if (res?.success) {
      setItems(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    setBusyId(productId);
    const res = await removeFromWishlist(productId);
    if (res?.success) {
      setItems((prev) => prev.filter((i) => i.product?._id !== productId));
      toast.success("Removed from wishlist");
    }
    setBusyId(null);
  };

  const handleAddToCart = async (productId: string) => {
    setBusyId(productId);
    const res = await addToCart({ product: productId, quantity: 1 });
    if (res?.success) {
      toast.success("Added to cart");
    } else if (res?.unauthorized) {
      toast.error("Please login to add to cart.");
    } else {
      toast.error("Could not add to cart.");
    }
    setBusyId(null);
  };

  const emptyState = useMemo(
    () => (
      <div className="rounded-3xl bg-white/90 p-10 text-center shadow-sm ring-1 ring-gray-100">
        <HeartOff className="mx-auto h-10 w-10 text-pink-400" />
        <h2 className="mt-2 text-lg font-semibold text-gray-800">Your wishlist is empty</h2>
        <p className="mt-1 text-sm text-gray-600">
          Save products you love and they will show up here.
        </p>
        <Link
          href="/products"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-pink-700"
        >
          Browse products
        </Link>
      </div>
    ),
    []
  );

  const pageBody = loading ? (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-pink-600" />
    </div>
  ) : (
    <div className="w-11/12 mx-auto max-w-6xl py-10 space-y-6">
      <div className="rounded-3xl bg-white/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Customer</p>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-600">
            Quickly revisit and purchase items you’ve saved for later.
          </p>
        </div>
        <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-pink-700 ring-1 ring-pink-100">
          {items.length} item{items.length === 1 ? "" : "s"}
        </span>
      </div>

      {items.length === 0 ? (
        emptyState
      ) : (
        <div className="grid gap-4">
          {items.map((item) => {
            const product = item.product;
            return (
              <div
                key={item._id}
                className="rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-gray-100 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-gray-100">
                    <Image
                      src={
                        product?.image ||
                        "https://i.ibb.co.com/m5sgBFhq/advil-pain-relief-tablets-96-easy-to-swallow-tablets-39f3a1e1-c0c8-4fd1-993d-17420e40320c.png"
                      }
                      alt={product?.name || "Product"}
                      width={64}
                      height={64}
                      className="h-full w-full object-contain"
                      unoptimized
                    />
                  </div>
                  <div>
                    <Link
                      href={`/products/${product?._id}`}
                      className="text-sm font-semibold text-gray-900 hover:text-pink-600"
                    >
                      {product?.name || "Unnamed product"}
                    </Link>
                    <p className="text-xs text-gray-600">{product?.category || "Beauty"}</p>
                    <p className="text-sm font-bold text-pink-700">
                      {product?.price ? `BDT ${product.price}` : "Price on view"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleAddToCart(product?._id || "")}
                    disabled={busyId === product?._id}
                    className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    <ShoppingBag size={16} />
                    {busyId === product?._id ? "Adding..." : "Add to cart"}
                  </button>
                  <button
                    onClick={() => handleRemove(product?._id || "")}
                    disabled={busyId === product?._id}
                    className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-700 shadow-sm hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busyId === product?._id ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-pink-50 pb-12">
      {pageBody}
    </div>
  );
};

export default WishlistPage;
