"use client";

import withAdminAuth from "@/hoc/withAdminAuth";
import { Promotion } from "../../../../../data/promotions";
import { createPromotion, fetchPromotions, updatePromotion } from "@/services/Promotions";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { BadgePercent, CalendarClock, RefreshCcw, TrendingUp, Users } from "lucide-react";

const emptyPromotion: Promotion = {
  id: "",
  name: "",
  code: "",
  description: "",
  discountType: "percentage",
  value: 10,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: "",
  usageLimit: 100,
  usedCount: 0,
  minimumOrder: 0,
};

type FormState = Promotion;

const getStatus = (promo: Promotion) => {
  const now = new Date();
  const start = new Date(promo.startDate);
  const end = promo.endDate ? new Date(promo.endDate) : null;
  if (end && now > end) return "Expired";
  if (now < start) return "Scheduled";
  return "Active";
};

const AdminPromotionsPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [form, setForm] = useState<FormState>({ ...emptyPromotion, id: crypto.randomUUID() });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const normalizePromos = (list: Promotion[]) =>
    (list || []).map((p) => ({
      ...p,
      id: p._id || p.id || crypto.randomUUID(),
    }));

  useEffect(() => {
    const refresh = async () => {
      const data = await fetchPromotions();
      setPromotions(normalizePromos(data));
    };
    refresh();
  }, []);

  const metrics = useMemo(() => {
    const active = promotions.filter((p) => getStatus(p) === "Active").length;
    const scheduled = promotions.filter((p) => getStatus(p) === "Scheduled").length;
    const expired = promotions.filter((p) => getStatus(p) === "Expired").length;
    const totalRedemptions = promotions.reduce((sum, p) => sum + (p.usedCount || 0), 0);
    return { active, scheduled, expired, totalRedemptions };
  }, [promotions]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "value" || name === "usageLimit" || name === "minimumOrder" ? Number(value) : value,
    }));
  };

  const handleEdit = (promo: Promotion) => {
    const normalizedId = promo._id || promo.id;
    setEditingId(normalizedId || null);
    setForm({ ...promo, id: normalizedId || promo.id });
  };

  const handleReset = () => {
    setEditingId(null);
    setForm({ ...emptyPromotion, id: crypto.randomUUID() });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code) {
      toast.error("Name and code are required.");
      return;
    }

    const code = form.code.trim().toUpperCase();
    const promo: Promotion = {
      ...form,
      id: editingId || form.id || crypto.randomUUID(),
      code,
      usedCount: form.usedCount || 0,
      minimumOrder: Number(form.minimumOrder) || 0,
    };

    setLoading(true);
    try {
      if (editingId) {
        const res = await updatePromotion(editingId, promo);
        if (res?.success) {
          toast.success("Promotion updated");
        } else {
          toast.error(res?.message || "Update failed");
        }
      } else {
        const res = await createPromotion(promo);
        if (res?.success) {
          toast.success("Promotion created");
        } else {
          toast.error(res?.message || "Creation failed");
        }
      }
      const refreshed = await fetchPromotions();
      setPromotions(normalizePromos(refreshed));
      handleReset();
    } finally {
      setLoading(false);
    }
  };

  const progress = (p: Promotion) => {
    const limit = p.usageLimit || 1;
    return Math.min(100, Math.round(((p.usedCount || 0) / limit) * 100));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Admin</p>
            <h1 className="text-2xl font-bold text-gray-900">Promotions & coupons</h1>
            <p className="text-sm text-gray-600">
              Create scheduled campaigns, set usage limits, and track performance.
            </p>
          </div>
          <button
            onClick={async () => setPromotions(normalizePromos(await fetchPromotions()))}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-100"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active" value={metrics.active} tone="from-emerald-50 to-teal-50" icon={<TrendingUp size={18} />} />
        <MetricCard label="Scheduled" value={metrics.scheduled} tone="from-blue-50 to-indigo-50" icon={<CalendarClock size={18} />} />
        <MetricCard label="Expired" value={metrics.expired} tone="from-rose-50 to-rose-100" icon={<BadgePercent size={18} />} />
        <MetricCard label="Total redemptions" value={metrics.totalRedemptions} tone="from-amber-50 to-orange-50" icon={<Users size={18} />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">
              {editingId ? "Edit promotion" : "Create promotion"}
            </h3>
            <button
              onClick={handleReset}
              className="text-sm font-semibold text-pink-600 hover:text-pink-700"
            >
              Reset
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-800">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                placeholder="Spring Glow Sale"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">Code</label>
              <input
                name="code"
                value={form.code}
                onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                placeholder="SAVE20"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">Discount</label>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <input
                  type="number"
                  name="value"
                  value={form.value}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                  min={0}
                  step="0.01"
                  required
                />
                <select
                  name="discountType"
                  value={form.discountType}
                  onChange={handleChange}
                  className="rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                >
                  <option value="percentage">% off</option>
                  <option value="fixed">$ off</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">Usage limit</label>
              <input
                type="number"
                name="usageLimit"
                value={form.usageLimit}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                min={1}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">Start date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">End date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">Min order ($)</label>
              <input
                type="number"
                name="minimumOrder"
                value={form.minimumOrder}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                min={0}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-800">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                rows={3}
                placeholder="What is this promotion about?"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200/60 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60"
              >
                {loading ? "Saving..." : editingId ? "Update promotion" : "Create promotion"}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Live promotions</h3>
            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white shadow">
              {promotions.length} total
            </span>
          </div>
          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {promotions.length === 0 ? (
              <p className="text-sm text-gray-500">No promotions yet.</p>
            ) : (
              promotions.map((promo) => {
                const status = getStatus(promo);
                const pct = progress(promo);
                return (
                  <div
                    key={promo.id}
                    className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{promo.name}</p>
                        <p className="text-xs text-gray-500">{promo.code}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : status === "Scheduled"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-600 line-clamp-2">{promo.description}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-gray-700">
                      <span className="rounded-full bg-pink-50 px-2 py-1 text-pink-700">
                        {promo.discountType === "percentage"
                          ? `${promo.value}% off`
                          : `$${promo.value} off`}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2 py-1">
                        {promo.usedCount}/{promo.usageLimit} used
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-gray-500">
                        <span>
                          {promo.startDate} - {promo.endDate || "No end"}
                        </span>
                        <span>{pct}% used</span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-orange-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleEdit(promo)}
                        className="text-xs font-semibold text-pink-600 hover:text-pink-700"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: number;
  tone: string;
  icon: React.ReactNode;
}) => (
  <div className={`rounded-3xl bg-gradient-to-br ${tone} p-4 shadow-sm ring-1 ring-pink-100/60`}>
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

export default withAdminAuth(AdminPromotionsPage);
