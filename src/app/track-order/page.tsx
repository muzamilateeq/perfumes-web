"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppConcierge from "@/components/WhatsAppConcierge";
import { 
  Search, 
  Truck, 
  PackageCheck, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";
import { trackOrderAction } from "@/app/actions/order";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    setErrorMsg("");
    setResult(null);

    const res = await trackOrderAction(query);
    setIsSearching(false);
    if (res.success && res.order) {
      setResult(res.order);
    } else {
      setErrorMsg(res.message || "No order found. Please check reference ID or contact concierge.");
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case "PENDING":
        return 1;
      case "PAID":
        return 2;
      case "SHIPPED":
        return 3;
      case "DELIVERED":
        return 4;
      default:
        return 2;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-zinc-900 selection:bg-zinc-950 selection:text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 text-[#8C7355] text-[10px] font-bold tracking-[0.28em] uppercase border border-zinc-200 mb-4">
              <Truck className="w-3.5 h-3.5" /> Nationwide Express Tracking
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-light text-zinc-950">
              Track Your Aura Dispatch
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 font-light mt-3 max-w-md mx-auto leading-relaxed">
              Enter your Order Reference number (e.g. <strong>AUR-829104</strong>) or contact phone number to view live courier status.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleTrack} className="mb-12">
            <div className="flex gap-2 p-2 bg-white border border-zinc-300 shadow-md">
              <div className="flex items-center pl-3 text-zinc-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                placeholder="Enter Order Reference # or Mobile (e.g. AUR-123456)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-3 text-xs sm:text-sm bg-transparent focus:outline-none text-zinc-900 placeholder:text-zinc-400"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 sm:px-8 py-3 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold tracking-[0.2em] uppercase transition-colors shrink-0"
              >
                {isSearching ? "Searching..." : "Track"}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-sm mb-8 text-center">
              {errorMsg}
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div className="bg-white border border-zinc-200 p-8 sm:p-10 shadow-sm space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 block mb-1">
                    Order Reference
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-zinc-950">{result.orderNumber}</h3>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 block mb-1">
                    Courier Tracking (Trax / TCS)
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 border border-emerald-200 inline-block">
                    {result.trackingNumber}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-6">
                  Live Dispatch Journey
                </p>

                <div className="relative pl-6 space-y-8 border-l-2 border-zinc-200 ml-3">
                  {/* Step 1 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-sm flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </span>
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">01. Order Verified & Registered</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Order confirmed for Cash on Delivery. Dispatched from formulation facility.</p>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                      getStatusStep(result.status) >= 2 ? "bg-emerald-600 text-white" : "bg-zinc-300"
                    }`} />
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">02. Sealed with Complimentary Trial Vial</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Packaged in velvet pouch with risk-free 2ml matching tester vial.</p>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                      getStatusStep(result.status) >= 3 ? "bg-emerald-600 text-white" : "bg-zinc-300"
                    }`} />
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">03. In Transit with Express Courier</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Package moving via express air/surface courier to destination city: {result.customerCity}.</p>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                      getStatusStep(result.status) >= 4 ? "bg-emerald-600 text-white" : "bg-zinc-300"
                    }`} />
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">04. Delivered & COD Collected</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Delivered to client doorstep.</p>
                  </div>
                </div>
              </div>

              {/* Order Meta Strip */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase font-bold tracking-wider">Client</span>
                  <span className="font-semibold text-zinc-900">{result.customerName}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase font-bold tracking-wider">Destination</span>
                  <span className="font-semibold text-zinc-900">{result.customerCity}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase font-bold tracking-wider">Total Payable</span>
                  <span className="font-serif font-bold text-zinc-950 text-sm">PKR {result.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={buildWhatsAppUrl(`Salam! I am inquiring about tracking my order #${result.orderNumber} with courier tracking: ${result.trackingNumber}. Please give me current update.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Check Live Update on WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* Help Box */}
          <div className="mt-12 p-6 bg-white border border-zinc-200 text-center text-xs text-zinc-500 font-light">
            <p>
              Orders are dispatched daily by 4:00 PM PKT. Delivery arrives in 48-72 hours for major hubs.
            </p>
            <p className="mt-1">
              Need assistance? Speak directly with our dispatch manager on WhatsApp at <strong>+92 309 8541632</strong>.
            </p>
          </div>

        </div>
      </main>

      <SiteFooter />
      <WhatsAppConcierge />
    </div>
  );
}
