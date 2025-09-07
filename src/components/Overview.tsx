// components/OverviewCard.tsx
import { ShoppingCart, Users, DollarSign, Package } from "lucide-react";

export const Overview = () => {
  return (
    <>
      <h2 className="text-3xl mt-10  text-center font-bold">Overview</h2>
      <div className="grid w-11/12 mb-10 mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {/* Orders Card */}
        <div className="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm text-gray-500">Total Orders</h4>
            <p className="text-2xl font-bold text-gray-800">1,284</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
            <ShoppingCart className="text-white w-6 h-6" />
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm text-gray-500">Revenue</h4>
            <p className="text-2xl font-bold text-gray-800">$23,420</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
            <DollarSign className="text-white w-6 h-6" />
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm text-gray-500">Customers</h4>
            <p className="text-2xl font-bold text-gray-800">912</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
            <Users className="text-white w-6 h-6" />
          </div>
        </div>

        {/* Medicines Card */}
        <div className="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm text-gray-500">Medicines</h4>
            <p className="text-2xl font-bold text-gray-800">385</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
            <Package className="text-white w-6 h-6" />
          </div>
        </div>
      </div>
    </>
  );
};
