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
  TruckIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PerfumeItem } from "@/lib/perfumes";
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

  // Loading States
  const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);

  // Statistics Calculations
  const totalRevenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === "PENDING").length;
  const activeProductsCount = products.length;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.notes.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = 
      productCategoryFilter === "All" || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    const matchesStatus = 
      orderStatusFilter === "All" || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Save / Update Product
  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSavingProduct(true);
    try {
      const res = await saveProductAction(editingProduct);
      if (res.success && res.product) {
        setProducts((prev) => {
          const idx = prev.findIndex((p) => p.id === res.product!.id);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = res.product!;
            return updated;
          }
          return [res.product!, ...prev];
        });
        showToast(`✓ Flacon "${res.product.name}" successfully saved!`);
        setEditingProduct(null);
        setIsAddMode(false);
      } else {
        showToast(`Error: ${res.error || "Could not save product"}`);
      }
    } catch {
      showToast("Error updating product on server.");
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      const res = await deleteProductAction(id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast(`✓ Flacon "${name}" deleted.`);
      }
    } catch {
      showToast("Error deleting product.");
    }
  };

  // Handle Order Status Change
  const handleOrderStatusChange = async (orderNumber: string, newStatus: StoreOrder["status"]) => {
    try {
      const res = await updateOrderStatusAction(orderNumber, newStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: newStatus } : o))
        );
        showToast(`✓ Order #${orderNumber} marked as ${newStatus}`);
      }
    } catch {
      showToast("Failed to update order status.");
    }
  };

  // Handle Save Settings
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await saveSettingsAction(settings);
      if (res.success && res.settings) {
        setSettings(res.settings);
        showToast("✓ Store settings updated across the website!");
      }
    } catch {
      showToast("Error saving store settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Template for creating brand new perfume
  const createNewProductTemplate = (): PerfumeItem => ({
    id: 0,
    slug: "",
    name: "",
    category: "Woody & Oud",
    price: "PKR 10,000",
    priceNum: 10000,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1200",
    notes: "Top notes, heart notes, base notes",
    topNotes: "Calabrian Bergamot",
    heartNotes: "Artisanal Rose Absolute",
    baseNotes: "Aged Oud & Golden Amber",
    concentration: "Extrait de Parfum (30% Oil)",
    volume: "50ml / 1.7 FL. OZ.",
    description: "An extraordinary extrait de parfum formulated with raw botanical oils.",
    badge: "New Release",
    sillage: "Commanding & Royal",
    longevity: "18+ Hours",
    bestOccasion: "Evenings & Signature Presence",
    season: "All Year",
    gender: "Unisex — Regal Distinction",
    story: "Hand-poured in small batches after 90 days of cold maturation."
  });

  return (
    <div className="min-h-screen bg-[#0F0F11] text-zinc-100 selection:bg-[#C5A880] selection:text-black">
      
      {/* Toast Alert Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-6 right-6 z-50 bg-[#C5A880] text-zinc-950 font-bold px-6 py-3.5 shadow-2xl text-xs tracking-wider flex items-center gap-3 border border-amber-300"
          >
            <CheckCircle2 className="w-4 h-4 text-zinc-950" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Luxury Executive Bar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40 px-3.5 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <Link href="/" className="group flex items-baseline gap-2">
              <span className="font-serif text-xl sm:text-2xl font-light tracking-[0.35em] uppercase text-white group-hover:text-[#C5A880] transition-colors">
                Aura
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#C5A880] uppercase">
                Executive Desk
              </span>
            </Link>
            <span className="inline-block px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider">
              ● Live Store
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <Link
              href="/"
              target="_blank"
              className="px-3 sm:px-4 py-2 border border-zinc-700 hover:border-white text-[11px] sm:text-xs font-bold tracking-widest uppercase text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/perfumes"
              target="_blank"
              className="px-3 sm:px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-zinc-300 hover:text-white transition-colors shrink-0"
            >
              <span>Catalog</span>
            </Link>
            <button
              onClick={() => {
                setEditingProduct(createNewProductTemplate());
                setIsAddMode(true);
              }}
              className="px-3.5 sm:px-4 py-2 bg-[#C5A880] hover:bg-[#b5956a] text-zinc-950 text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase transition-all flex items-center gap-1.5 shrink-0 shadow-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Flacon</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-5 sm:py-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-zinc-800 mb-6 sm:mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Overview & Analytics", icon: TrendingUp },
            { id: "products", label: `Perfume Flacons (${products.length})`, icon: Layers },
            { id: "orders", label: `Client Orders (${orders.length})`, icon: Package },
            { id: "settings", label: "Store Controls & Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 pb-4 px-5 text-xs font-bold tracking-[0.2em] uppercase transition-colors relative whitespace-nowrap ${
                  isActive ? "text-[#C5A880]" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="adminTabLine"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-[#C5A880]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW & ANALYTICS                                    */}
        {/* ============================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 bg-zinc-900/70 border border-zinc-800 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-zinc-400 text-xs font-bold tracking-widest uppercase">
                    Gross Store Revenue
                  </span>
                  <div className="p-2 bg-amber-500/10 text-[#C5A880] rounded">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-light text-white mb-1">
                  PKR {totalRevenue.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-400 font-mono">
                  Verified orders (COD + Raast)
                </p>
              </div>

              <div className="p-6 bg-zinc-900/70 border border-zinc-800 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-zinc-400 text-xs font-bold tracking-widest uppercase">
                    Total Client Orders
                  </span>
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-light text-white mb-1">
                  {orders.length}
                </div>
                <p className="text-[11px] text-zinc-400 font-mono">
                  {pendingOrdersCount} awaiting courier dispatch
                </p>
              </div>

              <div className="p-6 bg-zinc-900/70 border border-zinc-800 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-zinc-400 text-xs font-bold tracking-widest uppercase">
                    Active Fragrances
                  </span>
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-light text-white mb-1">
                  {activeProductsCount} Flacons
                </div>
                <p className="text-[11px] text-[#C5A880] font-mono">
                  Extrait de Parfum Formulations
                </p>
              </div>

              <div className="p-6 bg-zinc-900/70 border border-zinc-800 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-zinc-400 text-xs font-bold tracking-widest uppercase">
                    Concierge WhatsApp
                  </span>
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-mono text-xl font-bold text-white mb-1">
                  {settings.whatsappNumber}
                </div>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Active Nationwide Desk
                </p>
              </div>

            </div>

            {/* Quick Actions & Recent Orders Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Recent Orders Table */}
              <div className="lg:col-span-8 p-6 bg-zinc-900/50 border border-zinc-800">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-serif text-xl font-light text-white">Recent Client Orders</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Real-time orders placed via storefront & checkout</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs text-[#C5A880] hover:underline font-bold tracking-wider uppercase"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px]">
                        <th className="pb-3">Order Ref</th>
                        <th className="pb-3">Client</th>
                        <th className="pb-3">City</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-sans">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.orderNumber} className="hover:bg-zinc-800/30">
                          <td className="py-3 font-mono text-[#C5A880] font-bold">#{ord.orderNumber}</td>
                          <td className="py-3 font-medium text-white">{ord.customerName}</td>
                          <td className="py-3 text-zinc-400">{ord.customerCity}</td>
                          <td className="py-3 font-serif font-bold text-white">PKR {ord.total?.toLocaleString()}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                              ord.status === "DELIVERED"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : ord.status === "SHIPPED"
                                ? "bg-blue-500/20 text-blue-400"
                                : ord.status === "CONFIRMED"
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <a
                              href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, "")}?text=Salam%20${encodeURIComponent(ord.customerName)}!%20Your%20order%20%23${ord.orderNumber}%20is%20${ord.status}.`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold tracking-wider uppercase"
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

              {/* Quick Store Health Card */}
              <div className="lg:col-span-4 p-6 bg-zinc-900/50 border border-zinc-800 space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-light text-white">Store Health & Policies</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Global parameters active</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-400">Cash on Delivery (COD)</span>
                    <span className="font-bold text-emerald-400">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-400">Nationwide Free Express</span>
                    <span className="font-bold text-emerald-400">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-400">Discovery Coffret Price</span>
                    <span className="font-bold text-[#C5A880]">PKR {settings.discoveryPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-400">2ml Risk-Free Trial Guarantee</span>
                    <span className="font-bold text-emerald-400">ENABLED</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("settings")}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold tracking-[0.2em] uppercase transition-colors"
                >
                  Configure Store Settings
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: FRAGRANCE FLACONS (CONTROL EVERY PRODUCT & FUNCTION)   */}
        {/* ============================================================== */}
        {activeTab === "products" && (
          <div className="space-y-6">
            
            {/* Product Control Bar (Search, Filters, Add Button) */}
            <div className="p-4 bg-zinc-900/70 border border-zinc-800 flex flex-col md:flex-row gap-4 items-center justify-between">
              
              <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search fragrance by name, note, or profile..."
                    className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:border-[#C5A880] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                {["All", "Woody & Oud", "Floral & Rose", "Fresh & Citrus", "Warm Gourmand"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProductCategoryFilter(cat)}
                    className={`px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors border ${
                      productCategoryFilter === cat
                        ? "bg-[#C5A880] text-zinc-950 border-[#C5A880]"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setEditingProduct(createNewProductTemplate());
                  setIsAddMode(true);
                }}
                className="px-5 py-2.5 bg-[#C5A880] text-zinc-950 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#b5956a] transition-all flex items-center gap-2 shrink-0 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Flacon</span>
              </button>

            </div>

            {/* Products Grid / Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Visual Flacon Header */}
                    <div className="relative aspect-[16/10] bg-zinc-950 overflow-hidden border-b border-zinc-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {p.badge && (
                          <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-[#C5A880] text-[9px] font-bold tracking-widest uppercase border border-amber-500/30">
                            {p.badge}
                          </span>
                        )}
                        <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-white text-[9px] font-mono border border-zinc-700">
                          {p.volume}
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-3">
                        <span className="px-3 py-1 bg-zinc-950/90 text-white font-serif text-sm font-bold border border-zinc-700">
                          {p.price}
                        </span>
                      </div>
                    </div>

                    {/* Flacon Attributes Body */}
                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#C5A880]">
                          {p.category}
                        </span>
                        <h4 className="font-serif text-2xl font-light text-white mt-0.5">{p.name}</h4>
                        <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{p.concentration}</p>
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>

                      {/* Olfactory Pyramid Summary */}
                      <div className="p-3 bg-zinc-950 border border-zinc-800/80 space-y-1 text-[11px]">
                        <p><span className="text-[#C5A880] font-bold">Top:</span> <span className="text-zinc-300">{p.topNotes}</span></p>
                        <p><span className="text-[#C5A880] font-bold">Heart:</span> <span className="text-zinc-300">{p.heartNotes}</span></p>
                        <p><span className="text-[#C5A880] font-bold">Base:</span> <span className="text-zinc-300">{p.baseNotes}</span></p>
                      </div>

                      {/* Performance Specs */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400">
                        <div><span className="text-zinc-500 block uppercase font-bold">Longevity</span> {p.longevity}</div>
                        <div><span className="text-zinc-500 block uppercase font-bold">Sillage</span> {p.sillage}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct({ ...p });
                        setIsAddMode(false);
                      }}
                      className="px-4 py-2 bg-zinc-800 hover:bg-[#C5A880] hover:text-black text-white text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5 flex-1 justify-center"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit All Functions</span>
                    </button>

                    <Link
                      href={`/perfumes/${p.slug}`}
                      target="_blank"
                      className="p-2 border border-zinc-700 hover:border-white text-zinc-300 hover:text-white transition-colors"
                      title="Preview on Live Site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-2 border border-red-900/40 text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Flacon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CLIENT ORDERS & LOGISTICS                               */}
        {/* ============================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            
            {/* Order Filter Bar */}
            <div className="p-4 bg-zinc-900/70 border border-zinc-800 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order #, client name, or phone..."
                  className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                {["All", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors border ${
                      orderStatusFilter === st
                        ? "bg-[#C5A880] text-zinc-950 border-[#C5A880]"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-zinc-900/60 border border-zinc-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px] bg-zinc-950/80">
                    <th className="p-4">Order Ref</th>
                    <th className="p-4">Client Information</th>
                    <th className="p-4">Delivery Address</th>
                    <th className="p-4">Flacons Ordered</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Status & Dispatch</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-zinc-500">
                        No orders found matching this search.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.orderNumber} className="hover:bg-zinc-800/30">
                        
                        {/* Order Ref & Payment Method */}
                        <td className="p-4 align-top">
                          <span className="font-mono text-[#C5A880] font-bold block text-sm">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono block mt-1">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                          <span className="inline-block mt-2 px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[9px] font-bold tracking-wider uppercase">
                            {ord.paymentMethod}
                          </span>
                        </td>

                        {/* Customer Info */}
                        <td className="p-4 align-top">
                          <p className="font-bold text-white text-sm">{ord.customerName}</p>
                          <p className="font-mono text-zinc-400 text-xs mt-0.5">{ord.customerPhone}</p>
                          <span className="text-[11px] text-[#C5A880] font-medium">{ord.customerCity}</span>
                        </td>

                        {/* Address & Notes */}
                        <td className="p-4 align-top max-w-xs">
                          <p className="text-zinc-300 leading-relaxed text-xs">{ord.customerAddress}</p>
                          {ord.notes && (
                            <p className="text-[11px] text-amber-300/80 mt-1 italic">
                              📝 Note: {ord.notes}
                            </p>
                          )}
                        </td>

                        {/* Ordered Items */}
                        <td className="p-4 align-top">
                          <div className="space-y-1">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="text-zinc-300 text-xs">
                                <span className="font-bold text-white">{it.quantity}x</span> {it.name}
                                <span className="text-zinc-500 text-[11px]"> (PKR {it.price?.toLocaleString()})</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Total Amount */}
                        <td className="p-4 align-top">
                          <span className="font-serif text-base font-bold text-white block">
                            PKR {ord.total?.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-emerald-400">Free Express</span>
                        </td>

                        {/* Status Dropdown */}
                        <td className="p-4 align-top">
                          <select
                            value={ord.status}
                            onChange={(e) => handleOrderStatusChange(ord.orderNumber, e.target.value as any)}
                            className="bg-zinc-950 border border-zinc-700 text-xs font-bold px-3 py-1.5 text-white focus:border-[#C5A880] focus:outline-none"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>

                        {/* Actions (WhatsApp Client) */}
                        <td className="p-4 align-top text-right space-y-2">
                          <a
                            href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, "")}?text=Salam%20${encodeURIComponent(ord.customerName)}!%20This%20is%20Aura%20Haute%20Parfumerie.%20Regarding%20your%20Order%20%23${ord.orderNumber}%20(PKR%20${ord.total?.toLocaleString()})%3A%20Status%20is%20now%20*${ord.status}*.%20Free%20express%20nationwide%20courier%20dispatched.`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold tracking-wider uppercase transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Client</span>
                          </a>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: STORE CONTROLS & SETTINGS (GLOBAL WEBSITE CONTROL)      */}
        {/* ============================================================== */}
        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSettingsSubmit} className="space-y-8">
              
              {/* Card 1: Identity & WhatsApp Desk */}
              <div className="p-8 bg-zinc-900/60 border border-zinc-800 space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-light text-white">Store Identity & WhatsApp Desk</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Control which WhatsApp number receives orders and consultation inquiries across the entire website.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                      WhatsApp Concierge Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      placeholder="e.g. 03098541632"
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 text-base sm:text-sm font-mono text-white focus:border-[#C5A880] focus:outline-none"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">This number is linked to all "Order on WhatsApp" buttons.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                      Customer Care Display Phone *
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.supportPhone}
                      onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                      placeholder="e.g. +92 309 8541632"
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 text-base sm:text-sm font-mono text-white focus:border-[#C5A880] focus:outline-none"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">Displayed in website footer and contact pages.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 text-base sm:text-sm text-white focus:border-[#C5A880] focus:outline-none"
                  />
                </div>
              </div>

              {/* Card 2: Top Announcement Bar Ticker */}
              <div className="p-8 bg-zinc-900/60 border border-zinc-800 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-light text-white">Top Announcement Ticker Bar</h3>
                    <p className="text-xs text-zinc-400 mt-1">The luxury banner displayed across the top of all pages.</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-zinc-300">
                    <input
                      type="checkbox"
                      checked={settings.tickerActive}
                      onChange={(e) => setSettings({ ...settings, tickerActive: e.target.checked })}
                      className="rounded border-zinc-700 text-[#C5A880] focus:ring-0"
                    />
                    <span>Active</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                    Announcement Ticker Text
                  </label>
                  <textarea
                    rows={2}
                    value={settings.announcementTicker}
                    onChange={(e) => setSettings({ ...settings, announcementTicker: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 text-xs font-mono text-white focus:border-[#C5A880] focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Card 3: Discovery Box & Payment Methods */}
              <div className="p-8 bg-zinc-900/60 border border-zinc-800 space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-light text-white">Discovery Coffret & Payment Methods</h3>
                  <p className="text-xs text-zinc-400 mt-1">Configure pricing and supported payment mechanisms.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                      Discovery Coffret Price (PKR)
                    </label>
                    <input
                      type="number"
                      value={settings.discoveryPrice}
                      onChange={(e) => setSettings({ ...settings, discoveryPrice: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 text-sm font-mono text-white focus:border-[#C5A880] focus:outline-none"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">Updates the 6x5ml discovery box price across the store.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                      Free Shipping Nationwide
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-700">
                      <input
                        type="checkbox"
                        checked={settings.freeShippingEnabled}
                        onChange={(e) => setSettings({ ...settings, freeShippingEnabled: e.target.checked })}
                        className="rounded border-zinc-700 text-[#C5A880] focus:ring-0"
                      />
                      <span className="text-xs font-medium text-white">100% Free Express Delivery Enabled</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <label className="flex items-center gap-3 p-3.5 bg-zinc-950 border border-zinc-800 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={settings.codEnabled}
                      onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                      className="rounded border-zinc-700 text-[#C5A880] focus:ring-0"
                    />
                    <span className="font-bold text-white">Cash on Delivery (COD)</span>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 bg-zinc-950 border border-zinc-800 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={settings.mobileWalletsEnabled}
                      onChange={(e) => setSettings({ ...settings, mobileWalletsEnabled: e.target.checked })}
                      className="rounded border-zinc-700 text-[#C5A880] focus:ring-0"
                    />
                    <span className="font-bold text-white">JazzCash / Easypaisa</span>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 bg-zinc-950 border border-zinc-800 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={settings.bankTransferEnabled}
                      onChange={(e) => setSettings({ ...settings, bankTransferEnabled: e.target.checked })}
                      className="rounded border-zinc-700 text-[#C5A880] focus:ring-0"
                    />
                    <span className="font-bold text-white">Raast & Bank Transfer</span>
                  </label>
                </div>
              </div>

              {/* Save Settings Button */}
              <button
                type="submit"
                disabled={isSavingSettings}
                className="w-full py-4.5 bg-[#C5A880] hover:bg-[#b5956a] text-zinc-950 text-xs font-bold tracking-[0.25em] uppercase transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingSettings ? "Saving Settings..." : "Save Store Configuration Globally"}</span>
              </button>

            </form>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* PRODUCT FULL EDIT / ADD MODAL (CONTROLS EVERY FUNCTION)       */}
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
              className="fixed inset-0 sm:inset-6 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[850px] max-h-[100vh] sm:max-h-[92vh] h-full sm:h-auto bg-zinc-950 z-50 shadow-2xl overflow-y-auto p-4 sm:p-10 border sm:border-zinc-800 text-white"
            >
              <div className="flex justify-between items-center pb-4 sm:pb-6 border-b border-zinc-800 mb-6">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-white">
                    {isAddMode ? "Add New Perfume Flacon" : `Edit Flacon: ${editingProduct.name}`}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-zinc-400 mt-1">
                    Control all olfactory notes, pricing, concentration, sillage, longevity, and imagery.
                  </p>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleProductFormSubmit} className="space-y-6">
                
                {/* 1. Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                      Flacon Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      placeholder="e.g. Oud Royale"
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-sm text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                      Category *
                    </label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-sm text-white focus:border-[#C5A880] focus:outline-none"
                    >
                      <option>Woody & Oud</option>
                      <option>Floral & Rose</option>
                      <option>Fresh & Citrus</option>
                      <option>Warm Gourmand</option>
                      <option>Aquatic & Marine</option>
                    </select>
                  </div>
                </div>

                {/* 2. Pricing & Concentration */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                      Price (PKR Number) *
                    </label>
                    <input
                      type="number"
                      required
                      value={editingProduct.priceNum}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setEditingProduct({
                          ...editingProduct,
                          priceNum: val,
                          price: `PKR ${val.toLocaleString()}`
                        });
                      }}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-sm font-mono text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                      Volume
                    </label>
                    <input
                      type="text"
                      value={editingProduct.volume}
                      onChange={(e) => setEditingProduct({ ...editingProduct, volume: e.target.value })}
                      placeholder="50ml / 1.7 FL. OZ."
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-sm font-mono text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                      Concentration
                    </label>
                    <input
                      type="text"
                      value={editingProduct.concentration}
                      onChange={(e) => setEditingProduct({ ...editingProduct, concentration: e.target.value })}
                      placeholder="Extrait de Parfum (32% Oil)"
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-sm text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. Image URL & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                      Flacon Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-base sm:text-xs font-mono text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                      Badge Label
                    </label>
                    <select
                      value={editingProduct.badge || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value || undefined })}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-base sm:text-sm text-white focus:border-[#C5A880] focus:outline-none"
                    >
                      <option value="">No Badge</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="Private Reserve">Private Reserve</option>
                      <option value="Trending">Trending</option>
                      <option value="Signature Fresh">Signature Fresh</option>
                      <option value="Winter Favorite">Winter Favorite</option>
                      <option value="High Summer">High Summer</option>
                    </select>
                  </div>
                </div>

                {/* 4. Olfactory Architecture (Pyramid) */}
                <div className="p-4 bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#C5A880] block">
                    Olfactory Structure (Notes Breakdown)
                  </span>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">
                      Top Notes (Opening 15-30m)
                    </label>
                    <input
                      type="text"
                      value={editingProduct.topNotes}
                      onChange={(e) => setEditingProduct({ ...editingProduct, topNotes: e.target.value })}
                      placeholder="Calabrian Bergamot, Black Cardamom"
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-base sm:text-xs text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">
                      Heart Notes (2-6 Hours)
                    </label>
                    <input
                      type="text"
                      value={editingProduct.heartNotes}
                      onChange={(e) => setEditingProduct({ ...editingProduct, heartNotes: e.target.value })}
                      placeholder="Aged Cambodian Oud, Nutmeg"
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-base sm:text-xs text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">
                      Base Notes (Drydown 12-24h+)
                    </label>
                    <input
                      type="text"
                      value={editingProduct.baseNotes}
                      onChange={(e) => setEditingProduct({ ...editingProduct, baseNotes: e.target.value })}
                      placeholder="White Ambergris, Smoked Birch, Bourbon Vanilla"
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-base sm:text-xs text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">
                      General Notes Summary
                    </label>
                    <input
                      type="text"
                      value={editingProduct.notes}
                      onChange={(e) => setEditingProduct({ ...editingProduct, notes: e.target.value })}
                      placeholder="Oud, Amber, Bourbon Vanilla"
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-base sm:text-xs text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>
                </div>

                {/* 5. Performance Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                      Skin Longevity Meter
                    </label>
                    <input
                      type="text"
                      value={editingProduct.longevity}
                      onChange={(e) => setEditingProduct({ ...editingProduct, longevity: e.target.value })}
                      placeholder="e.g. 20+ Hours"
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-base sm:text-xs text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                      Sillage & Projection
                    </label>
                    <input
                      type="text"
                      value={editingProduct.sillage}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sillage: e.target.value })}
                      placeholder="e.g. Commanding & Royal"
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-base sm:text-xs text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>
                </div>

                {/* 6. Descriptions & Story */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                      Short Description (Card View)
                    </label>
                    <textarea
                      rows={2}
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-base sm:text-xs text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                      Full Artisanal Heritage Story
                    </label>
                    <textarea
                      rows={3}
                      value={editingProduct.story}
                      onChange={(e) => setEditingProduct({ ...editingProduct, story: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-base sm:text-xs text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-6 py-3 border border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProduct}
                    className="px-8 py-3 bg-[#C5A880] hover:bg-[#b5956a] text-zinc-950 text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-xl disabled:opacity-50"
                  >
                    {isSavingProduct ? "Saving..." : "Save Flacon to Website"}
                  </button>
                </div>

              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
