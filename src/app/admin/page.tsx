import { Metadata } from "next";
import { getAdminDataAction } from "@/app/actions/admin";
import AdminDashboardClient from "./AdminDashboardClient";
import { DEFAULT_STORE_SETTINGS } from "@/lib/storeManager";
import { PERFUMES_DATA } from "@/lib/perfumes";

export const metadata: Metadata = {
  title: "Executive Portal & Control Center | Aura Haute Parfumerie",
  description: "Official administrative management system for Aura Fragrances. Full control of products, orders, olfactory pyramids, and store configurations.",
};

export default async function AdminPage() {
  const data = await getAdminDataAction();

  return (
    <AdminDashboardClient
      initialProducts={data.products || PERFUMES_DATA}
      initialSettings={data.settings || DEFAULT_STORE_SETTINGS}
      initialOrders={data.orders || []}
    />
  );
}
