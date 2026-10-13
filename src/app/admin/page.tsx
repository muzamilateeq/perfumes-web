import { Suspense } from "react";
import { Metadata } from "next";
import { getAdminDataAction, verifyAdminSession } from "@/app/actions/admin";
import AdminDashboardClient from "./AdminDashboardClient";
import AdminLoginClient from "./AdminLoginClient";
import { DEFAULT_STORE_SETTINGS } from "@/lib/storeTypes";
import { PERFUMES_DATA } from "@/lib/perfumes";

export const metadata: Metadata = {
  title: "Executive Portal & Control Center | Aura Haute Parfumerie",
  description: "Official administrative management system for Aura Fragrances. Full control of products, orders, olfactory pyramids, and store configurations.",
};

async function AdminContent() {
  const isAuthenticated = await verifyAdminSession();

  if (!isAuthenticated) {
    return <AdminLoginClient />;
  }

  const data = await getAdminDataAction();

  return (
    <AdminDashboardClient
      initialProducts={data.products || PERFUMES_DATA}
      initialSettings={data.settings || DEFAULT_STORE_SETTINGS}
      initialOrders={data.orders || []}
    />
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center text-xs font-mono text-zinc-400">
          Verifying security session...
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
