/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserSpecificOrder } from "@/services/Orders";
import { TOrder } from "@/types/order";
import Image from "next/image";

const Page = async ({ params }: any) => {
  const { orderId } = await params;
  const orders = await getUserSpecificOrder(orderId);

  return (
    <div className="p-6 mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Order History</h1>

      <div className="overflow-auto w-full">
        <div className="min-w-[800px]">
          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-black text-white text-xs">
              <tr>
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Customer</th>
                <th className="border px-3 py-2">Total ($)</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Created At</th>
                <th className="border px-3 py-2">Updated At</th>
                <th className="border px-3 py-2">Products</th>
              </tr>
            </thead>
            <tbody>
              {orders?.data?.length > 0 ? (
                orders.data.map((order: TOrder, index: number) => (
                  <tr
                    key={order._id}
                    className="text-center hover:bg-gray-100 transition"
                  >
                    <td className="border px-3 py-2">{index + 1}</td>
                    <td className="border px-3 py-2">{order?.user?.name}</td>
                    <td className="border px-3 py-2 font-semibold">
                      ${order.totalAmount}
                    </td>
                    <td
                      className={`border px-3 py-2 font-bold uppercase rounded-lg text-xs${
                        order.status === "pending"
                          ? "text-yellow-500"
                          : order.status === "processing"
                            ? "text-blue-500"
                            : order.status === "completed"
                              ? "text-green-500"
                              : "text-red-500"
                      }`}
                    >
                      {order.status}
                    </td>
                    <td className="border px-3 py-2 text-xs text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="border px-3 py-2 text-xs text-gray-600">
                      {new Date(order.updatedAt).toLocaleString()}
                    </td>
                    <td className="border px-3 py-2 text-left">
                      {order.products.map((product, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-2 border-b py-2"
                        >
                          <Image
                            width={40}
                            height={40}
                            src={product?.product?.image || "link"}
                            alt={product?.product?.name}
                            className="rounded shadow-md"
                            unoptimized
                          />
                          <div className="text-left">
                            <p className="font-semibold text-gray-700">
                              {product?.product?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {product?.quantity} | ${product?.totalPrice}
                            </p>
                          </div>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;
