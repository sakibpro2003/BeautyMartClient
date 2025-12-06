"use client";

import React, { useEffect, useMemo, useState } from "react";
import withCustomerAuth from "@/hoc/withCustomerAuth";
import { getOrders } from "@/services/Orders";
import { TOrder } from "@/types/order";
import { formatBDT } from "@/utils/currency";
import Loader from "@/components/Loader";
import {
  Bar,
  Line,
} from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Tooltip,
} from "chart.js";
import { Calendar, Coins, Package, Sparkles } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

const CustomerAnalyticsPage = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getOrders();
        if (res?.success) {
          setOrders(res.data || []);
        }
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const metrics = useMemo(() => {
    if (!orders.length) {
      return {
        totalSpent: 0,
        totalOrders: 0,
        avgOrder: 0,
        lastPurchase: "",
      };
    }
    const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const avgOrder = totalSpent / totalOrders || 0;
    const lastPurchaseDate = orders
      .map((o) => new Date(o.createdAt))
      .sort((a, b) => b.getTime() - a.getTime())[0];
    return {
      totalSpent,
      totalOrders,
      avgOrder,
      lastPurchase: lastPurchaseDate?.toLocaleDateString() || "",
    };
  }, [orders]);

  const monthlyTrend = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }).map((_, idx) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
      return `${d.getFullYear()}-${d.getMonth() + 1}`;
    });
    const bucket: Record<string, number> = {};
    months.forEach((m) => (bucket[m] = 0));
    orders.forEach((order) => {
      const d = new Date(order.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (bucket[key] !== undefined) {
        bucket[key] += order.totalAmount || 0;
      }
    });
    const labels = months.map((m) => {
      const [y, mo] = m.split("-").map(Number);
      return new Date(y, mo - 1).toLocaleString("default", { month: "short" });
    });
    const data = months.map((m) => bucket[m]);
    return { labels, data };
  }, [orders]);

  const topProducts = useMemo(() => {
    const totals: Record<string, { name: string; qty: number; spent: number }> = {};
    orders.forEach((order) => {
      order.products.forEach((p) => {
        const id = p.product?._id || p._id;
        if (!id) return;
        if (!totals[id]) {
          totals[id] = { name: p.product?.name || "Product", qty: 0, spent: 0 };
        }
        totals[id].qty += p.quantity || 0;
        totals[id].spent += p.totalPrice || 0;
      });
    });
    return Object.values(totals)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orders]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Analytics</p>
            <h1 className="text-2xl font-bold text-gray-900">Your spending overview</h1>
            <p className="text-sm text-gray-600">
              Track spend, order cadence, and your most purchased products.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow">
            <Sparkles size={16} />
            Personalized stats
          </span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl bg-white/90 p-10 text-center shadow-sm ring-1 ring-gray-100">
          <h2 className="text-xl font-bold text-gray-800">No orders yet</h2>
          <p className="mt-2 text-sm text-gray-600">
            Place your first order to see spending trends and product insights.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total spent" value={formatBDT(metrics.totalSpent)} icon={<Coins size={18} />} tone="from-pink-50 to-amber-50" />
            <MetricCard label="Orders placed" value={metrics.totalOrders} icon={<Package size={18} />} tone="from-emerald-50 to-teal-50" />
            <MetricCard label="Avg order value" value={formatBDT(metrics.avgOrder)} icon={<Sparkles size={18} />} tone="from-blue-50 to-indigo-50" />
            <MetricCard label="Last purchase" value={metrics.lastPurchase || "—"} icon={<Calendar size={18} />} tone="from-gray-50 to-slate-100" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">Spend trend (last 6 months)</h3>
                <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
                  Monthly
                </span>
              </div>
              <Line
                data={{
                  labels: monthlyTrend.labels,
                  datasets: [
                    {
                      label: "Spend",
                      data: monthlyTrend.data,
                      borderColor: "#ec4899",
                      backgroundColor: "rgba(236,72,153,0.18)",
                      fill: true,
                      tension: 0.38,
                      borderWidth: 2,
                      pointRadius: 4,
                      pointBackgroundColor: "#ec4899",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { ticks: { callback: (val) => `৳${val}` }, grid: { color: "#f3f4f6" } },
                    x: { grid: { display: false } },
                  },
                }}
              />
            </div>

            <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">Most purchased products</h3>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  Top 5
                </span>
              </div>
              {topProducts.length === 0 ? (
                <EmptyState />
              ) : (
                <Bar
                  data={{
                    labels: topProducts.map((p) => p.name),
                    datasets: [
                      {
                        label: "Units",
                        data: topProducts.map((p) => p.qty),
                        backgroundColor: "#a855f733",
                        borderColor: "#a855f7",
                        borderWidth: 2,
                        borderRadius: 12,
                        borderSkipped: false,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true, grid: { color: "#f3f4f6" }, ticks: { precision: 0 } },
                      x: { grid: { display: false } },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const MetricCard = ({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tone: string;
}) => (
  <div className={`rounded-3xl bg-gradient-to-br ${tone} p-4 shadow-sm ring-1 ring-gray-100`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase text-gray-600">{label}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-gray-800 shadow-sm">
        {icon}
      </div>
    </div>
  </div>
);

const EmptyState = ({ message = "No data yet." }: { message?: string }) => (
  <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/60 p-6 text-center text-sm text-gray-600">
    {message}
  </div>
);

export default withCustomerAuth(CustomerAnalyticsPage);
