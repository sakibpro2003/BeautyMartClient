/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import withCustomerAuth from "@/hoc/withCustomerAuth";
import {
  decreaseItemQuantity,
  getCartProducts,
  increaseItemQuantity,
  removeItem,
} from "@/services/Cart";
import { validatePromotion } from "@/services/Promotions";
import { formatBDT } from "@/utils/currency";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CartPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bkash");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any | null>(null);
  const [promoMessage, setPromoMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [confirmingOrder, setConfirmingOrder] = useState(false);

  const fetchCartProducts = async () => {
    try {
      setIsLoading(true);
      const cartProducts = await getCartProducts();
      setProducts(cartProducts?.data || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  const handleIncrease = async (_id: string) => {
    setIsLoading(true);
    const res = await increaseItemQuantity(_id);
    if (res.success) {
      await fetchCartProducts();
    }
    setIsLoading(false);
  };

  const handleDecrease = async (_id: string) => {
    setIsLoading(true);
    const res = await decreaseItemQuantity(_id);
    if (res.success) {
      await fetchCartProducts();
    }
    setIsLoading(false);
  };

  const handleRemoveItem = async (id: string) => {
    setIsLoading(true);
    await removeItem(id);
    await fetchCartProducts();
    setIsLoading(false);
  };

  const applyPromo = async () => {
    const normalized = promoCode.trim().toUpperCase();
    if (!normalized) {
      setAppliedPromo(null);
      setPromoMessage("Enter a code.");
      return;
    }
    const res = await validatePromotion(normalized);
    if (!res?.success) {
      setAppliedPromo(null);
      setPromoMessage(res?.message || "Code not found.");
      return;
    }
    const promo = res.data;
    const subtotal = products.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
    if (promo.minimumOrder && subtotal < promo.minimumOrder) {
      setPromoMessage(`Minimum order $${promo.minimumOrder} required for this code.`);
      setAppliedPromo(null);
      return;
    }
    setAppliedPromo(promo);
    setPromoMessage(`Applied ${promo.code}`);
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    const subtotal = products.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
    if (appliedPromo.discountType === "percentage") {
      return (subtotal * appliedPromo.value) / 100;
    }
    return Math.min(appliedPromo.value, subtotal);
  };

  const adjustedItems = () => {
    const discount = calculateDiscount();
    if (!appliedPromo || discount <= 0) {
      return products.map((item) => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));
    }

    const subtotal = products.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
    const factor = subtotal > 0 ? Math.max(0, (subtotal - discount) / subtotal) : 1;

    return products.map((item, idx) => {
      const adjustedPrice = Math.max(
        0.5,
        Math.round(item.product.price * factor * 100) / 100
      );
      return {
        name: item.product.name,
        price: adjustedPrice,
        quantity: item.quantity,
        image: item.product.image,
      };
    });
  };

  const handleConfirmOrder = async () => {
    try {
      setConfirmingOrder(true);
      if (products.length === 0) {
        toast.error("Your cart is empty!");
        setConfirmingOrder(false);
        return;
      }

      const items = adjustedItems();

      const origin = typeof window !== "undefined" ? window.location.origin : "";

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          address,
          paymentMethod,
          promoCode: appliedPromo?.code || "",
          successUrl: `${origin}/cart?status=success`,
          cancelUrl: `${origin}/cart?status=cancelled`,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.url) {
        throw new Error(data?.message || "Unable to start payment.");
      }

      window.location.href = data.url;
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setConfirmingOrder(false);
    }
  };

  const subtotal = products.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const discount = calculateDiscount();
  const total = Math.max(0, subtotal - discount);
  const totalItems = products.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-pink-50 py-10">
      {isLoading && <Loader />}
      <div className="mx-auto flex w-11/12 max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Your bag</p>
            <h1 className="text-3xl font-bold text-gray-900">Review your cart</h1>
            <p className="text-sm text-gray-600">
              {totalItems} item{totalItems === 1 ? "" : "s"} • {formatBDT(subtotal)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-semibold text-gray-600">
            <span className="rounded-full bg-white px-3 py-1 ring-1 ring-gray-200">
              Secure checkout
            </span>
            <span className="rounded-full bg-white px-3 py-1 ring-1 ring-gray-200">
              Free returns within 30 days
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="rounded-3xl bg-white/90 p-10 text-center shadow-sm ring-1 ring-gray-100">
                <p className="text-lg font-semibold text-gray-700">Your cart is empty</p>
                <p className="text-sm text-gray-500 mt-2">Add items to see them here.</p>
              </div>
            ) : (
              products.map((item) => (
                <div
                  key={item._id}
                  className="group rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-4 md:w-2/5">
                      <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 via-white to-amber-50 ring-1 ring-pink-100/70">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-contain"
                          sizes="120px"
                          unoptimized
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-semibold text-gray-900">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-600">{formatBDT(item.product.price)}</p>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {item.product.inStock ? "In stock" : "Out of stock"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => handleDecrease(item?.product?._id)}
                          className="h-9 w-9 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                          -
                        </Button>
                        <span className="text-sm font-semibold text-gray-900">{item.quantity}</span>
                        <Button
                          onClick={() => handleIncrease(item?.product?._id)}
                          className="h-9 w-9 rounded-full bg-gray-900 text-white hover:bg-gray-800"
                        >
                          +
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatBDT(item.product.price * item.quantity)}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        className="text-sm font-semibold text-rose-600 hover:text-rose-700"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-4">
              <div className="rounded-3xl bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.05)] ring-1 ring-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Order summary</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatBDT(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <span className="font-semibold text-emerald-600">
                    {discount > 0 ? `- ${formatBDT(discount)}` : formatBDT(0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatBDT(total)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <label className="text-xs font-semibold uppercase text-gray-500">
                  Coupon / Promo code
                </label>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300 uppercase"
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    />
                    <Button
                      onClick={applyPromo}
                      variant="secondary"
                      className="rounded-xl border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700 hover:bg-pink-100"
                    >
                      Apply
                    </Button>
                  </div>
                  {promoMessage && (
                    <p
                      className={`text-xs font-semibold ${
                        appliedPromo ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {promoMessage}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <label className="text-xs font-semibold uppercase text-gray-500">
                  Delivery address
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="mt-4 space-y-3">
                <label className="text-xs font-semibold uppercase text-gray-500">
                  Payment method
                </label>
                <select
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Bkash">Bkash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="COD">Cash on Delivery</option>
                  <option value="Card">Credit/Debit Card</option>
                </select>
              </div>

              <Button
                onClick={handleConfirmOrder}
                disabled={confirmingOrder || products.length === 0}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-pink-600 to-orange-500 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200/60 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {confirmingOrder ? "Processing..." : "Proceed to payment"}
              </Button>

              <p className="mt-3 text-center text-xs text-gray-500">
                Secure payment powered by Stripe
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-pink-100 text-sm text-pink-700 shadow-inner">
              <p className="font-semibold">Need help?</p>
              <p className="text-pink-700/80">
                Our support team is here for you 24/7. Reach out if you have any issues with your
                order or payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withCustomerAuth(CartPage);
