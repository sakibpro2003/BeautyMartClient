"use client";

import { useEffect, useMemo, useState } from "react";
import withCustomerAuth from "@/hoc/withCustomerAuth";
import { getOrders } from "@/services/Orders";
import { createReturnRequest, fetchMyReturns } from "@/services/Returns";
import { TOrder } from "@/types/order";
import { ReturnRequest } from "@/types/returns";
import { toast } from "react-toastify";
import { Loader2, Package, RefreshCcw, RotateCcw, Wallet } from "lucide-react";

const reasonOptions = [
  "Damaged/defective item",
  "Wrong item received",
  "Not as described",
  "Arrived late",
  "Changed mind",
  "Other",
];

const ReturnsPage = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [type, setType] = useState<"refund" | "exchange">("refund");
  const [reason, setReason] = useState(reasonOptions[0]);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<{ product: string; quantity: number }[]>([]);

  const loadData = async () => {
    setLoading(true);
    const [orderRes, returnRes] = await Promise.all([getOrders(), fetchMyReturns()]);
    if (orderRes?.success) {
      setOrders(orderRes.data);
      const first = orderRes.data[0]?._id;
      if (first) {
        setSelectedOrderId(first);
        const defaultItems =
          orderRes.data[0].products?.map((p) => ({
            product: p.product?._id,
            quantity: p.quantity,
          })) || [];
        setItems(defaultItems);
      }
    }
    if (returnRes?.success) {
      setRequests(returnRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const order = orders.find((o) => o._id === selectedOrderId);
    if (order) {
      setItems(order.products.map((p) => ({ product: p.product?._id, quantity: p.quantity })));
    }
  }, [selectedOrderId, orders]);

  const selectedOrder = useMemo(
    () => orders.find((o) => o._id === selectedOrderId),
    [orders, selectedOrderId]
  );

  const submit = async () => {
    if (!selectedOrderId) {
      toast.error("Select an order to return or exchange.");
      return;
    }
    const selectedItems = items.filter((i) => i.quantity > 0);
    if (!selectedItems.length) {
      toast.error("Select at least one item.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        order: selectedOrderId,
        items: selectedItems,
        reason,
        notes,
        type,
      };
      const res = await createReturnRequest(payload);
      if (res?.unauthorized) {
        toast.error("Please log in to submit a return.");
        return;
      }
      if (res?.success) {
        toast.success("Request submitted. We will review shortly.");
        setRequests((prev) => [res.data, ...prev]);
        setNotes("");
      } else {
        toast.error(res?.message || "Failed to submit request.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status: string) => {
    const base = "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold";
    if (status === "approved") return `${base} bg-blue-100 text-blue-700`;
    if (status === "denied") return `${base} bg-rose-100 text-rose-700`;
    if (status === "refunded") return `${base} bg-emerald-100 text-emerald-700`;
    if (status === "exchanged") return `${base} bg-indigo-100 text-indigo-700`;
    if (status === "closed") return `${base} bg-gray-100 text-gray-700`;
    return `${base} bg-amber-100 text-amber-800`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-3xl bg-white p-10 shadow-sm ring-1 ring-gray-100">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-pink-500" />
        <span className="text-sm font-semibold text-gray-700">Loading returns...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Returns</p>
            <h1 className="text-2xl font-bold text-gray-900">Returns & exchanges</h1>
            <p className="text-sm text-gray-600">
              Submit a return or exchange request. We will review and respond quickly.
            </p>
          </div>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-100"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
                Request
              </p>
              <h2 className="text-xl font-bold text-gray-900">Start a return or exchange</h2>
            </div>
            <div className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Step 1
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-pink-600">
              Order
            </label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
            >
              {orders.map((order) => (
                <option key={order._id} value={order._id}>
                  #{order._id} · {new Date(order.createdAt).toLocaleDateString()} · $
                  {order.totalAmount?.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setType("refund")}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                    type === "refund"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  Refund
                </button>
                <button
                  onClick={() => setType("exchange")}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                    type === "exchange"
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  Exchange
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
              >
                {reasonOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-pink-600">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
              placeholder="Add any details about the issue."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-pink-600">
              Items to return
            </label>
            <div className="space-y-3">
              {(selectedOrder?.products || []).map((item, idx) => (
                <div
                  key={item._id}
                  className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-700 ring-1 ring-gray-100">
                    <Package size={16} />
                  </div>
                  <div className="flex-1 min-w-[180px]">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {item.product?.name}
                    </p>
                    <p className="text-xs text-gray-500">Ordered qty: {item.quantity}</p>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={item.quantity}
                    value={items[idx]?.quantity || item.quantity}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      setItems((prev) => {
                        const next = [...prev];
                        next[idx] = { product: item.product?._id, quantity: qty };
                        return next;
                      });
                    }}
                    className="w-24 rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={submit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-pink-400"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw size={16} />}
              Submit request
            </button>
            <p className="text-xs text-gray-500">
              Refunds are possible where payment was completed. Exchanges will confirm stock before approval.
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
                Timeline
              </p>
              <h2 className="text-xl font-bold text-gray-900">Recent requests</h2>
            </div>
            <Wallet className="text-pink-500" size={20} />
          </div>

          {requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/60 p-6 text-center text-sm text-gray-600">
              No return or exchange requests yet.
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900">
                        #{req._id} · {req.type.toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Submitted {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                    <span className={statusBadge(req.status)}>{req.status}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <p className="font-semibold">Reason: {req.reason}</p>
                    {req.resolutionNote && (
                      <p className="text-xs text-gray-500">Note: {req.resolutionNote}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withCustomerAuth(ReturnsPage);
