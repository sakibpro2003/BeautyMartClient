/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import withAdminAuth from "@/hoc/withAdminAuth";
import { changeOrderStatus, getAllOrders } from "@/services/Orders";
import { TOrder } from "@/types/order";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { CheckCircle2, Package, Truck, XCircle } from "lucide-react";
import { formatBDT } from "@/utils/currency";

const statusOptions = ["pending", "processing", "completed", "canceled"];

const OrdersPage = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await getAllOrders();

        setOrders(allOrders.data || []);
        setPage(1);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: boolean) => {
    setOrders((prevOrders: any) =>
      prevOrders.map((order: TOrder) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
    const res = await changeOrderStatus(newStatus, orderId);
    if (res.success) {
      toast.success("Status changed successfully");
    }
  };

  const totals = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const active = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
    const completed = orders.filter((o) => o.status === "completed").length;
    return { totalRevenue, active, completed };
  }, [orders]);

  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const paginatedOrders = useMemo(
    () => orders.slice((page - 1) * pageSize, page * pageSize),
    [orders, page],
  );

  const statusStyle = (status: string) => {
    const key = status.toLowerCase();
    if (key === "pending") return "bg-amber-100 text-amber-800";
    if (key === "processing") return "bg-blue-100 text-blue-800";
    if (key === "completed") return "bg-emerald-100 text-emerald-800";
    if (key === "canceled" || key === "cancelled") return "bg-rose-100 text-rose-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Admin</p>
            <h1 className="text-2xl font-bold text-gray-900">Orders management</h1>
            <p className="text-sm text-gray-600">
              Update order statuses and monitor current pipelines.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <p className="text-xs font-semibold uppercase">Active</p>
              <p className="text-xl font-bold">{totals.active}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <p className="text-xs font-semibold uppercase">Completed</p>
              <p className="text-xl font-bold">{totals.completed}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-800">
              <p className="text-xs font-semibold uppercase">Revenue</p>
              <p className="text-xl font-bold">{formatBDT(totals.totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white/90 p-10 text-center shadow-sm ring-1 ring-gray-100">
            <p className="text-lg font-semibold text-gray-800">No orders found</p>
            <p className="text-sm text-gray-600 mt-2">New orders will appear here.</p>
          </div>
        ) : (
          paginatedOrders.map((order, index) => (
            <div
              key={order?._id}
              className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">
                    Order #{order?._id} • {order?.user?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500">Placed: {new Date(order?.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(order?.status)}`}
                  >
                    {order?.status === "completed" ? <CheckCircle2 size={16} /> : null}
                    {order?.status === "processing" ? <Truck size={16} /> : null}
                    {order?.status === "pending" ? <Package size={16} /> : null}
                    {order?.status === "canceled" || order?.status === "cancelled" ? (
                      <XCircle size={16} />
                    ) : null}
                    <span className="uppercase tracking-wide">{order?.status}</span>
                  </div>
                  <div className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white">
                    {formatBDT(order?.totalAmount)}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                    <p className="text-xs font-semibold uppercase text-gray-500">Address</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {order?.address || "N/A"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                    <p className="text-xs font-semibold uppercase text-gray-500">Payment</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {order.paymentMethod || "N/A"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                    <p className="text-xs font-semibold uppercase text-gray-500">Items</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {order.products.length} product{order.products.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                    <p className="text-xs font-semibold uppercase text-gray-500">Order #</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {(page - 1) * pageSize + index + 1}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                  <label className="text-xs font-semibold uppercase text-gray-500">
                    Update status
                  </label>
                  <select
                    className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm focus:border-pink-400 focus:ring-pink-300"
                    value={order?.status}
                    onChange={(e) => handleStatusChange(order?._id, e.target.value as any)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {order?.products.map((product, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3"
                  >
                    <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white ring-1 ring-gray-100">
                      <Image
                        width={48}
                        height={48}
                        src={
                          product?.product?.image ||
                          "https://i.ibb.co.com/m5sgBFhq/advil-pain-relief-tablets-96-easy-to-swallow-tablets-39f3a1e1-c0c8-4fd1-993d-17420e40320c.png"
                        }
                        alt={product?.product?.name || "product"}
                        className="h-full w-full object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {product?.product?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty {product?.quantity} · ${product?.totalPrice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
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
  );
};

export default withAdminAuth(OrdersPage);
