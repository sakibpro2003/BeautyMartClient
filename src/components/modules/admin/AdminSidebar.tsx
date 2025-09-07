// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const AdminSidebar = () => {
//   const pathname = usePathname();

//   const navItems = [
//     { name: "Manage Medicines", path: "/manage-medicines" },
//     { name: "Manage Orders", path: "/manage-orders" },
//     { name: "Manage Users", path: "/manage-users" },
//     { name: "Manage Payments", path: "/manage-payments" },
//   ];

//   return (
//     <aside className="bg-gray-800 text-white p-6">
//       <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
//       <nav>
//         <ul className="space-y-4">
//           {navItems.map((item) => (
//             <li key={item.path}>
//               <Link
//                 href={item.path}
//                 className={`block px-4 py-2 rounded transition ${
//                   pathname === item.path ? "bg-gray-700" : "hover:bg-gray-700"
//                 }`}
//               >
//                 {item.name}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </aside>
//   );
// };

// export default AdminSidebar;


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Manage Medicines", path: "/manage-medicines" },
    { name: "Manage Orders", path: "/manage-orders" },
    { name: "Manage Users", path: "/manage-users" },
    { name: "Manage Payments", path: "/manage-payments" },
    { name: "Home", path: "/" },
  ];

  return (
    <aside className="bg-black text-white p-4 z-50 lg:p-6 md:w-64 w-full md:block fixed md:relative">
      {/* Toggle Button for Mobile */}
      <div className="flex items-center justify-between md:justify-start">
        <h2 className="text-lg lg:text-xl font-bold">Admin Dashboard</h2>
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`mt-4 md:block ${isOpen ? "block" : "hidden"}`}>
        <nav>
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`block px-4 py-2 rounded transition ${
                    pathname === item.path ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
