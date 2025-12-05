"use client";

import withAdminAuth from "@/hoc/withAdminAuth";
import { getAllOrders } from "@/services/Orders";
import { TOrder } from "@/types/order";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";
import { LineChart, TrendingUp, Wallet, Clock, ShoppingBag } from "lucide-react";
import Loader from "@/components/Loader";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const formatBDT = (value: number) =>
  `BDT ${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

const AdminAnalyticsPage = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getAllOrders();
        setOrders(res?.data || []);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const metrics = useMemo(() => {
    if (!orders.length) {
      return {
        revenue: 0,
        avgOrder: 0,
        pending: 0,
        totalOrders: 0,
      };
    }

    const revenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pending = orders.filter(
      (order) => order.status === "pending" || order.status === "processing"
    ).length;
    return {
      revenue,
      avgOrder: revenue / orders.length || 0,
      pending,
      totalOrders: orders.length,
    };
  }, [orders]);

  const trendData = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }).map((_, idx) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
      return `${date.getFullYear()}-${date.getMonth() + 1}`;
    });

    const revenueByMonth: Record<string, number> = {};
    months.forEach((m) => (revenueByMonth[m] = 0));

    orders.forEach((order) => {
      const created = new Date(order.createdAt);
      const key = `${created.getFullYear()}-${created.getMonth() + 1}`;
      if (key in revenueByMonth) {
        revenueByMonth[key] += order.totalAmount || 0;
      }
    });

    const labels = months.map((m) => {
      const [year, month] = m.split("-").map(Number);
      return new Date(year, month - 1).toLocaleString("default", { month: "short" });
    });

    const data = months.map((m) => revenueByMonth[m]);

    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data,
          borderColor: "#ec4899",
          backgroundColor: "rgba(236,72,153,0.18)",
          fill: true,
          tension: 0.38,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: "#ec4899",
        },
      ],
    };
  }, [orders]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      const status = (order.status || "pending").toLowerCase();
      if (status in counts) counts[status] += 1;
    });

    return {
      labels: ["Pending", "Processing", "Completed", "Cancelled"],
      datasets: [
        {
          label: "Orders",
          data: [
            counts.pending,
            counts.processing,
            counts.completed,
            counts.cancelled,
          ],
          backgroundColor: ["#fb7185", "#fb923c", "#22c55e", "#f87171"],
          borderWidth: 0,
        },
      ],
    };
  }, [orders]);

  const topProducts = useMemo(() => {
    const productTotals: Record<string, { name: string; qty: number }> = {};

    orders.forEach((order) => {
      order.products.forEach((p) => {
        const id = p.product?._id || p._id;
        if (!id) return;
        if (!productTotals[id]) {
          productTotals[id] = {
            name: p.product?.name || "Unnamed",
            qty: 0,
          };
        }
        productTotals[id].qty += p.quantity || 0;
      });
    });

    const sorted = Object.values(productTotals)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    const palette = ["#f472b6", "#fb923c", "#60a5fa", "#34d399", "#a78bfa"];

    return {
      labels: sorted.map((p) => p.name),
      datasets: [
        {
          label: "Units sold",
          data: sorted.map((p) => p.qty),
          backgroundColor: sorted.map((_, idx) => palette[idx % palette.length] + "33"),
          borderColor: sorted.map((_, idx) => palette[idx % palette.length]),
          borderWidth: 2,
          borderRadius: 12,
          borderSkipped: false,
          barThickness: 32,
        },
      ],
    };
  }, [orders]);

  const metricCards = [
    {
      label: "Total revenue",
      value: metrics.revenue ? formatBDT(metrics.revenue) : "BDT 0",
      icon: <Wallet size={18} />,
      tone: "from-pink-100 to-amber-50 text-pink-700",
    },
    {
      label: "Average order",
      value: metrics.avgOrder ? formatBDT(metrics.avgOrder) : "BDT 0",
      icon: <TrendingUp size={18} />,
      tone: "from-blue-50 to-indigo-50 text-blue-700",
    },
    {
      label: "Open orders",
      value: metrics.pending,
      icon: <Clock size={18} />,
      tone: "from-amber-50 to-orange-50 text-amber-700",
    },
    {
      label: "Total orders",
      value: metrics.totalOrders,
      icon: <ShoppingBag size={18} />,
      tone: "from-emerald-50 to-teal-50 text-emerald-700",
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Admin</p>
            <h1 className="text-2xl font-bold text-gray-900">Sales analytics</h1>
            <p className="text-sm text-gray-600">
              Monitor revenue trends, product performance, and order health.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow">
            <LineChart size={16} />
            Live metrics
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-3xl bg-gradient-to-br ${card.tone} p-4 shadow-sm ring-1 ring-pink-100/60`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-600">{card.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-gray-800 shadow-sm">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">Revenue (last 6 months)</h3>
            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
              Trend
            </span>
          </div>
          {orders.length ? (
            <Line
              data={trendData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  y: { ticks: { callback: (val) => `BDT ${val}` }, grid: { color: "#f3f4f6" } },
                  x: { grid: { display: false } },
                },
              }}
            />
          ) : (
            <div className="py-16 text-center text-sm text-gray-500">No revenue data yet.</div>
          )}
        </div>

        <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">Order status mix</h3>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              Live
            </span>
          </div>
          {orders.length ? (
            <Doughnut
              data={statusData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "bottom" },
                },
              }}
            />
          ) : (
            <div className="py-16 text-center text-sm text-gray-500">No orders yet.</div>
          )}
        </div>
      </div>

      <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">Top products</h3>
          <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white shadow">
            Units sold
          </span>
        </div>
        {orders.length && topProducts.labels.length ? (
          <Bar
            data={topProducts}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: "#f3f4f6" },
                  ticks: { color: "#4b5563", precision: 0 },
                },
                x: {
                  grid: { display: false },
                  ticks: { color: "#6b7280" },
                },
              },
              hover: { mode: "nearest", intersect: true },
              animation: { duration: 600, easing: "easeOutQuart" },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.parsed.y} units`,
                  },
                },
              },
            }}
          />
        ) : (
          <div className="py-12 text-center text-sm text-gray-500">No product sales yet.</div>
        )}
      </div>
    </div>
  );
};

export default withAdminAuth(AdminAnalyticsPage);
