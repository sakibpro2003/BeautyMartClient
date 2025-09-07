"use client";
import CustomerSidebar from "@/components/modules/customer/CustomerSidebar";
import { ToastContainer } from "react-toastify";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <ToastContainer />
      <div className="flex flex-grow overflow-hidden">
        <CustomerSidebar />
        <main className="flex-grow p-6 bg-gray-50 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
