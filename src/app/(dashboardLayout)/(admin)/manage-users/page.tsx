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
    <div className="overflow-x-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <table className="table w-full border border-gray-200 shadow-md">
        <thead className="bg-black text-white">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Status</th>
            <th>View Order</th>
          </tr>
        </thead>

        <tbody>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user: TUser, index) => (
              <tr
                key={user._id}
                className={`${user.isBlocked ? "bg-red-100" : ""}`}
              >
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className="capitalize">{user?.role}</td>
                <td>{user.phone || "No Phone"}</td>
                <td>
                  <span
                    className={`badge ${user?.isBlocked ? "badge-error" : "badge-success"}`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => router.push(`/${user.email}`)}
                    className="btn btn-sm btn-custom"
                  >
                    Order History
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="btn-custom disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="btn-custom disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default withAdminAuth(ManageUsers);
