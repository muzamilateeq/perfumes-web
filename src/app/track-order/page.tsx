"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppConcierge from "@/components/WhatsAppConcierge";
import { 
  Search, 
  Truck, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight, 
  PackageCheck, 
  AlertCircle, 
  Phone, 
  Box, 
  RotateCcw 
} from "lucide-react";
import { trackOrderAction } from "@/app/actions/order";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface OrderItem {
  productId?: number | string;
  name: string;
  price: number;
  quantity: number;
}

interface TrackedOrder {
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCity: string;
  paymentMethod: string;
  total: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  items?: OrderItem[];
  notes?: string | null;
  trackingNumber: string;
  createdAt: string;
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleTrackQuery = async (searchVal: string) => {
    if (!searchVal.trim()) return;
    setIsSearching(true);
    setErrorMsg("");
    setResult(null);

    const res = await trackOrderAction(searchVal);
    setIsSearching(false);
    if (res.success && res.order) {
      setResult(res.order as TrackedOrder);
    } else {
      setErrorMsg(res.message || "No order found. Please check your reference ID or phone number.");
    }
  };

  useEffect(() => {
    const initialQuery = searchParams.get("q");
    if (initialQuery && initialQuery.trim()) {
      setQuery(initialQuery);
      handleTrackQuery(initialQuery);
    }
  }, [searchParams]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrackQuery(query);
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case "PENDING":
        return 1;
      case "CONFIRMED":
      case "PAID":
        return 2;
      case "SHIPPED":
        return 3;
      case "DELIVERED":
        return 4;
      case "CANCELLED":
        return 0;
      default:
        return 2;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          label: "PENDING VERIFICATION",
          subTitle: "Order Received • Verification in Progress",
          bg: "bg-amber-50 text-amber-900 border-amber-300",
          dot: "bg-amber-500",
          desc: "Your order has been recorded in our dispatch queue. Our concierge team is verifying the shipping details and preparing your parcel for cold-packaging."
        };
      case "CONFIRMED":
        return {
          label: "VERIFIED & PACKED",
          subTitle: "Order Verified • Luxury Packaging Complete",
          bg: "bg-blue-50 text-blue-900 border-blue-300",
          dot: "bg-blue-600",
          desc: "Order details have been verified. Your flacon has been securely packaged with our signature wax seal and complimentary 2ml matching trial vial."
        };
      case "SHIPPED":
        return {
          label: "IN TRANSIT (DISPATCHED)",
          subTitle: "Handed to Courier • En Route",
          bg: "bg-purple-50 text-purple-900 border-purple-300",
          dot: "bg-purple-600",
          desc: "Your parcel has been handed over to Express Courier (Trax / TCS) and is currently in transit to your destination. Expected delivery within 24–48 hours."
        };
      case "DELIVERED":
        return {
          label: "DELIVERED SUCCESSFULLY",
          subTitle: "Delivered to Doorstep • Payment Received",
          bg: "bg-emerald-50 text-emerald-900 border-emerald-300",
          dot: "bg-emerald-600",
          desc: "Your parcel has been successfully delivered to your doorstep, and Cash on Delivery payment has been completed."
        };
      case "CANCELLED":
        return {
          label: "CANCELLED",
          subTitle: "Order Cancelled",
          bg: "bg-rose-50 text-rose-900 border-rose-300",
          dot: "bg-rose-600",
          desc: "This order has been cancelled. For further assistance or to place a new order, please contact our WhatsApp Concierge."
        };
      default:
        return {
          label: status,
          subTitle: "Order Processing",
          bg: "bg-zinc-100 text-zinc-900 border-zinc-300",
          dot: "bg-zinc-500",
          desc: "Your order is currently being processed by our concierge team."
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-zinc-900 selection:bg-zinc-950 selection:text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-100 text-[#8C7355] text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase border border-zinc-200 mb-4">
              <Truck className="w-3.5 h-3.5 text-[#C5A880]" /> Live Dispatch & Courier Status
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-light text-zinc-950 tracking-tight">
              Track Your Aura Order
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 font-light mt-3 max-w-lg mx-auto leading-relaxed">
              Enter your <strong>Order Reference Number</strong> (e.g. <code>AUR-928104</code>) or your <strong>Mobile Number</strong> (e.g. <code>0300 1234567</code>) to check live courier dispatch status.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2 p-2 bg-white border border-zinc-300 shadow-md">
              <div className="flex items-center pl-3 text-zinc-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                placeholder="Enter Order # (AUR-123456) or Phone (03001234567)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-3 text-base sm:text-sm bg-transparent focus:outline-none text-zinc-900 placeholder:text-zinc-400"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="w-full sm:w-auto px-8 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold tracking-[0.22em] uppercase transition-colors shrink-0 shadow-sm disabled:opacity-50"
              >
                {isSearching ? "Searching..." : "Track Order"}
              </button>
            </form>

            {/* Quick Demo Search Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
              <span className="font-semibold text-zinc-700">Quick Try:</span>
              <button 
                type="button"
                onClick={() => { setQuery("AUR-928104"); handleTrackQuery("AUR-928104"); }}
                className="px-2.5 py-1 bg-white border border-zinc-200 hover:border-zinc-950 text-zinc-700 transition-colors"
              >
                AUR-928104 (Confirmed)
              </button>
              <button 
                type="button"
                onClick={() => { setQuery("AUR-651920"); handleTrackQuery("AUR-651920"); }}
                className="px-2.5 py-1 bg-white border border-zinc-200 hover:border-zinc-950 text-zinc-700 transition-colors"
              >
                AUR-651920 (Shipped)
              </button>
              <button 
                type="button"
                onClick={() => { setQuery("03001234567"); handleTrackQuery("03001234567"); }}
                className="px-2.5 py-1 bg-white border border-zinc-200 hover:border-zinc-950 text-zinc-700 transition-colors"
              >
                Phone: 03001234567
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3 mb-8 shadow-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-semibold">{errorMsg}</p>
                <p className="text-[11px] text-amber-700 mt-0.5">Please check if the order number or mobile number was typed correctly.</p>
              </div>
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div className="bg-white border border-zinc-200 shadow-md space-y-8 animate-fade-in overflow-hidden">
              
              {/* Top Status Header */}
              {(() => {
                const badge = getStatusBadge(result.status);
                return (
                  <div className={`p-6 sm:p-8 border-b ${badge.bg} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${badge.dot} animate-pulse`} />
                        <span className="text-xs font-black tracking-[0.25em] uppercase">
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-zinc-900">
                        {badge.subTitle}
                      </p>
                      <p className="text-xs text-zinc-600 max-w-xl font-light mt-1">
                        {badge.desc}
                      </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm p-3.5 border border-zinc-200/80 rounded-sm shrink-0 sm:text-right">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 block">Order Ref #</span>
                      <span className="font-serif text-xl font-bold text-zinc-950">{result.orderNumber}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="px-4 sm:px-10 pb-6 sm:pb-8 space-y-6 sm:space-y-8">
                
                {/* 4-Step Journey Timeline */}
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-6 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#8C7355]" /> Dispatch & Delivery Journey
                  </p>

                  <div className="relative pl-6 space-y-8 border-l-2 border-zinc-200 ml-3">
                    
                    {/* Step 1: Order Registered */}
                    <div className="relative">
                      <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-sm flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </span>
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">01. Order Placed & Logged</h4>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {new Date(result.createdAt).toLocaleDateString("en-PK", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Order registered in system with {result.paymentMethod === "COD" ? "Cash on Delivery" : "Bank Transfer"}.
                      </p>
                    </div>

                    {/* Step 2: Quality Checked & Sealed */}
                    <div className="relative">
                      <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                        getStatusStep(result.status) >= 2 ? "bg-emerald-600 text-white" : "bg-zinc-300"
                      }`} />
                      <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">02. Verified & Sealed with Trial Tester</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Perfume flacon cold-packed in luxury coffret with complimentary 2ml matching sample vial.
                      </p>
                    </div>

                    {/* Step 3: Courier In-Transit */}
                    <div className="relative">
                      <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                        getStatusStep(result.status) >= 3 ? "bg-emerald-600 text-white" : "bg-zinc-300"
                      }`} />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">03. Handed to Courier (Trax / TCS Express)</h4>
                        {result.trackingNumber && (
                          <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 inline-block w-fit">
                            Tracking: {result.trackingNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        En route via express delivery to destination city: <strong>{result.customerCity}</strong>.
                      </p>
                    </div>

                    {/* Step 4: Doorstep Delivery */}
                    <div className="relative">
                      <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                        getStatusStep(result.status) >= 4 ? "bg-emerald-600 text-white" : "bg-zinc-300"
                      }`} />
                      <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">04. Delivered & Payment Completed</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Rider delivers to client doorstep. Pay in cash after doorstep inspection.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Ordered Items Breakdown */}
                {result.items && result.items.length > 0 && (
                  <div className="border border-zinc-200 bg-[#FAF9F8] p-4 sm:p-5">
                    <p className="text-xs font-bold tracking-widest uppercase text-zinc-700 mb-3 flex items-center gap-2">
                      <Box className="w-3.5 h-3.5 text-[#8C7355]" /> Ordered Fragrances ({result.items.length})
                    </p>
                    <div className="divide-y divide-zinc-200">
                      {result.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-semibold text-zinc-900">{item.name}</span>
                            <span className="text-zinc-500 text-[11px] block">Qty: {item.quantity}</span>
                          </div>
                          <span className="font-serif font-bold text-zinc-950">
                            PKR {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Details Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 bg-white border border-zinc-200 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold tracking-wider">Client Name</span>
                    <span className="font-semibold text-zinc-900 mt-0.5 block">{result.customerName}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold tracking-wider">Destination City</span>
                    <span className="font-semibold text-zinc-900 mt-0.5 block">{result.customerCity}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold tracking-wider">Payment Mode</span>
                    <span className="font-semibold text-zinc-900 mt-0.5 block">
                      {result.paymentMethod === "COD" ? "Cash on Delivery" : "Direct Transfer"}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold tracking-wider">Total Payable</span>
                    <span className="font-serif font-bold text-zinc-950 text-base mt-0.5 block">
                      PKR {result.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Delivery Address Details */}
                {result.customerAddress && (
                  <div className="p-4 bg-zinc-50 border border-zinc-200 text-xs flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-zinc-700 block uppercase tracking-wider text-[10px]">Delivery Address</span>
                      <span className="text-zinc-600 mt-0.5 block font-light leading-relaxed">
                        {result.customerAddress}, {result.customerCity}
                      </span>
                    </div>
                  </div>
                )}

                {/* Live WhatsApp Inquiry Action */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href={buildWhatsAppUrl(`Hello Aura Team, I have a tracking inquiry regarding Order #${result.orderNumber} (${result.customerName}, ${result.customerCity}). Status is *${result.status}*. Please provide a courier dispatch update.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-4 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2.5 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire Live on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => { setResult(null); setQuery(""); }}
                    className="px-6 py-4 border border-zinc-300 hover:border-zinc-950 text-zinc-700 text-xs font-bold tracking-wider uppercase transition-colors"
                  >
                    Track Another
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Help Box */}
          <div className="mt-12 p-6 bg-white border border-zinc-200 text-center text-xs text-zinc-600 font-light space-y-2 shadow-sm">
            <p>
              📦 <strong>Dispatch Schedule:</strong> All orders confirmed before 4:00 PM are dispatched on the same business day.
            </p>
            <p>
              🚚 <strong>Courier Times:</strong> Karachi: 24 to 48 hours. Lahore, Islamabad & other major hubs: 48 to 72 hours.
            </p>
            <p className="text-[11px] text-zinc-400 pt-1">
              Need immediate dispatch assistance? Contact our helpline directly on WhatsApp at <strong>+92 309 8541632</strong>.
            </p>
          </div>

        </div>
      </main>

      <SiteFooter />
      <WhatsAppConcierge />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#8C7355] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-xs tracking-widest uppercase text-zinc-500">Loading Order Tracking...</p>
          </div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
