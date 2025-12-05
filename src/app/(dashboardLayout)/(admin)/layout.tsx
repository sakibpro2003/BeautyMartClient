"use client";
import AdminSidebar from "@/components/modules/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
      <div className="mx-auto flex w-11/12 max-w-7xl flex-col gap-6 py-6 lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 overflow-hidden rounded-3xl bg-white/90 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
