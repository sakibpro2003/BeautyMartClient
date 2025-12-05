/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import { getAllProducts, logout } from "@/services/AuthService";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteSingleProduct } from "@/services/Products";
import withAdminAuth from "@/hoc/withAdminAuth";

const ManageMedicines = () => {
  const router = useRouter();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMedId, setSelectedMedId] = useState<string | null>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await getAllProducts();
      setMedicines(response?.data || []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedMedId) return;
    try {
      await deleteSingleProduct(selectedMedId);
      setSelectedMedId(null);
      fetchMedicines();
    } catch (error) {
      console.error("Error deleting medicine:", error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const totalPages = Math.ceil(medicines.length / itemsPerPage);
  const paginatedMeds = medicines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Admin</p>
            <h1 className="text-2xl font-bold text-gray-900">Manage products</h1>
            <p className="text-sm text-gray-600">Edit, update, or remove inventory items.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm font-semibold">
            <Link
              href={"/create-new-medicine"}
              className="rounded-xl bg-gradient-to-r from-pink-600 to-orange-500 px-4 py-2 text-white shadow-lg shadow-pink-200/60 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Add new product
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {medicines.length === 0 ? (
        <div className="rounded-3xl bg-white/90 p-10 text-center shadow-sm ring-1 ring-gray-100">
          <p className="text-lg font-semibold text-gray-800">No products available</p>
          <p className="text-sm text-gray-600 mt-2">Create a product to populate this list.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paginatedMeds.map((med) => (
              <div
                key={med._id}
                className="rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 via-white to-amber-50 ring-1 ring-pink-100/70">
                    <Image
                      fill
                      unoptimized
                      src={med.image && med.image.startsWith("http") ? med.image : "/placeholder.jpg"}
                      alt={med.name || "No Image"}
                      className="object-contain"
                      sizes="120px"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2">{med.name}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{med.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="rounded-full bg-gray-100 px-2 py-1 font-semibold">
                        ${med.price}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2 py-1 font-semibold">
                        {med.quantity} pcs
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-700">
                      {med.manufacturer?.name || "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <Link
                    className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-100"
                    href={`/update/${med._id}`}
                  >
                    Update
                  </Link>
                  <button
                    className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                    onClick={() => setSelectedMedId(med._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-white/90 p-4 text-sm text-gray-700 shadow-sm ring-1 ring-gray-100">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedMedId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-black p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-lg font-semibold">Confirm Delete</h2>
            <p>Are you sure you want to delete this medicine?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="btn border-none rounded-sm shadow-none"
                onClick={() => setSelectedMedId(null)}
              >
                Cancel
              </button>
              <button
                className="btn border-none rounded-sm shadow-none bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAdminAuth(ManageMedicines);
