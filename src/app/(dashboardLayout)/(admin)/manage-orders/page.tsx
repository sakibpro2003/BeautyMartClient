/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import withAdminAuth from "@/hoc/withAdminAuth";
import { changeOrderStatus, getAllOrders } from "@/services/Orders";
import { TOrder } from "@/types/order";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const statusOptions = ["pending", "processing", "completed", "canceled"];

const OrdersPage = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await getAllOrders();

        setOrders(allOrders.data || []);
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-3 text-center">Orders Management</h1>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-black text-white text-xs">
            <tr>
              <th className="border px-2 py-2">#</th>
              <th className="border px-2 py-2">Customer Name</th>
              <th className="border px-2 py-2">Total ($)</th>
              <th className="border px-2 py-2">Status</th>
              <th className="border px-2 py-2">Address</th>
              <th className="border px-2 py-2">Payment</th>
              <th className="border px-2 py-2">Products</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr
                  key={order?._id}
                  className="text-center hover:bg-gray-100 transition"
                >
                  <td className="border px-2 py-2">{index + 1}</td>
                  <td className="border px-2 py-2">{order?.user?.name}</td>
                  <td className="border px-2 py-2 font-semibold">
                    ${order?.totalAmount}
                  </td>
                  <td className="border px-2 py-2">
                    <select
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        order?.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order?.status === "processing"
                            ? "bg-blue-100 text-blue-700"
                            : order?.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                      }`}
                      value={order?.status}
                      onChange={(e) =>
                        handleStatusChange(order?._id, e.target.value as any)
                      }
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border px-2 py-2">
                    {order?.address || "N/A"}
                  </td>
                  <td className="border px-2 py-2">
                    {order.paymentMethod || "N/A"}
                  </td>
                  <td className="border px-2 py-2">
                    {order?.products.map((product, i) => (
                      <div key={i} className="flex items-center space-x-2 py-1">
                        <Image
                          width={40}
                          height={40}
                          src={product?.product?.image || "https://i.ibb.co.com/m5sgBFhq/advil-pain-relief-tablets-96-easy-to-swallow-tablets-39f3a1e1-c0c8-4fd1-993d-17420e40320c.png"}
                          alt={"product_name"}
                          className="rounded shadow-md"
                          unoptimized
                        />
                        <div className="text-left">
                          <p className="font-semibold text-gray-700">
                            {product?.product?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {product?.quantity} | $
                            {/* {product?.product?.price} */}
                          </p>
                        </div>
                      </div>
                    ))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default withAdminAuth(OrdersPage);
