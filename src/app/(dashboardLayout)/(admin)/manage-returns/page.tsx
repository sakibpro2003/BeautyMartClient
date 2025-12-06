"use client";

import { useEffect, useMemo, useState } from "react";
import withAdminAuth from "@/hoc/withAdminAuth";
import {
  fetchAdminReturns,
  fetchReasonAnalytics,
  updateReturnStatus,
} from "@/services/Returns";
import { ReturnRequest, ReturnReasonSummary, ReturnStatus } from "@/types/returns";
import { BadgeCheck, BarChart2, CheckCircle, RefreshCcw, RotateCcw, XCircle } from "lucide-react";
import { toast } from "react-toastify";

const statusOptions: ReturnStatus[] = ["pending", "approved", "denied", "refunded", "exchanged", "closed"];

const ManageReturnsPage = () => {
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [analytics, setAnalytics] = useState<ReturnReasonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [listRes, analyticsRes] = await Promise.all([fetchAdminReturns(), fetchReasonAnalytics()]);
    if (listRes?.success) setRequests(listRes.data);
    if (analyticsRes?.success) setAnalytics(analyticsRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const totals = useMemo(() => {
    const pending = requests.filter((r) => r.status === "pending").length;
    const approved = requests.filter((r) => r.status === "approved").length;
    const closed = requests.filter((r) => r.status === "refunded" || r.status === "exchanged").length;
    return { pending, approved, closed };
  }, [requests]);

  const applyStatus = async (id: string, status: ReturnStatus, resolutionNote?: string) => {
    setUpdatingId(id);
    const res = await updateReturnStatus(id, status, resolutionNote);
    if (res?.unauthorized) {
      toast.error("Admin access required.");
      setUpdatingId(null);
      return;
    }
    if (res?.success) {
      toast.success("Request updated");
      setRequests((prev) => prev.map((r) => (r._id === id ? res.data : r)));
    } else {
      toast.error(res?.message || "Failed to update");
    }
    setUpdatingId(null);
  };

  const statusTone = (status: ReturnStatus) => {
    if (status === "pending") return "bg-amber-100 text-amber-800";
    if (status === "approved") return "bg-blue-100 text-blue-800";
    if (status === "denied") return "bg-rose-100 text-rose-700";
    if (status === "refunded") return "bg-emerald-100 text-emerald-700";
    if (status === "exchanged") return "bg-indigo-100 text-indigo-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Returns</p>
            <h1 className="text-2xl font-bold text-gray-900">Returns / RMA desk</h1>
            <p className="text-sm text-gray-600">
              Intake requests from customers, approve or deny, and mark refunds or exchanges.
            </p>
          </div>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-100"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Pending" value={totals.pending} tone="from-amber-50 to-orange-50" />
        <MetricCard label="Approved" value={totals.approved} tone="from-blue-50 to-indigo-50" />
        <MetricCard label="Resolved (refund/exchange)" value={totals.closed} tone="from-emerald-50 to-teal-50" />
      </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">Queue</p>
              <h2 className="text-xl font-bold text-gray-900">Requests</h2>
            </div>
            <BadgeCheck className="text-pink-500" size={20} />
          </div>

          {loading ? (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-pink-200 bg-pink-50/60 p-8 text-sm text-gray-700">
              Loading requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/60 p-8 text-center text-sm text-gray-700">
              No return or exchange requests yet.
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => {
                const orderRef = req.order;
                const orderObject = typeof orderRef === "object" && orderRef !== null ? orderRef : null;
                const orderId = orderObject?._id ?? (typeof orderRef === "string" ? orderRef : "");
                const orderCustomer = orderObject?.user?.name;
                const orderStatus = orderObject?.status;

                return (
                  <div
                    key={req._id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          #{req._id} · {req.type.toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Order #{orderId || "N/A"}
                          {orderCustomer ? ` · ${orderCustomer}` : ""}
                          {orderStatus ? ` · ${orderStatus}` : ""} · {req.items.length} item(s)
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold ${statusTone(req.status)}`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-gray-700">
                      <p className="font-semibold">Reason: {req.reason}</p>
                      {req.notes && <p className="text-xs text-gray-500">Notes: {req.notes}</p>}
                      {req.resolutionNote && (
                        <p className="text-xs text-gray-500">Resolution: {req.resolutionNote}</p>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {statusOptions.map((s) => (
                        <button
                          key={s}
                          onClick={() => applyStatus(req._id!, s)}
                          disabled={updatingId === req._id}
                          className={`rounded-full border px-3 py-1 text-[12px] font-semibold transition ${
                            req.status === s
                              ? "border-pink-300 bg-pink-50 text-pink-700"
                              : "border-gray-200 bg-white text-gray-700 hover:border-pink-200"
                          } disabled:cursor-not-allowed`}
                        >
                          {updatingId === req._id ? "..." : s}
                        </button>
                      ))}
                      <button
                        onClick={() =>
                          applyStatus(
                            req._id!,
                            req.type === "refund" ? "refunded" : "exchanged",
                            req.type === "refund" ? "Refund processed" : "Exchange arranged"
                          )
                        }
                        disabled={updatingId === req._id}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-[12px] font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
                      >
                        {req.type === "refund" ? <WalletIcon /> : <RotateCcw size={14} />}
                        {req.type === "refund" ? "Mark refunded" : "Mark exchanged"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
                Reasons
              </p>
              <h2 className="text-xl font-bold text-gray-900">Reason analytics</h2>
              <p className="text-sm text-gray-600">Top reasons customers request refunds/exchanges.</p>
            </div>
            <BarChart2 className="text-pink-500" size={20} />
          </div>

          {analytics.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/60 p-6 text-center text-sm text-gray-600">
              No data yet.
            </div>
          ) : (
            <div className="space-y-2">
              {analytics.map((row) => (
                <div
                  key={row.reason}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm"
                >
                  <span className="font-semibold text-gray-800">{row.reason}</span>
                  <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                    {row.count} requests
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, tone }: { label: string; value: number; tone: string }) => (
  <div
    className={`rounded-2xl bg-gradient-to-br ${tone} p-4 shadow-sm ring-1 ring-gray-100 flex items-center justify-between`}
  >
    <div>
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
    <CheckCircle className="text-pink-500" size={20} />
  </div>
);

const WalletIcon = () => <CheckCircle className="text-white" size={14} />;

export default withAdminAuth(ManageReturnsPage);
