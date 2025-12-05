"use client";

import withAdminAuth from "@/hoc/withAdminAuth";
import { getAllUsers } from "@/services/Admin";
import { TUser } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ManageUsers = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Admin</p>
            <h1 className="text-2xl font-bold text-gray-900">Manage users</h1>
            <p className="text-sm text-gray-600">Monitor roles, status, and order access.</p>
          </div>
          <div className="rounded-2xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow">
            Total users: {users.length}
          </div>
        </div>
      </div>

      {paginatedUsers.length === 0 ? (
        <div className="rounded-3xl bg-white/90 p-10 text-center shadow-sm ring-1 ring-gray-100">
          <p className="text-lg font-semibold text-gray-800">No users found</p>
          <p className="text-sm text-gray-600 mt-2">New users will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paginatedUsers.map((user: TUser, index) => (
            <div
              key={user._id}
              className="rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">
                    #{(currentPage - 1) * itemsPerPage + index + 1}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    user.isBlocked
                      ? "bg-rose-100 text-rose-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
                <span className="rounded-full bg-gray-100 px-3 py-1 capitalize">{user?.role}</span>
                <span className="rounded-full bg-gray-100 px-3 py-1">
                  {user.phone || "No phone"}
                </span>
              </div>

              <button
                onClick={() => router.push(`/${user.email}`)}
                className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
              >
                View order history
              </button>
            </div>
          ))}
        </div>
      )}

      {users.length > itemsPerPage && (
        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl bg-white/90 p-4 text-sm text-gray-700 shadow-sm ring-1 ring-gray-100 md:flex-row">
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
      )}
    </div>
  );
};

export default withAdminAuth(ManageUsers);
