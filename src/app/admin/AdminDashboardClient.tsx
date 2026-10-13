"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ShoppingBag, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Star, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  ArrowRight, 
  Search, 
  SlidersHorizontal, 
  ExternalLink, 
  Save, 
  RefreshCw, 
  AlertCircle, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  X,
  Phone,
  Settings,
  Layers,
  Clock,
  Compass,
  CheckCircle2,
  XCircle,
  TruckIcon,
  Printer,
  Copy,
  ChevronRight,
  Droplets,
  Calendar,
  User,
  MapPin,
  CreditCard,
  LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PerfumeItem, PERFUMES_DATA } from "@/lib/perfumes";
import { StoreSettings, StoreOrder } from "@/lib/storeTypes";
import { 
  saveProductAction, 
  deleteProductAction, 
  saveSettingsAction, 
  updateOrderStatusAction,
  logoutAdminAction 
} from "@/app/actions/admin";

interface AdminDashboardClientProps {
  initialProducts: PerfumeItem[];
  initialSettings: StoreSettings;
  initialOrders: StoreOrder[];
}

export default function AdminDashboardClient({
  initialProducts,
  initialSettings,
  initialOrders,
}: AdminDashboardClientProps) {
  const router = useRouter();

  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "settings" | "content">("overview");

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out of the Executive Portal?")) {
      await logoutAdminAction();
      router.refresh();
    }
  };

  // State
  const [products, setProducts] = useState<PerfumeItem[]>(initialProducts);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [orders, setOrders] = useState<StoreOrder[]>(initialOrders);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Product Editing / Modal State
  const [editingProduct, setEditingProduct] = useState<PerfumeItem | null>(null);
  const [isAddMode, setIsAddMode] = useState<boolean>(false);
  const [productSearch, setProductSearch] = useState<string>("");
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>("All");

  // Orders State
  const [orderSearch, setOrderSearch] = useState<string>("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("All");
  const [viewingOrderInvoice, setViewingOrderInvoice] = useState<StoreOrder | null>(null);

  // Inline Quick Price Edit State
  const [quickPriceEditingId, setQuickPriceEditingId] = useState<number | null>(null);
  const [quickPriceValue, setQuickPriceValue] = useState<string>("");

  // Loading States
  const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Statistics Calculations
  const totalRevenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === "PENDING").length;
  const confirmedOrdersCount = orders.filter((o) => o.status === "CONFIRMED").length;
  const shippedOrdersCount = orders.filter((o) => o.status === "SHIPPED").length;
  const deliveredOrdersCount = orders.filter((o) => o.status === "DELIVERED").length;

  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / (orders.length || 1)) : 0;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.notes.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter === "All" || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const q = orderSearch.toLowerCase();
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.toLowerCase().includes(q) ||
      o.customerCity.toLowerCase().includes(q);
    const matchesStatus = orderStatusFilter === "All" || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSavingProduct(true);
    try {
      const res = await saveProductAction(editingProduct);
      if (res.success && res.product) {
        setProducts((prev) => {
          const index = prev.findIndex((p) => p.id === res.product!.id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = res.product!;
            return updated;
          }
          return [...prev, res.product!];
        });
        showToast(`Flacon "${res.product.name}" updated successfully!`);
        setEditingProduct(null);
      } else {
        showToast(res.error || "Failed to save product");
      }
    } catch {
      showToast("Network error saving product");
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Handle Quick Price Update
  const handleQuickPriceSave = async (product: PerfumeItem) => {
    const priceNum = parseInt(quickPriceValue.replace(/[^0-9]/g, ""), 10);
    if (!priceNum || priceNum <= 0) {
      showToast("Please enter a valid numeric price");
      setQuickPriceEditingId(null);
      return;
    }
    const updated: PerfumeItem = {
      ...product,
      priceNum,
      price: `PKR ${priceNum.toLocaleString()}`,
    };
    try {
      const res = await saveProductAction(updated);
      if (res.success && res.product) {
        setProducts((prev) => prev.map((p) => (p.id === product.id ? res.product! : p)));
        showToast(`Price for "${product.name}" updated to PKR ${priceNum.toLocaleString()}`);
      }
    } catch {
      showToast("Failed to update quick price");
    } finally {
      setQuickPriceEditingId(null);
    }
  };

  // Handle Product Delete
  const handleDeleteProduct = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the store collection?`)) return;
    try {
      const res = await deleteProductAction(id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast(`Flacon "${name}" deleted`);
      } else {
        showToast(res.error || "Failed to delete product");
      }
    } catch {
      showToast("Network error deleting product");
    }
  };

  // Handle Order Status Update
  const handleStatusChange = async (orderNumber: string, newStatus: StoreOrder["status"]) => {
    setUpdatingOrderId(orderNumber);
    try {
      const res = await updateOrderStatusAction(orderNumber, newStatus);
      if (res.success && res.order) {
        setOrders((prev) => prev.map((o) => (o.orderNumber === orderNumber ? res.order! : o)));
        showToast(`Order #${orderNumber} marked as ${newStatus}`);
      } else {
        showToast(res.error || "Failed to update order");
      }
    } catch {
      showToast("Network error updating order");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Handle Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await saveSettingsAction(settings);
      if (res.success && res.settings) {
        setSettings(res.settings);
        showToast("Store configurations saved!");
      } else {
        showToast(res.error || "Failed to save settings");
      }
    } catch {
      showToast("Network error saving settings");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const createNewProductTemplate = (): PerfumeItem => ({
    id: 0,
    slug: "",
    name: "New Haute Extrait",
    category: "Woody & Amber",
    price: "PKR 11,500",
    priceNum: 11500,
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800",
    notes: "Bergamot, Agarwood, Amber, Vanilla",
    topNotes: "Sparkling Citrus, Pink Peppercorn",
    heartNotes: "Precious Floral Absolute, Spices",
    baseNotes: "Aged Agarwood, Warm Golden Amber",
    concentration: "Extrait de Parfum (32% Oil)",
    volume: "50ml / 1.7 FL. OZ.",
    description: "An opulent bespoke composition crafted with French cold maceration.",
    badge: "New Release",
    sillage: "Commanding & Royal",
    longevity: "18+ Hours",
    bestOccasion: "Evening Galas & Executive Boardrooms",
    season: "All Year Signature",
    gender: "Unisex Haute Luxury",
    story: "Hand-poured into heavy crystal flacons with magnetic metal caps."
  });

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 bg-zinc-950 text-white px-5 py-3 rounded-lg shadow-xl font-medium text-xs tracking-wide flex items-center gap-2.5 border border-zinc-800"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar (Clean, Crisp, Luxury) */}
      <header className="border-b border-zinc-200 bg-white/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-zinc-950 flex items-center justify-center text-white font-serif text-lg">
                A
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg sm:text-xl font-light tracking-[0.2em] uppercase text-zinc-950">
                    Aura
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#FAF7F2] text-[#8C7355] text-[10px] font-bold tracking-wider uppercase border border-[#E8E2D8]">
                    Admin Portal
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 font-normal">
                  Haute Parfumerie Control Suite
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 sm:px-4 py-2 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-bold tracking-wider uppercase text-zinc-700 hover:text-zinc-950 transition-colors flex items-center gap-1.5"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </Link>

            <button
              onClick={() => {
                setEditingProduct(createNewProductTemplate());
                setIsAddMode(true);
              }}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Flacon</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5"
              title="Sign out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-700" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-zinc-200 mb-8 overflow-x-auto no-scrollbar gap-1 sm:gap-2">
          {[
            { id: "overview", label: "Executive Analytics", icon: TrendingUp },
            { id: "products", label: `Perfumes & Flacons (${products.length})`, icon: Layers },
            { id: "orders", label: `Client Orders (${orders.length})`, icon: Package, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
            { id: "content", label: "Story, Guarantee & Details CMS", icon: Sparkles },
            { id: "settings", label: "Store Controls & WhatsApp", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-3.5 px-3 sm:px-4 text-xs font-bold tracking-[0.16em] uppercase transition-colors relative whitespace-nowrap ${
                  isActive ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#8C7355]" : "text-zinc-400"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="adminActiveTab"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-zinc-950"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: EXECUTIVE ANALYTICS                                     */}
        {/* ============================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            
            {/* 4 Clean Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">
                    Gross Store Revenue
                  </span>
                  <div className="p-2 rounded-md bg-[#FAF7F2] text-[#8C7355] border border-[#EFECE6]">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-normal text-zinc-950 mb-2">
                  PKR {totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-emerald-700 font-medium">
                  ● Verified Orders (COD + Bank)
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">
                    Client Orders
                  </span>
                  <div className="p-2 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-normal text-zinc-950 mb-2">
                  {orders.length}
                </div>
                <p className="text-xs text-amber-700 font-medium">
                  {pendingOrdersCount} Awaiting Courier Dispatch
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">
                    Average Order Value (AOV)
                  </span>
                  <div className="p-2 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-normal text-zinc-950 mb-2">
                  PKR {avgOrderValue.toLocaleString()}
                </div>
                <p className="text-xs text-zinc-500">
                  Extrait de Parfum (30%+ Oil)
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">
                    Active Flacons
                  </span>
                  <div className="p-2 rounded-md bg-[#FAF7F2] text-[#8C7355] border border-[#EFECE6]">
                    <Droplets className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-normal text-zinc-950 mb-2">
                  {products.length}
                </div>
                <p className="text-xs text-[#8C7355] font-medium">
                  Full Permanent Line Active
                </p>
              </div>

            </div>

            {/* Logistics Pipeline Funnel */}
            <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="font-serif text-xl font-light text-zinc-950">
                    Logistics & Dispatch Pipeline
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Live nationwide tracking status of customer parcels
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs text-[#8C7355] hover:text-zinc-950 font-bold tracking-wider uppercase flex items-center gap-1 transition-colors"
                >
                  Manage All Orders <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200 text-center">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-amber-800 block mb-1">
                    Pending Verification
                  </span>
                  <span className="font-serif text-3xl text-zinc-950">{pendingOrdersCount}</span>
                </div>

                <div className="p-4 rounded-lg bg-purple-50/60 border border-purple-200 text-center">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-purple-800 block mb-1">
                    Confirmed & Packed
                  </span>
                  <span className="font-serif text-3xl text-zinc-950">{confirmedOrdersCount}</span>
                </div>

                <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 text-center">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-blue-800 block mb-1">
                    In Transit / Shipped
                  </span>
                  <span className="font-serif text-3xl text-zinc-950">{shippedOrdersCount}</span>
                </div>

                <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200 text-center">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-800 block mb-1">
                    Delivered & Paid
                  </span>
                  <span className="font-serif text-3xl text-zinc-950">{deliveredOrdersCount}</span>
                </div>
              </div>
            </div>

            {/* Quick Overview Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Recent Orders Table */}
              <div className="lg:col-span-8 p-6 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-serif text-xl font-light text-zinc-950">Recent Client Orders</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Real-time orders placed via storefront checkout</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs text-[#8C7355] hover:text-zinc-950 font-bold tracking-wider uppercase"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-400 uppercase tracking-wider text-[10px] pb-3">
                        <th className="pb-3 font-semibold">Order Ref</th>
                        <th className="pb-3 font-semibold">Client</th>
                        <th className="pb-3 font-semibold">City</th>
                        <th className="pb-3 font-semibold">Amount</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 font-sans">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.orderNumber} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="py-3 font-mono text-[#8C7355] font-bold">#{ord.orderNumber}</td>
                          <td className="py-3 font-medium text-zinc-900">{ord.customerName}</td>
                          <td className="py-3 text-zinc-600">{ord.customerCity}</td>
                          <td className="py-3 font-serif font-bold text-zinc-950">PKR {ord.total?.toLocaleString()}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${
                              ord.status === "DELIVERED"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : ord.status === "SHIPPED"
                                ? "bg-blue-50 text-blue-800 border border-blue-200"
                                : ord.status === "CONFIRMED"
                                ? "bg-purple-50 text-purple-800 border border-purple-200"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <a
                              href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(ord.customerName)}!%20Your%20Aura%20order%20%23${ord.orderNumber}%20status%20is%20${ord.status}.`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold tracking-wider uppercase"
                            >
                              WhatsApp
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Direct Concierge Line Card */}
              <div className="lg:col-span-4 p-6 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-light text-zinc-950">
                        WhatsApp Concierge
                      </h3>
                      <p className="text-xs text-zinc-500">Live Customer Assistance</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2.5 mb-5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Desk Number:</span>
                      <span className="font-mono text-zinc-950 font-bold">{settings.whatsappNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Operating Hours:</span>
                      <span className="text-zinc-700 font-medium">10 AM – 11 PM PKT</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Free Tester Guarantee:</span>
                      <span className="text-emerald-700 font-bold">Included In All Boxes</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp Chat</span>
                  </a>

                  <button
                    onClick={() => setActiveTab("settings")}
                    className="w-full py-2.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-bold tracking-wider uppercase transition-colors"
                  >
                    Configure Store Settings
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: FRAGRANCE FLACONS (PRODUCT CATALOG)                      */}
        {/* ============================================================== */}
        {activeTab === "products" && (
          <div className="space-y-6">
            
            {/* Search, Filter & Quick Action Bar */}
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
              
              <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by name, fragrance family, notes..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
                {["All", "Woody & Amber", "Floral & Rose", "Fresh & Citrus", "Warm Gourmand"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProductCategoryFilter(cat)}
                    className={`px-3.5 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all border whitespace-nowrap ${
                      productCategoryFilter === cat
                        ? "bg-zinc-950 text-white border-zinc-950 shadow-xs"
                        : "bg-white text-zinc-600 border-zinc-200 hover:text-zinc-950 hover:border-zinc-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => {
                const isEditingQuickPrice = quickPriceEditingId === p.id;

                return (
                  <div
                    key={p.id}
                    className="rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 transition-all flex flex-col justify-between overflow-hidden shadow-xs group"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative aspect-[16/10] bg-zinc-100 overflow-hidden border-b border-zinc-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          {p.badge && (
                            <span className="px-2.5 py-1 rounded bg-zinc-950/90 text-white text-[9px] font-bold tracking-widest uppercase">
                              {p.badge}
                            </span>
                          )}
                          <span className="px-2.5 py-1 rounded bg-white/95 text-zinc-900 text-[9px] font-mono border border-zinc-200">
                            {p.volume}
                          </span>
                        </div>

                        <div className="absolute bottom-3 right-3">
                          <span className="px-3 py-1 rounded bg-white/95 text-zinc-950 font-serif text-sm font-bold border border-zinc-200 shadow-sm">
                            {p.price}
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 space-y-3.5">
                        <div>
                          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8C7355]">
                            {p.category}
                          </span>
                          <h4 className="font-serif text-2xl font-light text-zinc-950 mt-0.5">{p.name}</h4>
                          <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{p.concentration}</p>
                        </div>

                        {/* Inline Quick Price Update Pill */}
                        <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                            Quick Price Edit:
                          </span>
                          {isEditingQuickPrice ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                autoFocus
                                value={quickPriceValue}
                                onChange={(e) => setQuickPriceValue(e.target.value)}
                                className="w-24 px-2 py-1 bg-white border border-zinc-950 text-xs text-zinc-950 rounded font-serif focus:outline-none"
                              />
                              <button
                                onClick={() => handleQuickPriceSave(p)}
                                className="p-1 rounded bg-zinc-950 text-white hover:bg-zinc-800"
                                title="Save price"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setQuickPriceEditingId(null)}
                                className="p-1 rounded bg-zinc-200 text-zinc-600 hover:text-zinc-950"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setQuickPriceEditingId(p.id);
                                setQuickPriceValue(String(p.priceNum || 0));
                              }}
                              className="text-xs font-serif font-bold text-zinc-900 hover:text-[#8C7355] flex items-center gap-1 underline underline-offset-4 decoration-zinc-300 hover:decoration-[#8C7355]"
                              title="Click to edit price directly"
                            >
                              <span>{p.price}</span>
                              <Edit3 className="w-3 h-3 text-zinc-400" />
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>

                        {/* Olfactory Notes Box */}
                        <div className="p-3 rounded-lg bg-[#FAF9F7] border border-zinc-200 space-y-1 text-[11px]">
                          <p><span className="text-[#8C7355] font-bold">Top:</span> <span className="text-zinc-800">{p.topNotes}</span></p>
                          <p><span className="text-[#8C7355] font-bold">Heart:</span> <span className="text-zinc-800">{p.heartNotes}</span></p>
                          <p><span className="text-[#8C7355] font-bold">Base:</span> <span className="text-zinc-800">{p.baseNotes}</span></p>
                        </div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct({ ...p });
                          setIsAddMode(false);
                        }}
                        className="px-4 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5 flex-1 justify-center shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Product</span>
                      </button>

                      <Link
                        href={`/perfumes/${p.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg border border-zinc-200 hover:border-zinc-950 bg-white text-zinc-600 hover:text-zinc-950 transition-colors"
                        title="View on Live Store"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Flacon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CLIENT ORDERS                                           */}
        {/* ============================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search order #, client, phone, or city..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
                {["All", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all border whitespace-nowrap ${
                      orderStatusFilter === st
                        ? "bg-zinc-950 text-white border-zinc-950"
                        : "bg-white text-zinc-600 border-zinc-200 hover:text-zinc-950"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table Container */}
            <div className="rounded-xl bg-white border border-zinc-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[10px] bg-zinc-50/80">
                      <th className="p-4 sm:p-5 font-semibold">Order Reference</th>
                      <th className="p-4 sm:p-5 font-semibold">Client Profile</th>
                      <th className="p-4 sm:p-5 font-semibold">Delivery Destination</th>
                      <th className="p-4 sm:p-5 font-semibold">Items & Total</th>
                      <th className="p-4 sm:p-5 font-semibold">Dispatch Status</th>
                      <th className="p-4 sm:p-5 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-zinc-500">
                          <Package className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                          <p>No client orders matching this criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        const isUpdatingThis = updatingOrderId === ord.orderNumber;
                        const clientInitials = ord.customerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2);

                        return (
                          <tr key={ord.orderNumber} className="hover:bg-zinc-50/70 transition-colors">
                            
                            {/* Order Reference */}
                            <td className="p-4 sm:p-5 align-top">
                              <span className="font-mono text-[#8C7355] font-bold block text-sm">
                                #{ord.orderNumber}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">
                                {new Date(ord.createdAt).toLocaleDateString()}
                              </span>
                              <span className="inline-block mt-2 px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[9px] font-bold tracking-wider uppercase border border-zinc-200">
                                {ord.paymentMethod}
                              </span>
                            </td>

                            {/* Client Profile */}
                            <td className="p-4 sm:p-5 align-top">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] text-[#8C7355] font-bold text-xs flex items-center justify-center shrink-0 border border-[#E8E2D8]">
                                  {clientInitials}
                                </div>
                                <div>
                                  <p className="font-bold text-zinc-950 text-sm">{ord.customerName}</p>
                                  <p className="font-mono text-zinc-500 text-xs mt-0.5">{ord.customerPhone}</p>
                                </div>
                              </div>
                            </td>

                            {/* Destination */}
                            <td className="p-4 sm:p-5 align-top max-w-xs">
                              <div className="flex items-center gap-1.5 text-zinc-950 font-semibold text-xs mb-1">
                                <MapPin className="w-3.5 h-3.5 text-[#8C7355]" />
                                <span>{ord.customerCity}</span>
                              </div>
                              <p className="text-zinc-600 text-xs leading-relaxed">{ord.customerAddress}</p>
                              {ord.notes && (
                                <p className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1 inline-block">
                                  Note: {ord.notes}
                                </p>
                              )}
                            </td>

                            {/* Items & Total */}
                            <td className="p-4 sm:p-5 align-top">
                              <div className="space-y-1 mb-2">
                                {ord.items.map((item, i) => (
                                  <div key={i} className="text-xs text-zinc-700">
                                    <span className="font-semibold text-zinc-950">{item.quantity}x</span> {item.name}
                                  </div>
                                ))}
                              </div>
                              <span className="font-serif text-sm font-bold text-zinc-950 block">
                                PKR {ord.total?.toLocaleString()}
                              </span>
                            </td>

                            {/* Status Selector Dropdown */}
                            <td className="p-4 sm:p-5 align-top">
                              <select
                                disabled={isUpdatingThis}
                                value={ord.status}
                                onChange={(e) => handleStatusChange(ord.orderNumber, e.target.value as any)}
                                className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold tracking-wider uppercase border focus:outline-none transition-colors ${
                                  ord.status === "DELIVERED"
                                    ? "text-emerald-800 border-emerald-300 bg-emerald-50"
                                    : ord.status === "SHIPPED"
                                    ? "text-blue-800 border-blue-300 bg-blue-50"
                                    : ord.status === "CONFIRMED"
                                    ? "text-purple-800 border-purple-300 bg-purple-50"
                                    : ord.status === "CANCELLED"
                                    ? "text-red-800 border-red-300 bg-red-50"
                                    : "text-amber-800 border-amber-300 bg-amber-50"
                                }`}
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                              {isUpdatingThis && (
                                <span className="block text-[9px] text-zinc-400 font-mono mt-1">Updating...</span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="p-4 sm:p-5 align-top text-right">
                              <div className="flex items-center justify-end gap-2">
                                <a
                                  href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(ord.customerName)}!%20This%20is%20Aura%20Haute%20Parfumerie.%20Your%20order%20%23${ord.orderNumber}%20(${ord.status})%20has%20been%20updated.%20Total:%20PKR%20${ord.total?.toLocaleString()}%20(Free%20Nationwide%20Delivery).`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                                  title="Send WhatsApp update to customer"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </a>

                                <button
                                  onClick={() => setViewingOrderInvoice(ord)}
                                  className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors border border-zinc-200"
                                  title="View Printable Packing Slip & Receipt"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: BRAND STORY, GUARANTEE & DETAILS CMS                     */}
        {/* ============================================================== */}
        {activeTab === "content" && (
          <div className="max-w-5xl space-y-8">
            <form onSubmit={handleSaveSettings} className="space-y-8">

              {/* Top Banner with Quick Save */}
              <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded bg-[#FAF7F2] text-[#8C7355] text-[10px] font-bold tracking-wider uppercase border border-[#E8E2D8]">
                      Dynamic Content Engine
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Sync Enabled
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl font-light text-zinc-950">
                    Story, Guarantee & Store Details CMS
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1 max-w-2xl">
                    Configure your brand narrative, 3 core craftsmanship standards, 2ml trial guarantee policies, and customer delivery assurances across the storefront and product detail pages.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-6 py-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 whitespace-nowrap self-stretch sm:self-auto justify-center"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSettings ? "Saving Changes..." : "Save Content & Policies"}</span>
                </button>
              </div>

              {/* ========================================================= */}
              {/* SECTION 1: THE BRAND STORY & CRAFTSMANSHIP                */}
              {/* ========================================================= */}
              <div className="p-6 sm:p-8 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                  <div className="p-2.5 rounded-lg bg-[#FAF7F2] text-[#8C7355] border border-[#EFECE6]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-light text-zinc-950">
                      1. Brand Story & Craftsmanship Narrative
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Appears on the homepage ("Why Aura Stands Apart") and the About Maison page.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Story Section Title
                    </label>
                    <input
                      type="text"
                      value={settings.storyTitle || ""}
                      onChange={(e) => setSettings({ ...settings, storyTitle: e.target.value })}
                      placeholder="Why Aura Stands Apart"
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Monogram Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={settings.storySubtitle || ""}
                      onChange={(e) => setSettings({ ...settings, storySubtitle: e.target.value })}
                      placeholder="The Art of Haute Parfumerie"
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                    Brand Narrative Description
                  </label>
                  <textarea
                    rows={3}
                    value={settings.storyDescription || ""}
                    onChange={(e) => setSettings({ ...settings, storyDescription: e.target.value })}
                    placeholder="We reject diluted mass-market formulas. Every Aura formulation is created with rare botanicals..."
                    className="w-full px-4 py-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs leading-relaxed text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                  />
                </div>

                {/* Cold Maceration Badge & Details */}
                <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-[#8C7355]" />
                    <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-700">
                      Cold Maceration Feature Box
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-zinc-600 mb-1">
                        Process Badge Title
                      </label>
                      <input
                        type="text"
                        value={settings.storyProcessBadge || ""}
                        onChange={(e) => setSettings({ ...settings, storyProcessBadge: e.target.value })}
                        placeholder="Cold Maceration Process"
                        className="w-full px-3 py-2 rounded bg-white border border-zinc-200 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold uppercase text-zinc-600 mb-1">
                        Process Description
                      </label>
                      <input
                        type="text"
                        value={settings.storyProcessText || ""}
                        onChange={(e) => setSettings({ ...settings, storyProcessText: e.target.value })}
                        placeholder="Every flacon rests undisturbed in temperature-controlled dark vaults..."
                        className="w-full px-3 py-2 rounded bg-white border border-zinc-200 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3 Core Standards (Tenets) */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-700 block">
                    Three Pillars of Craftsmanship (Standards Grid)
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Tenet 1 */}
                    <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-[#8C7355]">Pillar 01</span>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-zinc-600 mb-1">Title</label>
                        <input
                          type="text"
                          value={settings.storyPoint1Title || ""}
                          onChange={(e) => setSettings({ ...settings, storyPoint1Title: e.target.value })}
                          placeholder="30–35% Pure Oil Extrait"
                          className="w-full px-3 py-2 rounded bg-white border border-zinc-200 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-zinc-600 mb-1">Details</label>
                        <textarea
                          rows={3}
                          value={settings.storyPoint1Text || ""}
                          onChange={(e) => setSettings({ ...settings, storyPoint1Text: e.target.value })}
                          placeholder="Highest concentration standard ensuring extraordinary projection and 18+ hour longevity."
                          className="w-full px-3 py-2 rounded bg-white border border-zinc-200 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Tenet 2 */}
                    <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-[#8C7355]">Pillar 02</span>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-zinc-600 mb-1">Title</label>
                        <input
                          type="text"
                          value={settings.storyPoint2Title || ""}
                          onChange={(e) => setSettings({ ...settings, storyPoint2Title: e.target.value })}
                          placeholder="Authentic French Maceration"
                          className="w-full px-3 py-2 rounded bg-white border border-zinc-200 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-zinc-600 mb-1">Details</label>
                        <textarea
                          rows={3}
                          value={settings.storyPoint2Text || ""}
                          onChange={(e) => setSettings({ ...settings, storyPoint2Text: e.target.value })}
                          placeholder="Aged 45 days in dark vaults allowing complex organic compounds to meld into seamless richness."
                          className="w-full px-3 py-2 rounded bg-white border border-zinc-200 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Tenet 3 */}
                    <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-[#8C7355]">Pillar 03</span>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-zinc-600 mb-1">Title</label>
                        <input
                          type="text"
                          value={settings.storyPoint3Title || ""}
                          onChange={(e) => setSettings({ ...settings, storyPoint3Title: e.target.value })}
                          placeholder="Zero Compromise on Sillage"
                          className="w-full px-3 py-2 rounded bg-white border border-zinc-200 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-zinc-600 mb-1">Details</label>
                        <textarea
                          rows={3}
                          value={settings.storyPoint3Text || ""}
                          onChange={(e) => setSettings({ ...settings, storyPoint3Text: e.target.value })}
                          placeholder="Engineered for an intoxicating sillage that leaves an unforgettable signature without synthetic harshness."
                          className="w-full px-3 py-2 rounded bg-white border border-zinc-200 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* SECTION 2: THE 2ML TRIAL GUARANTEE POLICY                 */}
              {/* ========================================================= */}
              <div className="p-6 sm:p-8 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-light text-zinc-950">
                      2. The 2ml Trial Guarantee Policy
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Reassures high-ticket online perfume buyers. Displayed on product pages and guarantee tabs.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Guarantee Title
                    </label>
                    <input
                      type="text"
                      value={settings.trialGuaranteeTitle || ""}
                      onChange={(e) => setSettings({ ...settings, trialGuaranteeTitle: e.target.value })}
                      placeholder="The 2ml Trial Guarantee"
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Guarantee Subtitle
                    </label>
                    <input
                      type="text"
                      value={settings.trialGuaranteeSubtitle || ""}
                      onChange={(e) => setSettings({ ...settings, trialGuaranteeSubtitle: e.target.value })}
                      placeholder="Experience Risk-Free At Home"
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={settings.trialGuaranteeBadge || ""}
                      onChange={(e) => setSettings({ ...settings, trialGuaranteeBadge: e.target.value })}
                      placeholder="Risk-Free Trial Included"
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                    Guarantee Detailed Explanation
                  </label>
                  <textarea
                    rows={3}
                    value={settings.trialGuaranteeDescription || ""}
                    onChange={(e) => setSettings({ ...settings, trialGuaranteeDescription: e.target.value })}
                    placeholder="Every flacon arrives with a complimentary 2ml matching sample spray. Wear the trial sample first for up to 3 days..."
                    className="w-full px-4 py-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs leading-relaxed text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Trial Step 1 Bullet
                    </label>
                    <input
                      type="text"
                      value={settings.trialGuaranteeBullet1 || ""}
                      onChange={(e) => setSettings({ ...settings, trialGuaranteeBullet1: e.target.value })}
                      placeholder="Every full bottle order includes a matching 2ml discovery vial. Test the scent on your skin first."
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Trial Step 2 (Return / Refund) Bullet
                    </label>
                    <input
                      type="text"
                      value={settings.trialGuaranteeBullet2 || ""}
                      onChange={(e) => setSettings({ ...settings, trialGuaranteeBullet2: e.target.value })}
                      placeholder="If it doesn't captivate you, return the unopened 50ml flacon for a 100% full refund."
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* SECTION 3: STORE POLICIES, DELIVERY & FOUNDER NOTE        */}
              {/* ========================================================= */}
              <div className="p-6 sm:p-8 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                  <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                    <TruckIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-light text-zinc-950">
                      3. Delivery Timelines, COD & Founder Attribution
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Shipping guarantees, cash-on-delivery terms, and personal founder quotes.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Delivery Timelines Notice
                    </label>
                    <input
                      type="text"
                      value={settings.deliveryTimeNotice || ""}
                      onChange={(e) => setSettings({ ...settings, deliveryTimeNotice: e.target.value })}
                      placeholder="2 to 4 business days nationwide (Karachi, Lahore, Islamabad, & all cities)"
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Cash on Delivery (COD) Assurance
                    </label>
                    <input
                      type="text"
                      value={settings.codPolicyNotice || ""}
                      onChange={(e) => setSettings({ ...settings, codPolicyNotice: e.target.value })}
                      placeholder="Cash on Delivery (COD) available nationwide with zero advance payment needed."
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Founder / Master Perfumer Quote
                    </label>
                    <textarea
                      rows={2}
                      value={settings.founderQuote || ""}
                      onChange={(e) => setSettings({ ...settings, founderQuote: e.target.value })}
                      placeholder="True luxury is not loud marketing; it is the intoxicating trail you leave behind in an empty room."
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Founder Attribution
                    </label>
                    <input
                      type="text"
                      value={settings.founderAuthor || ""}
                      onChange={(e) => setSettings({ ...settings, founderAuthor: e.target.value })}
                      placeholder="M. Ateeq — Founder & Creative Director, Aura"
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Submit Action */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-zinc-500">
                  Click save to persist all changes instantly across the entire store.
                </span>

                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-8 py-3 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSettings ? "Saving Settings..." : "Save Content & Policies"}</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: STORE CONTROLS & SETTINGS                               */}
        {/* ============================================================== */}
        {activeTab === "settings" && (
          <div className="max-w-4xl space-y-6">
            
            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* WhatsApp Box */}
              <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-light text-zinc-950">
                      WhatsApp Concierge Line
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Primary phone number connected to all store consultation and order buttons
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      WhatsApp Number (Pakistan Format)
                    </label>
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      placeholder="03098541632"
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Support Display Text
                    </label>
                    <input
                      type="text"
                      value={settings.supportPhone}
                      onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                      placeholder="+92 309 8541632"
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Ticker & Discovery Box */}
              <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                  <div className="p-2.5 rounded-lg bg-[#FAF7F2] text-[#8C7355] border border-[#EFECE6]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-light text-zinc-950">
                      Announcement Ticker & Discovery Price
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Top marquee bar announcement and sample box pricing
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                    Announcement Banner Text
                  </label>
                  <input
                    type="text"
                    value={settings.announcementTicker}
                    onChange={(e) => setSettings({ ...settings, announcementTicker: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Discovery Coffret Price (PKR)
                    </label>
                    <input
                      type="number"
                      value={settings.discoveryPrice}
                      onChange={(e) => setSettings({ ...settings, discoveryPrice: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Payment Gateway Status
                    </label>
                    <div className="flex items-center gap-2 h-10 px-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Cash on Delivery (COD) Active Nationwide</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-8 py-3 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-sm disabled:opacity-50"
                >
                  {isSavingSettings ? "Saving Settings..." : "Save Store Configuration"}
                </button>
              </div>

            </form>

          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* MODAL 1: FLACON EDITOR (CLEAN LIGHT DESIGN)                    */}
      {/* ============================================================== */}
      <AnimatePresence>
        {editingProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProduct(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-4 sm:inset-6 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[850px] max-h-[92vh] overflow-y-auto bg-white border border-zinc-200 rounded-xl z-50 shadow-2xl p-6 sm:p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-zinc-200 mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-light text-zinc-950">
                    {isAddMode ? "Create New Signature Flacon" : `Edit Flacon: ${editingProduct.name}`}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Configure perfume specs, olfactory pyramid, and pricing
                  </p>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-6">
                
                {/* Name & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Flacon Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      placeholder="e.g. Oud Royale"
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Price in PKR (e.g. 12500) *
                    </label>
                    <input
                      type="number"
                      required
                      value={editingProduct.priceNum || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, priceNum: parseInt(e.target.value, 10) || 0 })}
                      placeholder="12500"
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none font-serif"
                    />
                  </div>
                </div>

                {/* Image URL & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Flacon Image URL
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Fragrance Family (Category)
                    </label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                    >
                      <option>Woody & Amber</option>
                      <option>Floral & Rose</option>
                      <option>Fresh & Citrus</option>
                      <option>Warm Gourmand</option>
                    </select>
                  </div>
                </div>

                {/* Olfactory Pyramid */}
                <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C7355] block">
                    Olfactory Architecture (Pyramid)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-zinc-600 mb-1">Top Notes</label>
                      <input
                        type="text"
                        value={editingProduct.topNotes}
                        onChange={(e) => setEditingProduct({ ...editingProduct, topNotes: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-white border border-zinc-200 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-zinc-600 mb-1">Heart Notes</label>
                      <input
                        type="text"
                        value={editingProduct.heartNotes}
                        onChange={(e) => setEditingProduct({ ...editingProduct, heartNotes: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-white border border-zinc-200 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-zinc-600 mb-1">Base Notes</label>
                      <input
                        type="text"
                        value={editingProduct.baseNotes}
                        onChange={(e) => setEditingProduct({ ...editingProduct, baseNotes: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-white border border-zinc-200 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                    Description & Narrative
                  </label>
                  <textarea
                    rows={2}
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-5 py-2.5 rounded-lg border border-zinc-200 text-zinc-600 hover:text-zinc-950 text-xs font-bold tracking-wider uppercase transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProduct}
                    className="px-6 py-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-sm"
                  >
                    {isSavingProduct ? "Saving..." : "Save Flacon"}
                  </button>
                </div>

              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* MODAL 2: PRINTABLE LUXURY PACKING SLIP & CLIENT INVOICE        */}
      {/* ============================================================== */}
      <AnimatePresence>
        {viewingOrderInvoice && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingOrderInvoice(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-4 sm:inset-8 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[620px] max-h-[90vh] overflow-y-auto bg-white text-zinc-950 border border-zinc-300 rounded-xl z-50 shadow-2xl p-6 sm:p-8"
            >
              {/* Slip Header */}
              <div className="flex justify-between items-start pb-6 border-b border-zinc-200">
                <div>
                  <h3 className="font-serif text-3xl font-light uppercase tracking-widest text-zinc-950">AURA</h3>
                  <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#8C7355] block">
                    Haute Parfumerie Dispatch
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-zinc-900 block">
                    #{viewingOrderInvoice.orderNumber}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {new Date(viewingOrderInvoice.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Client Details Card */}
              <div className="grid grid-cols-2 gap-4 py-5 border-b border-zinc-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Deliver To:
                  </span>
                  <p className="font-bold text-zinc-900 text-sm">{viewingOrderInvoice.customerName}</p>
                  <p className="font-mono text-zinc-600 mt-0.5">{viewingOrderInvoice.customerPhone}</p>
                  <p className="text-zinc-700 mt-1">{viewingOrderInvoice.customerAddress}, {viewingOrderInvoice.customerCity}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Payment Method:
                  </span>
                  <span className="inline-block px-2.5 py-1 bg-zinc-100 border border-zinc-200 text-zinc-900 font-bold text-[10px] uppercase">
                    {viewingOrderInvoice.paymentMethod}
                  </span>
                  <p className="text-[11px] text-zinc-500 mt-2">Free Nationwide Express Delivery</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="py-5 border-b border-zinc-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-3">
                  Enclosed Flacons:
                </span>
                <div className="space-y-2 text-xs">
                  {viewingOrderInvoice.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1.5 border-b border-zinc-100">
                      <div>
                        <span className="font-semibold text-zinc-900">{it.name}</span>
                        <span className="text-zinc-500 text-[11px] ml-2">Qty: {it.quantity}</span>
                      </div>
                      <span className="font-serif font-bold text-zinc-900">PKR {it.price?.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-xs text-zinc-500 pt-1">
                    <span>Complimentary 2ml Matching Trial Vial</span>
                    <span className="font-bold text-emerald-600 uppercase">FREE</span>
                  </div>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-4 flex justify-between items-center text-sm font-bold">
                <span className="uppercase tracking-wider text-xs text-zinc-600">Total Payable at Doorstep:</span>
                <span className="font-serif text-2xl text-zinc-950 font-bold">
                  PKR {viewingOrderInvoice.total?.toLocaleString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-end gap-3">
                <button
                  onClick={() => setViewingOrderInvoice(null)}
                  className="px-5 py-2.5 rounded-lg border border-zinc-300 text-zinc-700 hover:text-black text-xs font-bold uppercase"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2.5 rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-bold uppercase flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
