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
  CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PerfumeItem, PERFUMES_DATA } from "@/lib/perfumes";
import { StoreSettings, StoreOrder } from "@/lib/storeManager";
import { 
  saveProductAction, 
  deleteProductAction, 
  saveSettingsAction, 
  updateOrderStatusAction 
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
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "settings">("overview");

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
    if (!window.confirm(`Are you sure you want to retire and remove "${name}" from the collection?`)) return;
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
        showToast("Global store configurations saved!");
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
    <div className="min-h-screen bg-[#0C0C0B] text-zinc-100 font-sans selection:bg-[#C5A880] selection:text-black">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-[#C5A880]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-3xl" />
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 bg-[#C5A880] text-zinc-950 px-5 py-3 rounded-lg shadow-2xl font-bold text-xs tracking-wider uppercase flex items-center gap-2.5 border border-white/20"
          >
            <CheckCircle2 className="w-4 h-4 text-zinc-950" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Executive Header Bar */}
      <header className="relative z-10 border-b border-white/[0.08] bg-[#121211]/85 backdrop-blur-2xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C7355] p-[1px] shadow-lg">
                <div className="w-full h-full bg-[#121211] rounded-[11px] flex items-center justify-center">
                  <span className="font-serif text-lg font-light text-[#D4AF37]">A</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-lg sm:text-xl font-light tracking-[0.2em] uppercase text-white group-hover:text-[#D4AF37] transition-colors">
                    Aura
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-[#C5A880]/15 text-[#C5A880] text-[9px] font-mono font-bold tracking-wider uppercase border border-[#C5A880]/30">
                    Directors Portal
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 font-mono tracking-wider">
                  Haute Parfumerie Control Suite • Live Sync
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 sm:px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-[11px] sm:text-xs font-bold tracking-wider uppercase text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>View Live Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A880]" />
            </Link>

            <button
              onClick={() => {
                setEditingProduct(createNewProductTemplate());
                setIsAddMode(true);
              }}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-[#C5A880] to-[#E3C29B] hover:from-[#d5b890] hover:to-[#edd0a9] text-zinc-950 text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase transition-all flex items-center gap-2 shadow-lg shadow-[#C5A880]/10 hover:shadow-[#C5A880]/20"
            >
              <Plus className="w-4 h-4 text-zinc-950" />
              <span>Add Flacon</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Administrative Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-white/[0.08] mb-8 overflow-x-auto no-scrollbar gap-2 sm:gap-4">
          {[
            { id: "overview", label: "Executive Analytics", icon: TrendingUp },
            { id: "products", label: `Perfumes & Flacons (${products.length})`, icon: Layers },
            { id: "orders", label: `Client Orders (${orders.length})`, icon: Package, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
            { id: "settings", label: "Store Controls & WhatsApp", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-4 px-3 sm:px-5 text-xs font-bold tracking-[0.18em] uppercase transition-all relative whitespace-nowrap ${
                  isActive ? "text-[#C5A880]" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#C5A880]" : "text-zinc-500"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="adminTabGlow"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent shadow-[0_0_12px_#C5A880]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: EXECUTIVE ANALYTICS & REVENUE                           */}
        {/* ============================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in-50 duration-300">
            
            {/* 4 Hero KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Gross Revenue */}
              <div className="p-6 rounded-2xl bg-[#141413]/80 backdrop-blur-xl border border-white/[0.08] shadow-xl hover:border-[#C5A880]/30 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A880]/10 rounded-full blur-2xl group-hover:bg-[#C5A880]/15 transition-all" />
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">
                    Gross Store Revenue
                  </span>
                  <div className="p-2.5 rounded-xl bg-[#C5A880]/10 text-[#C5A880] border border-[#C5A880]/20">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-light text-white mb-2 tracking-tight">
                  PKR {totalRevenue.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-bold">● Active</span>
                  <span>COD + Raast Nationwide</span>
                </div>
              </div>

              {/* Total Orders */}
              <div className="p-6 rounded-2xl bg-[#141413]/80 backdrop-blur-xl border border-white/[0.08] shadow-xl hover:border-blue-500/30 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/15 transition-all" />
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">
                    Client Orders
                  </span>
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-light text-white mb-2 tracking-tight">
                  {orders.length} <span className="text-xs font-mono text-zinc-500 font-normal">Dispatched</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-amber-300">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 font-bold">
                    {pendingOrdersCount} Pending
                  </span>
                  <span>Awaiting Courier</span>
                </div>
              </div>

              {/* Average Order Value */}
              <div className="p-6 rounded-2xl bg-[#141413]/80 backdrop-blur-xl border border-white/[0.08] shadow-xl hover:border-purple-500/30 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/15 transition-all" />
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">
                    Average Order Value (AOV)
                  </span>
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-light text-white mb-2 tracking-tight">
                  PKR {avgOrderValue.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">Luxury Tier</span>
                  <span>30%+ Extrait</span>
                </div>
              </div>

              {/* Active Products */}
              <div className="p-6 rounded-2xl bg-[#141413]/80 backdrop-blur-xl border border-white/[0.08] shadow-xl hover:border-[#C5A880]/30 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all" />
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">
                    Active Flacons
                  </span>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-[#C5A880] border border-amber-500/20">
                    <Droplets className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-light text-white mb-2 tracking-tight">
                  {products.length} <span className="text-xs font-mono text-zinc-500 font-normal">Creations</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#C5A880]">
                  <span className="px-1.5 py-0.5 rounded bg-[#C5A880]/10 border border-[#C5A880]/20 font-bold">Full Catalog</span>
                  <span>Cold Macerated</span>
                </div>
              </div>

            </div>

            {/* Logistics Pipeline Funnel */}
            <div className="p-6 rounded-2xl bg-[#141413]/80 border border-white/[0.08] shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="font-serif text-xl font-light text-white tracking-wide">
                    Logistics & Dispatch Pipeline
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Live nationwide tracking status of all customer parcels
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs text-[#C5A880] hover:text-white font-bold tracking-widest uppercase flex items-center gap-1 transition-colors"
                >
                  Manage All Orders <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400 block mb-1">
                    Pending Verification
                  </span>
                  <span className="font-serif text-3xl font-light text-white">{pendingOrdersCount}</span>
                </div>

                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-center">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-purple-400 block mb-1">
                    Confirmed & Packed
                  </span>
                  <span className="font-serif text-3xl font-light text-white">{confirmedOrdersCount}</span>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-blue-400 block mb-1">
                    In Transit / Shipped
                  </span>
                  <span className="font-serif text-3xl font-light text-white">{shippedOrdersCount}</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400 block mb-1">
                    Delivered & Paid
                  </span>
                  <span className="font-serif text-3xl font-light text-white">{deliveredOrdersCount}</span>
                </div>
              </div>
            </div>

            {/* Sales Breakdown by Perfume & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Product Revenue Share Visual Bars */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-[#141413]/80 border border-white/[0.08] shadow-xl space-y-5">
                <div>
                  <h3 className="font-serif text-xl font-light text-white tracking-wide">
                    Collection Revenue Share
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Performance breakdown by signature flacon</p>
                </div>

                <div className="space-y-4">
                  {products.map((p, idx) => {
                    const samplePercentages = [34, 26, 18, 11, 7, 4];
                    const percent = samplePercentages[idx] || 10;
                    return (
                      <div key={p.id} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                            {p.name}
                          </span>
                          <span className="font-mono text-zinc-400">{p.price} • {percent}%</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#8C7355] to-[#D4AF37] rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Direct Concierge Desk Quick Status */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-[#141413]/80 border border-white/[0.08] shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-light text-white tracking-wide">
                        WhatsApp Concierge Line
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">Customer service & bespoke orders phone</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 mb-5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-400">Desk Mobile Number:</span>
                      <span className="font-mono text-white font-bold">{settings.whatsappNumber}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-400">Operating Hours:</span>
                      <span className="text-zinc-300">10:00 AM – 11:00 PM PKT</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-400">Free Tester Guarantee:</span>
                      <span className="text-emerald-400 font-bold">Active in all boxes</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-[0.18em] uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp Business Chat</span>
                  </a>

                  <button
                    onClick={() => setActiveTab("settings")}
                    className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold tracking-[0.18em] uppercase transition-all"
                  >
                    Configure Store Settings
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: FRAGRANCE FLACONS (PRODUCT CATALOG & QUICK EDIT)         */}
        {/* ============================================================== */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            
            {/* Search, Filter & Quick Action Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#141413]/80 border border-white/[0.08] shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
              
              <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by title, fragrance family, notes..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:border-[#C5A880] focus:outline-none"
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
                        ? "bg-[#C5A880] text-zinc-950 border-[#C5A880] shadow-md shadow-[#C5A880]/10"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => {
                const isEditingQuickPrice = quickPriceEditingId === p.id;

                return (
                  <div
                    key={p.id}
                    className="rounded-2xl bg-[#141413]/90 border border-white/[0.08] hover:border-[#C5A880]/40 transition-all flex flex-col justify-between overflow-hidden shadow-xl group"
                  >
                    <div>
                      {/* Visual Flacon Header */}
                      <div className="relative aspect-[16/10] bg-zinc-950 overflow-hidden border-b border-white/[0.08]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          {p.badge && (
                            <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[#C5A880] text-[9px] font-bold tracking-widest uppercase border border-amber-500/30">
                              {p.badge}
                            </span>
                          )}
                          <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-white text-[9px] font-mono border border-zinc-700">
                            {p.volume}
                          </span>
                        </div>

                        <div className="absolute bottom-3 right-3">
                          <span className="px-3 py-1 rounded-lg bg-zinc-950/90 text-white font-serif text-sm font-bold border border-zinc-700 shadow-md">
                            {p.price}
                          </span>
                        </div>
                      </div>

                      {/* Product Content Body */}
                      <div className="p-5 space-y-3.5">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C5A880]">
                              {p.category}
                            </span>
                            <h4 className="font-serif text-2xl font-light text-white mt-0.5">{p.name}</h4>
                            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{p.concentration}</p>
                          </div>
                        </div>

                        {/* Inline Quick Price Update Pill */}
                        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/90 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">
                            Quick Price:
                          </span>
                          {isEditingQuickPrice ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                autoFocus
                                value={quickPriceValue}
                                onChange={(e) => setQuickPriceValue(e.target.value)}
                                className="w-24 px-2 py-1 bg-zinc-900 border border-[#C5A880] text-xs text-white rounded font-serif focus:outline-none"
                              />
                              <button
                                onClick={() => handleQuickPriceSave(p)}
                                className="p-1 rounded bg-[#C5A880] text-black hover:bg-amber-300"
                                title="Save price"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setQuickPriceEditingId(null)}
                                className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white"
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
                              className="text-xs font-serif font-bold text-white hover:text-[#C5A880] flex items-center gap-1 underline underline-offset-4 decoration-zinc-700 hover:decoration-[#C5A880]"
                              title="Click to edit price"
                            >
                              <span>{p.price}</span>
                              <Edit3 className="w-3 h-3 text-zinc-500" />
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>

                        {/* Olfactory Notes Capsule */}
                        <div className="p-3 rounded-xl bg-zinc-950 border border-white/[0.04] space-y-1 text-[11px]">
                          <p><span className="text-[#C5A880] font-bold">Top:</span> <span className="text-zinc-300">{p.topNotes}</span></p>
                          <p><span className="text-[#C5A880] font-bold">Heart:</span> <span className="text-zinc-300">{p.heartNotes}</span></p>
                          <p><span className="text-[#C5A880] font-bold">Base:</span> <span className="text-zinc-300">{p.baseNotes}</span></p>
                        </div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-4 border-t border-white/[0.08] bg-[#0E0E0D] flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct({ ...p });
                          setIsAddMode(false);
                        }}
                        className="px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-[#C5A880] hover:text-black text-white text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 flex-1 justify-center shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Product</span>
                      </button>

                      <Link
                        href={`/perfumes/${p.slug}`}
                        target="_blank"
                        className="p-2.5 rounded-lg border border-zinc-800 hover:border-white text-zinc-400 hover:text-white transition-colors"
                        title="View on Live Store"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-2.5 rounded-lg border border-red-900/40 text-red-400 hover:bg-red-500/10 transition-colors"
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
        {/* TAB 3: CLIENT ORDERS & DISPATCH WORKFLOW                        */}
        {/* ============================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            
            {/* Filter & Search Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#141413]/80 border border-white/[0.08] shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order #, client, phone, or city..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
                {["All", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all border whitespace-nowrap ${
                      orderStatusFilter === st
                        ? "bg-[#C5A880] text-zinc-950 border-[#C5A880] shadow-md shadow-[#C5A880]/10"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table Container */}
            <div className="rounded-2xl bg-[#141413]/90 border border-white/[0.08] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-zinc-400 uppercase tracking-wider text-[10px] bg-[#0E0E0D]">
                      <th className="p-4 sm:p-5">Order Reference</th>
                      <th className="p-4 sm:p-5">Client Profile</th>
                      <th className="p-4 sm:p-5">Delivery Destination</th>
                      <th className="p-4 sm:p-5">Items & Amount</th>
                      <th className="p-4 sm:p-5">Dispatch Status</th>
                      <th className="p-4 sm:p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-zinc-500">
                          <Package className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
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
                          <tr key={ord.orderNumber} className="hover:bg-white/[0.02] transition-colors">
                            
                            {/* Order Reference */}
                            <td className="p-4 sm:p-5 align-top">
                              <span className="font-mono text-[#C5A880] font-bold block text-sm">
                                #{ord.orderNumber}
                              </span>
                              <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">
                                {new Date(ord.createdAt).toLocaleDateString()}
                              </span>
                              <span className="inline-block mt-2 px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[9px] font-bold tracking-wider uppercase border border-zinc-700">
                                {ord.paymentMethod}
                              </span>
                            </td>

                            {/* Client Profile */}
                            <td className="p-4 sm:p-5 align-top">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#C5A880]/15 text-[#C5A880] font-bold text-xs flex items-center justify-center shrink-0 border border-[#C5A880]/30">
                                  {clientInitials}
                                </div>
                                <div>
                                  <p className="font-bold text-white text-sm">{ord.customerName}</p>
                                  <p className="font-mono text-zinc-400 text-xs mt-0.5">{ord.customerPhone}</p>
                                </div>
                              </div>
                            </td>

                            {/* Destination */}
                            <td className="p-4 sm:p-5 align-top max-w-xs">
                              <div className="flex items-center gap-1.5 text-[#C5A880] font-semibold text-xs mb-1">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{ord.customerCity}</span>
                              </div>
                              <p className="text-zinc-300 text-xs leading-relaxed">{ord.customerAddress}</p>
                              {ord.notes && (
                                <p className="text-[11px] text-amber-300/90 mt-1 italic">
                                  Note: {ord.notes}
                                </p>
                              )}
                            </td>

                            {/* Items & Amount */}
                            <td className="p-4 sm:p-5 align-top">
                              <div className="space-y-1 mb-2">
                                {ord.items.map((item, i) => (
                                  <div key={i} className="text-xs text-zinc-300">
                                    <span className="font-semibold text-white">{item.quantity}x</span> {item.name}
                                  </div>
                                ))}
                              </div>
                              <span className="font-serif text-sm font-bold text-white block">
                                PKR {ord.total?.toLocaleString()}
                              </span>
                            </td>

                            {/* Status Selector Dropdown */}
                            <td className="p-4 sm:p-5 align-top">
                              <select
                                disabled={isUpdatingThis}
                                value={ord.status}
                                onChange={(e) => handleStatusChange(ord.orderNumber, e.target.value as any)}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase bg-zinc-950 border focus:outline-none ${
                                  ord.status === "DELIVERED"
                                    ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
                                    : ord.status === "SHIPPED"
                                    ? "text-blue-400 border-blue-500/40 bg-blue-500/10"
                                    : ord.status === "CONFIRMED"
                                    ? "text-purple-400 border-purple-500/40 bg-purple-500/10"
                                    : ord.status === "CANCELLED"
                                    ? "text-red-400 border-red-500/40 bg-red-500/10"
                                    : "text-amber-400 border-amber-500/40 bg-amber-500/10"
                                }`}
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                              {isUpdatingThis && (
                                <span className="block text-[9px] text-zinc-500 font-mono mt-1">Updating...</span>
                              )}
                            </td>

                            {/* Direct Action Suite */}
                            <td className="p-4 sm:p-5 align-top text-right">
                              <div className="flex items-center justify-end gap-2">
                                {/* 1-Click WhatsApp Client Message */}
                                <a
                                  href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, "")}?text=Salam%20${encodeURIComponent(ord.customerName)}!%20Aura%20Haute%20Parfumerie%20se%20rabta%20kar%20rahy%20hain.%20Aapka%20order%20%23${ord.orderNumber}%20(${ord.status})%20receive%20ho%20chuka%20hai.%20Total:%20PKR%20${ord.total?.toLocaleString()}%20(Free%20Nationwide%20Delivery).`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                                  title="Send WhatsApp update to customer"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </a>

                                {/* View Printable Packing Slip */}
                                <button
                                  onClick={() => setViewingOrderInvoice(ord)}
                                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                                  title="View Invoice & Packing Slip"
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
        {/* TAB 4: STORE SETTINGS & WHATSAPP CONFIGURATION                  */}
        {/* ============================================================== */}
        {activeTab === "settings" && (
          <div className="max-w-4xl space-y-8 animate-in fade-in-50 duration-300">
            
            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* WhatsApp Concierge Box */}
              <div className="p-6 rounded-2xl bg-[#141413]/90 border border-white/[0.08] shadow-xl space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-light text-white tracking-wide">
                      WhatsApp Concierge Line
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Primary phone number connected to all WhatsApp order and consultation buttons
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-400 mb-1.5">
                      WhatsApp Number (Pakistan Format)
                    </label>
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      placeholder="03098541632"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:border-[#C5A880] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-400 mb-1.5">
                      Support Display String
                    </label>
                    <input
                      type="text"
                      value={settings.supportPhone}
                      onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                      placeholder="+92 309 8541632"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:border-[#C5A880] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Ticker & Discovery Box Settings */}
              <div className="p-6 rounded-2xl bg-[#141413]/90 border border-white/[0.08] shadow-xl space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                  <div className="p-2.5 rounded-xl bg-[#C5A880]/10 text-[#C5A880] border border-[#C5A880]/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-light text-white tracking-wide">
                      Announcement Ticker & Discovery Price
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Configure the top marquee bar text and sample box pricing
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-400 mb-1.5">
                    Announcement Banner Text
                  </label>
                  <input
                    type="text"
                    value={settings.announcementTicker}
                    onChange={(e) => setSettings({ ...settings, announcementTicker: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-[#C5A880] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-400 mb-1.5">
                      Discovery Coffret Price (PKR)
                    </label>
                    <input
                      type="number"
                      value={settings.discoveryPrice}
                      onChange={(e) => setSettings({ ...settings, discoveryPrice: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:border-[#C5A880] focus:outline-none font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-400 mb-1.5">
                      Payment Gateway Status
                    </label>
                    <div className="flex items-center gap-4 h-10 px-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-emerald-400 font-bold">
                      <span>✓ Cash on Delivery (COD) Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Settings */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#E3C29B] hover:from-[#d5b890] hover:to-[#edd0a9] text-zinc-950 text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-xl shadow-[#C5A880]/10 disabled:opacity-50"
                >
                  {isSavingSettings ? "Saving Settings..." : "Save Store Configuration"}
                </button>
              </div>

            </form>

          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* MODAL 1: FLACON EDITOR (FULL CUSTOMIZATION WITH LIVE PREVIEW)  */}
      {/* ============================================================== */}
      <AnimatePresence>
        {editingProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProduct(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-4 sm:inset-6 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[850px] max-h-[92vh] overflow-y-auto bg-[#141413] border border-white/10 rounded-2xl z-50 shadow-2xl p-6 sm:p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.08] mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-light text-white">
                    {isAddMode ? "Create New Signature Flacon" : `Edit Flacon: ${editingProduct.name}`}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Configure perfume specs, olfactory pyramid, and pricing
                  </p>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-6">
                
                {/* 1. Name & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-1.5">
                      Flacon Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      placeholder="e.g. Oud Royale"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-1.5">
                      Price in PKR (e.g. 12500) *
                    </label>
                    <input
                      type="number"
                      required
                      value={editingProduct.priceNum || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, priceNum: parseInt(e.target.value, 10) || 0 })}
                      placeholder="12500"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:border-[#C5A880] focus:outline-none font-serif"
                    />
                  </div>
                </div>

                {/* 2. Image URL & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-1.5">
                      Flacon Image URL
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-[#C5A880] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-1.5">
                      Fragrance Family (Category)
                    </label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-[#C5A880] focus:outline-none"
                    >
                      <option>Woody & Amber</option>
                      <option>Floral & Rose</option>
                      <option>Fresh & Citrus</option>
                      <option>Warm Gourmand</option>
                    </select>
                  </div>
                </div>

                {/* 3. Olfactory Pyramid */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#C5A880] block">
                    Olfactory Architecture (Pyramid)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Top Notes</label>
                      <input
                        type="text"
                        value={editingProduct.topNotes}
                        onChange={(e) => setEditingProduct({ ...editingProduct, topNotes: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[#C5A880] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Heart Notes</label>
                      <input
                        type="text"
                        value={editingProduct.heartNotes}
                        onChange={(e) => setEditingProduct({ ...editingProduct, heartNotes: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[#C5A880] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Base Notes</label>
                      <input
                        type="text"
                        value={editingProduct.baseNotes}
                        onChange={(e) => setEditingProduct({ ...editingProduct, baseNotes: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[#C5A880] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Description */}
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-1.5">
                    Description & Narrative
                  </label>
                  <textarea
                    rows={2}
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-[#C5A880] focus:outline-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold tracking-wider uppercase transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProduct}
                    className="px-6 py-2.5 rounded-xl bg-[#C5A880] hover:bg-amber-300 text-zinc-950 text-xs font-bold tracking-[0.16em] uppercase transition-all shadow-lg"
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
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-4 sm:inset-8 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[620px] max-h-[90vh] overflow-y-auto bg-white text-zinc-950 border border-zinc-300 rounded-2xl z-50 shadow-2xl p-6 sm:p-8"
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
                <span className="uppercase tracking-wider text-xs">Total Payable at Doorstep:</span>
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
