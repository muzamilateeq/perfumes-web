"use client";

import { useState, useEffect } from "react";
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
  LogOut,
  Tag,
  Percent,
  Upload,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PerfumeItem, PERFUMES_DATA } from "@/lib/perfumes";
import { StoreSettings, StoreOrder, StoreCoupon, StoreReview } from "@/lib/storeTypes";
import { 
  saveProductAction, 
  deleteProductAction, 
  saveSettingsAction, 
  updateOrderStatusAction,
  updateProductStockAction,
  logoutAdminAction 
} from "@/app/actions/admin";
import {
  getCouponsAction,
  createCouponAction,
  deleteCouponAction,
  toggleCouponStatusAction,
} from "@/app/actions/coupon";
import {
  getAdminReviewsAction,
  updateReviewStatusAction,
  deleteReviewAction,
} from "@/app/actions/review";

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
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "coupons" | "reviews" | "settings" | "content">("overview");

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

  // Coupons State
  const [coupons, setCoupons] = useState<StoreCoupon[]>([]);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<{
    code: string;
    discountType: "PERCENT" | "FIXED";
    discountValue: number;
    minOrderAmount: number;
    maxUses?: number;
  }>({
    code: "",
    discountType: "PERCENT",
    discountValue: 10,
    minOrderAmount: 0,
  });
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);

  // Reviews State
  const [adminReviews, setAdminReviews] = useState<any[]>([]);
  const [reviewFilter, setReviewFilter] = useState<string>("All");

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load Coupons & Reviews on Mount
  useEffect(() => {
    loadCoupons();
    loadAdminReviews();
  }, []);

  const loadCoupons = async () => {
    try {
      const res = await getCouponsAction();
      if (res.success && res.coupons) {
        setCoupons(res.coupons as any);
      }
    } catch {}
  };

  const loadAdminReviews = async () => {
    try {
      const res = await getAdminReviewsAction();
      if (res.success && res.reviews) {
        setAdminReviews(res.reviews);
      }
    } catch {}
  };

  // Quick Stock Adjustment Handler
  const handleQuickStockUpdate = async (productId: number, newStock: number) => {
    try {
      const res = await updateProductStockAction(productId, newStock);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
        );
        showToast(res.message || "Stock updated successfully");
      } else {
        showToast(res.error || "Failed to update stock");
      }
    } catch {
      showToast("Network error updating stock");
    }
  };

  // Coupon Handlers
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;

    setIsCreatingCoupon(true);
    try {
      const res = await createCouponAction(newCoupon);
      if (res.success && res.coupon) {
        setCoupons((prev) => [res.coupon!, ...prev]);
        setIsCouponModalOpen(false);
        setNewCoupon({
          code: "",
          discountType: "PERCENT",
          discountValue: 10,
          minOrderAmount: 0,
        });
        showToast(res.message || "Promo code created successfully");
      } else {
        showToast(res.error || "Failed to create coupon");
      }
    } catch {
      showToast("Error creating coupon");
    } finally {
      setIsCreatingCoupon(false);
    }
  };

  const handleToggleCoupon = async (id: string, currentStatus: boolean) => {
    try {
      const nextStatus = !currentStatus;
      const res = await toggleCouponStatusAction(id, nextStatus);
      if (res.success) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: nextStatus } : c))
        );
        showToast(res.message || "Coupon status updated");
      }
    } catch {
      showToast("Error updating coupon");
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!window.confirm(`Delete promo code "${code}"?`)) return;
    try {
      const res = await deleteCouponAction(id);
      if (res.success) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        showToast(`Promo code "${code}" deleted`);
      }
    } catch {
      showToast("Error deleting coupon");
    }
  };

  // Review Handlers
  const handleUpdateReviewStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await updateReviewStatusAction(id, status);
      if (res.success) {
        setAdminReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
        showToast(res.message || "Review status updated");
      }
    } catch {
      showToast("Error updating review");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("Permanently delete this review?")) return;
    try {
      const res = await deleteReviewAction(id);
      if (res.success) {
        setAdminReviews((prev) => prev.filter((r) => r.id !== id));
        showToast("Review deleted");
      }
    } catch {
      showToast("Error deleting review");
    }
  };

  // Product Editing / Modal State
  const [editingProduct, setEditingProduct] = useState<PerfumeItem | null>(null);
  const [isAddMode, setIsAddMode] = useState<boolean>(false);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [productSearch, setProductSearch] = useState<string>("");
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>("All");

  // Handle direct file upload for perfume image
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setEditingProduct((prev) =>
          prev
            ? {
                ...prev,
                image: data.url,
                bannerImage: data.url,
              }
            : null
        );
        showToast("New perfume picture uploaded successfully!");
      } else {
        showToast(data.error || "Failed to upload image");
      }
    } catch {
      showToast("Network error uploading image");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

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
    story: "Hand-poured into heavy crystal flacons with magnetic metal caps.",
    stock: 25,
    lowStockAlert: 5,
    batchNumber: "AUR-B26/01",
    maturation: "6 Months Cold Matured Extrait",
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
            { id: "coupons", label: `Promo & Coupons (${coupons.length})`, icon: Tag },
            { id: "reviews", label: `Patron Reviews (${adminReviews.length})`, icon: Star },
            { id: "content", label: "Story & Details CMS", icon: Sparkles },
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

                        {/* Inventory Stock & Quick Restock Pill */}
                        <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                              Stock Reserve:
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              (p.stock ?? 25) <= (p.lowStockAlert ?? 5)
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            }`}>
                              {(p.stock ?? 25) <= (p.lowStockAlert ?? 5) ? `⚠️ Only ${p.stock ?? 25} Left` : `${p.stock ?? 25} Flacons`}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-zinc-200/60">
                            <span className="text-[9px] font-mono text-zinc-400">Quick Adjust:</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleQuickStockUpdate(p.id, Math.max(0, (p.stock ?? 25) - 1))}
                                className="px-2 py-0.5 rounded bg-white hover:bg-zinc-200 border border-zinc-300 text-[10px] font-bold text-zinc-700 transition-colors"
                                title="Deduct 1 flacon"
                              >
                                -1
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickStockUpdate(p.id, (p.stock ?? 25) + 1)}
                                className="px-2 py-0.5 rounded bg-white hover:bg-zinc-200 border border-zinc-300 text-[10px] font-bold text-zinc-700 transition-colors"
                                title="Add 1 flacon"
                              >
                                +1
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickStockUpdate(p.id, (p.stock ?? 25) + 5)}
                                className="px-2.5 py-0.5 rounded bg-zinc-950 hover:bg-zinc-800 text-white text-[10px] font-bold transition-colors"
                                title="Restock +5 flacons"
                              >
                                +5
                              </button>
                            </div>
                          </div>

                          <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-between pt-0.5 border-t border-zinc-200/40">
                            <span>Batch: {p.batchNumber || "AUR-B26/01"}</span>
                            <span className="truncate max-w-[140px] text-right">{p.maturation || "6 Mo. Extrait"}</span>
                          </div>
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

        {/* ============================================================== */}
        {/* TAB 4: PROMO CODES & DISCOUNT COUPONS                          */}
        {/* ============================================================== */}
        {activeTab === "coupons" && (
          <div className="space-y-6">
            
            {/* Action Bar & Stats Banner */}
            <div className="p-5 sm:p-6 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8C7355] block mb-1">
                  VIP Concessions & Privilege Codes
                </span>
                <h3 className="font-serif text-2xl font-light text-zinc-950">
                  Luxury Promo & Coupon Engine
                </h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-xl">
                  Configure live promotional codes for checkout. Codes deduct automatically from cart subtotals and sync to orders.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCouponModalOpen(true)}
                className="px-5 py-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create Promo Code</span>
              </button>
            </div>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 block">Total Coupons</span>
                  <span className="font-serif text-2xl font-normal text-zinc-950">{coupons.length} Issued</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FAF7F2] text-[#8C7355] border border-[#EFECE6]">
                  <Tag className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 block">Active Status</span>
                  <span className="font-serif text-2xl font-normal text-emerald-700">
                    {coupons.filter(c => c.isActive).length} Live
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 block">Redemptions</span>
                  <span className="font-serif text-2xl font-normal text-zinc-950">
                    {coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)} Orders
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FAF7F2] text-[#8C7355] border border-[#EFECE6]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Coupons Grid / Cards */}
            {coupons.length === 0 ? (
              <div className="py-16 text-center bg-white border border-zinc-200 rounded-xl p-8">
                <Tag className="w-10 h-10 text-zinc-300 mx-auto mb-3" strokeWidth={1} />
                <h4 className="font-serif text-lg font-light text-zinc-900 mb-1">No Promo Codes Created Yet</h4>
                <p className="text-xs text-zinc-500 mb-4">Create your first client privilege code like WELCOME10 or EID2026.</p>
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-zinc-950 text-white text-xs font-bold tracking-wider uppercase hover:bg-zinc-800"
                >
                  Create Code
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className={`p-5 rounded-xl bg-white border transition-all flex flex-col justify-between shadow-xs ${
                      coupon.isActive ? "border-zinc-200 hover:border-zinc-400" : "border-zinc-200 opacity-60 bg-zinc-50/50"
                    }`}
                  >
                    <div>
                      {/* Top Bar: Code Tag + Status Switch */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded bg-[#FAF7F2] text-[#8C7355] font-mono font-bold text-xs tracking-widest uppercase border border-dashed border-[#C5A880]">
                            {coupon.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(coupon.code);
                              showToast(`Copied "${coupon.code}"`);
                            }}
                            className="p-1 text-zinc-400 hover:text-zinc-800 transition-colors"
                            title="Copy code"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            coupon.isActive
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-zinc-100 text-zinc-500 border border-zinc-200"
                          }`}
                        >
                          {coupon.isActive ? "Active" : "Disabled"}
                        </span>
                      </div>

                      {/* Value Display */}
                      <div className="mb-3">
                        <div className="font-serif text-2xl font-normal text-zinc-950">
                          {coupon.discountType === "PERCENT"
                            ? `${coupon.discountValue}% OFF`
                            : `PKR ${coupon.discountValue.toLocaleString()} OFF`}
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5 font-light">
                          {coupon.minOrderAmount > 0
                            ? `Requires min. order of PKR ${coupon.minOrderAmount.toLocaleString()}`
                            : "No minimum spend required"}
                        </p>
                      </div>

                      {/* Usage & Rules */}
                      <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100 text-xs text-zinc-600 space-y-1 font-mono text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Total Redeemed:</span>
                          <span className="font-bold text-zinc-900">
                            {coupon.usedCount} {coupon.maxUses ? `/ ${coupon.maxUses}` : ""} times
                          </span>
                        </div>
                        {coupon.maxUses && (
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Limit:</span>
                            <span className="text-zinc-900">{coupon.maxUses} uses total</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleCoupon(coupon.id, coupon.isActive)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors border ${
                          coupon.isActive
                            ? "border-amber-200 text-amber-800 hover:bg-amber-50"
                            : "border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                        }`}
                      >
                        {coupon.isActive ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete promo code"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: PATRON REVIEWS & LONGEVITY RATINGS MODERATION           */}
        {/* ============================================================== */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            
            {/* Header Strip */}
            <div className="p-5 sm:p-6 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8C7355] block mb-1">
                  Patron Consensus & Scent Longevity
                </span>
                <h3 className="font-serif text-2xl font-light text-zinc-950">
                  Verified Collector Reviews & Longevity Ratings
                </h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-xl">
                  Inspect client submissions, verify skin longevity reports (18h+), and approve authentic feedback for live perfume pages.
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-zinc-100 border border-zinc-200">
                {["All", "PENDING", "APPROVED", "REJECTED"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setReviewFilter(st)}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase transition-all ${
                      reviewFilter === st
                        ? "bg-white text-zinc-950 shadow-xs font-bold"
                        : "text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 block">Total Reviews</span>
                <span className="font-serif text-2xl font-normal text-zinc-950">{adminReviews.length}</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 block">Published Live</span>
                <span className="font-serif text-2xl font-normal text-emerald-700">
                  {adminReviews.filter((r) => r.status === "APPROVED").length} Approved
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 block">Pending Review</span>
                <span className="font-serif text-2xl font-normal text-amber-700">
                  {adminReviews.filter((r) => r.status === "PENDING").length} Waiting
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 block">Avg. Longevity</span>
                <span className="font-serif text-2xl font-normal text-[#8C7355]">18–20+ Hours</span>
              </div>
            </div>

            {/* Reviews List */}
            {(() => {
              const displayed = adminReviews.filter((r) =>
                reviewFilter === "All" ? true : r.status === reviewFilter
              );

              if (displayed.length === 0) {
                return (
                  <div className="py-16 text-center bg-white border border-zinc-200 rounded-xl p-8">
                    <Star className="w-10 h-10 text-zinc-300 mx-auto mb-3" strokeWidth={1} />
                    <h4 className="font-serif text-lg font-light text-zinc-900 mb-1">
                      No Reviews in &ldquo;{reviewFilter}&rdquo;
                    </h4>
                    <p className="text-xs text-zinc-500">
                      When patrons leave reviews on perfume detail pages, they will appear here.
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {displayed.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-zinc-950">{rev.userName}</span>
                          {rev.userCity && (
                            <span className="text-xs text-zinc-400 font-normal">• {rev.userCity}</span>
                          )}
                          <span className="px-2 py-0.5 rounded bg-[#FAF7F2] text-[#8C7355] text-[10px] font-bold uppercase tracking-wider border border-[#E8E2D8]">
                            Verified Patron
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              rev.status === "APPROVED"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : rev.status === "PENDING"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                          >
                            {rev.status}
                          </span>
                          <span className="text-xs text-zinc-400 ml-auto md:ml-0 font-mono">
                            {new Date(rev.createdAt).toLocaleDateString("en-PK", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Product Tag & Longevity */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-serif font-bold text-zinc-800">
                            Flacon: {rev.product?.name || "Bespoke Perfume"}
                          </span>
                          <span>•</span>
                          <div className="flex items-center text-amber-500">
                            {[1, 2, 3, 4, 5].map((st) => (
                              <Star
                                key={st}
                                className={`w-3.5 h-3.5 ${
                                  st <= rev.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span>•</span>
                          <span className="text-[11px] font-mono text-zinc-600 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded">
                            Longevity: <strong>{rev.longevityHours || "18+ Hours"}</strong>
                          </span>
                          <span className="text-[11px] font-mono text-zinc-600 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded">
                            Sillage: <strong>{rev.sillageRating || "Commanding"}</strong>
                          </span>
                        </div>

                        {/* Title & Comment */}
                        <div className="pt-1">
                          {rev.title && (
                            <h5 className="font-serif text-sm font-semibold text-zinc-950 mb-0.5">
                              &ldquo;{rev.title}&rdquo;
                            </h5>
                          )}
                          <p className="text-xs text-zinc-600 leading-relaxed font-light">
                            {rev.comment}
                          </p>
                        </div>
                      </div>

                      {/* Moderation Actions */}
                      <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100">
                        {rev.status !== "APPROVED" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateReviewStatus(rev.id, "APPROVED")}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}
                        {rev.status !== "REJECTED" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateReviewStatus(rev.id, "REJECTED")}
                            className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 border border-zinc-200"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

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

                {/* Dynamic Image Upload & Picture Management */}
                <div className="p-4 sm:p-5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8C7355] block">
                        Flacon Visual Presentation
                      </span>
                      <h4 className="font-serif text-base font-medium text-zinc-950">
                        Perfume Picture (Dynamic Upload & Live Sync)
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded">
                      JPG, PNG, WEBP
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {/* Live Thumbnail Preview */}
                    <div className="relative w-28 h-32 rounded-lg bg-zinc-200 border border-zinc-300 overflow-hidden shrink-0 shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={editingProduct.image || "/banners/oud-royale.png"}
                        alt={editingProduct.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 inset-x-1 text-center bg-zinc-950/85 text-white text-[8px] font-bold uppercase tracking-wider py-0.5 rounded-xs">
                        Live Preview
                      </span>
                    </div>

                    {/* Upload Controls & URL */}
                    <div className="flex-1 space-y-3 w-full">
                      {/* Direct Device Upload Button */}
                      <div>
                        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold tracking-wider uppercase cursor-pointer transition-colors shadow-xs">
                          {isUploadingImage ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C5A880]" />
                          ) : (
                            <Upload className="w-3.5 h-3.5 text-[#C5A880]" />
                          )}
                          <span>
                            {isUploadingImage ? "Uploading New Picture..." : "Upload New Picture from Device"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingImage}
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[11px] text-zinc-500 mt-1">
                          Click to select any perfume photo from your phone or laptop. It will dynamically save and reflect across the website!
                        </p>
                      </div>

                      {/* Direct Image URL input */}
                      <div>
                        <label className="block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1">
                          Or Paste Image URL directly
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.image}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              image: e.target.value,
                              bannerImage: e.target.value,
                            })
                          }
                          placeholder="https://... or /uploads/..."
                          className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fragrance Family (Category) */}
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                    Fragrance Family (Category)
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                  >
                    <option>Woody & Oud</option>
                    <option>Woody & Amber</option>
                    <option>Floral & Rose</option>
                    <option>Fresh & Citrus</option>
                    <option>Warm Gourmand</option>
                  </select>
                </div>

                {/* Inventory Stock & Artisanal Batch Specifications */}
                <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C7355] block">
                    Inventory Reserve & Batch Details
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-zinc-600 mb-1">Stock Reserve *</label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={editingProduct.stock ?? 25}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value, 10) || 0 })}
                        className="w-full px-3 py-2 rounded bg-white border border-zinc-200 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-zinc-600 mb-1">Low Stock Alert</label>
                      <input
                        type="number"
                        min={1}
                        value={editingProduct.lowStockAlert ?? 5}
                        onChange={(e) => setEditingProduct({ ...editingProduct, lowStockAlert: parseInt(e.target.value, 10) || 5 })}
                        className="w-full px-3 py-2 rounded bg-white border border-zinc-200 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-zinc-600 mb-1">Batch Code</label>
                      <input
                        type="text"
                        value={editingProduct.batchNumber || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, batchNumber: e.target.value })}
                        placeholder="e.g. AUR-B26/01"
                        className="w-full px-3 py-2 rounded bg-white border border-zinc-200 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-zinc-600 mb-1">Maturation Spec</label>
                      <input
                        type="text"
                        value={editingProduct.maturation || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, maturation: e.target.value })}
                        placeholder="e.g. 6 Mo. Extrait"
                        className="w-full px-3 py-2 rounded bg-white border border-zinc-200 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
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

      {/* ============================================================== */}
      {/* MODAL 3: CREATE LUXURY PROMO CODE MODAL                        */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isCouponModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCouponModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-4 sm:inset-6 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[540px] max-h-[90vh] overflow-y-auto bg-white border border-zinc-200 rounded-xl z-50 shadow-2xl p-6 sm:p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-zinc-200 mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-light text-zinc-950">
                    Create Luxury Promo Code
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Issue a privilege discount code for client checkout
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                    Promo Code (Uppercase, No Spaces) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VIP20 or EID1000"
                    value={newCoupon.code}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        code: e.target.value.toUpperCase().replace(/\s+/g, ""),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-sm font-mono tracking-wider font-bold text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Discount Type *
                    </label>
                    <select
                      value={newCoupon.discountType}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          discountType: e.target.value as "PERCENT" | "FIXED",
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                    >
                      <option value="PERCENT">Percentage (% Off)</option>
                      <option value="FIXED">Flat PKR (PKR Off)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      {newCoupon.discountType === "PERCENT" ? "Discount Percentage (%)" : "Flat Amount (PKR)"} *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={newCoupon.discountType === "PERCENT" ? 100 : undefined}
                      value={newCoupon.discountValue || ""}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          discountValue: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder={newCoupon.discountType === "PERCENT" ? "15" : "1000"}
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-sm font-mono text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Min. Order Spend (PKR)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={newCoupon.minOrderAmount || ""}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          minOrderAmount: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0 (Any order)"
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Max Redemptions Cap
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={newCoupon.maxUses || ""}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          maxUses: e.target.value ? parseInt(e.target.value, 10) : undefined,
                        })
                      }
                      placeholder="Optional (e.g. 50)"
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setIsCouponModalOpen(false)}
                    className="px-5 py-2.5 rounded-lg border border-zinc-200 text-zinc-600 hover:text-zinc-950 text-xs font-bold tracking-wider uppercase transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingCoupon}
                    className="px-6 py-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-sm disabled:opacity-50"
                  >
                    {isCreatingCoupon ? "Creating..." : "Issue Promo Code"}
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
