"use client";

import withAdminAuth from "@/hoc/withAdminAuth";
import { getAllProducts } from "@/services/AuthService";
import { updateProduct } from "@/services/Products";
import { TProduct } from "@/types/product";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  AlertTriangle,
  Boxes,
  CheckCircle,
  Clock,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

const LOW_STOCK_THRESHOLD = 10;
const TARGET_STOCK = 40;

const InventoryPage = () => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulkLoading, setBulkLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      setProducts(res?.data || []);
    } catch (error) {
      console.error("Failed to load inventory", error);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const metrics = useMemo(() => {
    const total = products.length;
    const lowStock = products.filter((p) => p.quantity <= LOW_STOCK_THRESHOLD).length;
    const outOfStock = products.filter((p) => !p.inStock || p.quantity === 0).length;
    const healthy = total - lowStock - outOfStock;
    return { total, lowStock, outOfStock, healthy: Math.max(healthy, 0) };
  }, [products]);

  const lowStockProducts = useMemo(
    () =>
      [...products]
        .filter((p) => p.quantity <= LOW_STOCK_THRESHOLD)
        .sort((a, b) => a.quantity - b.quantity),
    [products]
  );

  const leadTime = (idx: number) => {
    const slots = [5, 7, 10];
    return slots[idx % slots.length];
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const bulkUpdateStock = async (markInStock: boolean) => {
    if (selectedIds.length === 0) {
      toast.info("Select at least one product");
      return;
    }
    setBulkLoading(true);

    try {
      const map = new Map(products.map((p) => [p._id, p]));
      const updates = selectedIds.map(async (id) => {
        const prod = map.get(id);
        if (!prod) return;
        const payload: TProduct = { ...prod, inStock: markInStock };
        return updateProduct(payload, id);
      });
      await Promise.all(updates);
      toast.success("Stock status updated");
      setSelectedIds([]);
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update stock");
    } finally {
      setBulkLoading(false);
    }
  };

  const metricCards = [
    {
      label: "Total SKUs",
      value: metrics.total,
      icon: <Boxes size={18} />,
      tone: "from-pink-100 to-amber-50 text-pink-700",
    },
    {
      label: "Low stock",
      value: metrics.lowStock,
      icon: <AlertTriangle size={18} />,
      tone: "from-amber-50 to-orange-50 text-amber-700",
    },
    {
      label: "Out of stock",
      value: metrics.outOfStock,
      icon: <ShieldCheck size={18} />,
      tone: "from-rose-50 to-rose-100 text-rose-700",
    },
    {
      label: "Healthy",
      value: metrics.healthy,
      icon: <CheckCircle size={18} />,
      tone: "from-emerald-50 to-teal-50 text-emerald-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Admin</p>
            <h1 className="text-2xl font-bold text-gray-900">Inventory overview</h1>
            <p className="text-sm text-gray-600">
              Monitor low stock, lead times, and bulk update availability.
            </p>
          </div>
          <button
            onClick={fetchProducts}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-100"
            disabled={loading}
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
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

      <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Low-stock alerts</h3>
            <p className="text-sm text-gray-600">
              Items at or below {LOW_STOCK_THRESHOLD} units with suggested reorder amounts.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => bulkUpdateStock(true)}
              disabled={bulkLoading}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60"
            >
              {bulkLoading ? "Updating..." : "Mark in stock"}
            </button>
            <button
              onClick={() => bulkUpdateStock(false)}
              disabled={bulkLoading}
              className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-700 disabled:opacity-60"
            >
              {bulkLoading ? "Updating..." : "Mark out of stock"}
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-pink-50/60">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  <input
                    type="checkbox"
                    checked={
                      lowStockProducts.length > 0 &&
                      selectedIds.length === lowStockProducts.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? lowStockProducts.map((p) => p._id || "") : []
                      )
                    }
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Qty
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Reorder suggestion
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Lead time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lowStockProducts.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                    No low-stock products right now.
                  </td>
                </tr>
              ) : (
                lowStockProducts.map((product, idx) => {
                  const reorderAmount = Math.max(TARGET_STOCK - product.quantity, 0);
                  return (
                    <tr key={product._id || product.name}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(product._id || "")}
                          onChange={() => toggleSelection(product._id || "")}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {product.manufacturer?.name || "Unknown brand"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{product.quantity}</td>
                      <td className="px-4 py-3 text-gray-800">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={14} className="text-amber-500" />
                          <span className="font-semibold">
                            Order {reorderAmount} pcs
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Target stock: {TARGET_STOCK} pcs
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-gray-500" />
                          <span className="font-semibold">{leadTime(idx)} days</span>
                        </div>
                        <p className="text-xs text-gray-500">Estimated supplier lead time</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            product.inStock
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {product.inStock ? "In stock" : "Out of stock"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(InventoryPage);
