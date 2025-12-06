"use client";

import React from "react";
import withAdminAuth from "@/hoc/withAdminAuth";
import { getAllOrders } from "@/services/Orders";
import { TOrder } from "@/types/order";
import { formatBDT } from "@/utils/currency";
import Loader from "@/components/Loader";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Clock,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type CustomerMetric = {
  id: string;
  name: string;
  totalSpent: number;
  orders: number;
  firstOrder: Date;
  lastOrder: Date;
  daysSinceLast: number;
  avgOrderValue: number;
};

const CustomerInsightsPage = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getAllOrders();
        setOrders(res?.data || []);
      } catch (error) {
        console.error("Failed to load insights", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const customers = useMemo(() => {
    const map = new Map<string, CustomerMetric>();
    const now = new Date();

    orders.forEach((order) => {
      const userId = order.user?._id || "unknown";
      const name = order.user?.name || "Unknown customer";
      const created = new Date(order.createdAt);
      const current = map.get(userId);
      if (!current) {
        map.set(userId, {
          id: userId,
          name,
          totalSpent: order.totalAmount || 0,
          orders: 1,
          firstOrder: created,
          lastOrder: created,
          daysSinceLast: Math.round((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)),
          avgOrderValue: order.totalAmount || 0,
        });
      } else {
        const lastDate = current.lastOrder > created ? current.lastOrder : created;
        const firstDate = current.firstOrder < created ? current.firstOrder : created;
        const updatedTotal = current.totalSpent + (order.totalAmount || 0);
        const ordersCount = current.orders + 1;
        map.set(userId, {
          ...current,
          name,
          totalSpent: updatedTotal,
          orders: ordersCount,
          firstOrder: firstDate,
          lastOrder: lastDate,
          daysSinceLast: Math.round((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)),
          avgOrderValue: updatedTotal / ordersCount,
        });
      }
    });

    return Array.from(map.values());
  }, [orders]);

  const topSpenders = useMemo(
    () => [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5),
    [customers]
  );

  const churnRisk = useMemo(() => {
    return customers
      .filter((c) => c.daysSinceLast > 45 || (c.orders === 1 && c.daysSinceLast > 21))
      .sort((a, b) => b.daysSinceLast - a.daysSinceLast)
      .slice(0, 6);
  }, [customers]);

  const cohorts = useMemo(() => {
    const buckets: Record<string, { users: number; repeaters: number }> = {};
    customers.forEach((c) => {
      const key = `${c.firstOrder.getFullYear()}-${c.firstOrder.getMonth() + 1}`;
      if (!buckets[key]) buckets[key] = { users: 0, repeaters: 0 };
      buckets[key].users += 1;
      if (c.orders > 1) buckets[key].repeaters += 1;
    });
    return Object.entries(buckets)
      .map(([key, value]) => {
        const [y, m] = key.split("-").map(Number);
        const label = new Date(y, m - 1).toLocaleString("default", { month: "short", year: "numeric" });
        return { label, ...value };
      })
      .sort((a, b) => (a.label > b.label ? 1 : -1));
  }, [customers]);

  const summary = useMemo(() => {
    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const atRisk = churnRisk.length;
    const avgOrders = customers.length
      ? customers.reduce((sum, c) => sum + c.orders, 0) / customers.length
      : 0;
    return { totalCustomers, totalRevenue, atRisk, avgOrders };
  }, [customers, churnRisk]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Admin</p>
            <h1 className="text-2xl font-bold text-gray-900">Customer insights</h1>
            <p className="text-sm text-gray-600">
              Cohorts, top spenders, and churn risks to guide retention actions.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow">
            <BarChart3 size={16} />
            {summary.totalCustomers} customers
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total customers" value={summary.totalCustomers} icon={<Users size={18} />} tone="from-pink-50 to-amber-50" />
        <MetricCard label="Revenue (orders)" value={formatBDT(summary.totalRevenue)} icon={<ArrowUpRight size={18} />} tone="from-emerald-50 to-teal-50" />
        <MetricCard label="Avg orders / customer" value={summary.avgOrders.toFixed(1)} icon={<Clock size={18} />} tone="from-blue-50 to-indigo-50" />
        <MetricCard label="At-risk customers" value={summary.atRisk} icon={<AlertTriangle size={18} />} tone="from-rose-50 to-orange-50" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">Top spenders</h3>
            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
              Lifetime spend
            </span>
          </div>
          {topSpenders.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {topSpenders.map((c, idx) => (
                <div
                  key={c.id + idx}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">
                      {c.orders} orders · Last {c.daysSinceLast}d ago
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatBDT(c.totalSpent)}</p>
                    <p className="text-xs text-gray-500">
                      Avg {formatBDT(c.avgOrderValue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">Churn risk</h3>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              Needs outreach
            </span>
          </div>
          {churnRisk.length === 0 ? (
            <EmptyState message="No customers flagged as at-risk yet." />
          ) : (
            <div className="space-y-3">
              {churnRisk.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-rose-700 ring-1 ring-rose-100">
                      {c.orders} orders
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Last order {c.daysSinceLast} days ago · {formatBDT(c.totalSpent)} lifetime
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">Cohort view (by first order month)</h3>
          <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white shadow">
            Retention
          </span>
        </div>
        {cohorts.length === 0 ? (
          <EmptyState message="No cohorts yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-100">
              <thead className="bg-gray-900 text-white text-xs">
                <tr>
                  <th className="px-3 py-2 text-left">Cohort</th>
                  <th className="px-3 py-2 text-left">Customers</th>
                  <th className="px-3 py-2 text-left">Repeat buyers</th>
                  <th className="px-3 py-2 text-left">Retention rate</th>
                </tr>
              </thead>
              <tbody>
                {cohorts.map((c) => {
                  const rate = c.users ? (c.repeaters / c.users) * 100 : 0;
                  return (
                    <tr key={c.label} className="odd:bg-gray-50">
                      <td className="px-3 py-2 font-semibold text-gray-900">{c.label}</td>
                      <td className="px-3 py-2 text-gray-700">{c.users}</td>
                      <td className="px-3 py-2 text-gray-700">{c.repeaters}</td>
                      <td className="px-3 py-2 text-gray-700">{rate.toFixed(0)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
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

export default withAdminAuth(CustomerInsightsPage);
