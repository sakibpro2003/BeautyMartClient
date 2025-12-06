
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShoppingBag, Home, RotateCcw, MessageCircle, LineChart } from "lucide-react";

const CustomerSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Analytics", path: "/customer-analytics", icon: LineChart },
    { name: "My Orders", path: "/my-orders", icon: ShoppingBag },
    { name: "Returns & Exchanges", path: "/returns", icon: RotateCcw },
    { name: "Support & Feedback", path: "/support", icon: MessageCircle },
  ];

  return (
    <aside className="relative w-full lg:w-72 lg:sticky lg:top-6 lg:self-start">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-[0_20px_80px_rgba(0,0,0,0.2)]" />
      <div className="relative rounded-3xl px-4 py-5 text-white lg:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold lg:text-xl">Customer Dashboard</h2>
          <button
            className="inline-flex items-center justify-center rounded-xl bg-white/10 p-2 text-white lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div className={`${isOpen ? "mt-4" : "hidden lg:block lg:mt-6"}`}>
          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => {
                const active = pathname === item.path;
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        active
                          ? "bg-white text-gray-900 shadow-lg shadow-gray-900/20"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm ${
                          active ? "bg-gray-900 text-white" : "bg-white/10 text-white"
                        }`}
                      >
                        <Icon size={18} />
                      </span>
                      <span className={`${active ? "text-gray-900" : "text-white"}`}>
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default CustomerSidebar;


