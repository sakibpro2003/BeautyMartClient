
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const CustomerSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "My Orders", path: "/my-orders" },
    // { name: "Profile", path: "/profile" },
  ];

  return (
    <aside className="bg-black text-white p-1 z-50 lg:p-6 md:w-64 w-full md:block fixed md:relative">
      <div className="flex justify-start items-start content-start">
      <button
        className="md:hidden text-white flex items-center justify-between w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <h2 className="w-full lg:text-xl font-bold lg:mb-6 lg:mt-4 md:mt-0">Customer Dashboard</h2>
      </div>


     
      <div className={`md:block ${isOpen ? "block" : "hidden"}`}>
        <nav>
          <ul className="lg:space-y-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`block px-4 lg:py-2 rounded transition text-white ${
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

export default CustomerSidebar;


