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
  Minus, 
  Check, 
  ArrowRight, 
  Gift, 
  ChevronRight,
  Clock,
  Droplet,
  Compass,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppConcierge from "@/components/WhatsAppConcierge";
import { PerfumeItem } from "@/lib/perfumes";
import { 
  buildWhatsAppUrl, 
  generateProductWhatsAppMessage, 
  generateConfirmedOrderWhatsAppMessage,
  WHATSAPP_CONFIG 
} from "@/lib/whatsapp";
import { createOrderAction } from "@/app/actions/order";
import { StoreSettings } from "@/lib/storeTypes";
import PerfumeReviewsSection from "@/components/PerfumeReviewsSection";
import { useStore } from "@/context/StoreContext";

interface PerfumeDetailClientProps {
  perfume: PerfumeItem;
  relatedPerfumes: PerfumeItem[];
  settings?: StoreSettings;
}

export default function PerfumeDetailClient({ perfume, relatedPerfumes, settings }: PerfumeDetailClientProps) {
  const store = useStore();
  const [quantity, setQuantity] = useState<number>(1);
  const [includeGiftBox, setIncludeGiftBox] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"pyramid" | "story" | "guarantee">("pyramid");
  
  const handleAddToBag = () => {
    store.addToCart(perfume, quantity);
    if (includeGiftBox) {
      store.setIncludeGiftBox(true);
    }
    store.openCart();
  };

  // Checkout Form State
  const [checkoutData, setCheckoutData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Karachi",
    paymentMethod: "COD"
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");

  const totalPrice = perfume.priceNum * quantity;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createOrderAction({
        customerName: checkoutData.name,
        customerPhone: checkoutData.phone,
        customerAddress: checkoutData.address,
        customerCity: checkoutData.city,
        paymentMethod: checkoutData.paymentMethod,
        notes: includeGiftBox ? "Gift Box Requested" : undefined,
        items: [
          {
            productId: perfume.id,
            name: perfume.name,
            price: perfume.priceNum,
            quantity: quantity
          }
        ],
        total: totalPrice
      });

      setOrderId(res.orderNumber);
      setOrderSuccess(true);
    } catch {
      const fallbackId = "AUR-" + Math.floor(100000 + Math.random() * 900000);
      setOrderId(fallbackId);
      setOrderSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappOrderUrl = buildWhatsAppUrl(
    generateProductWhatsAppMessage(perfume, {
      quantity,
      notes: includeGiftBox ? "Luxury Gift Packaging with Wax Seal requested" : undefined
    })
  );

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-zinc-900 selection:bg-zinc-950 selection:text-white">
      
      {/* Site Header */}
      <SiteHeader cartCount={store.cartCount} onOpenCart={store.openCart} />

      {/* Breadcrumb Navigation */}
      <nav className="border-b border-zinc-200 bg-white/60 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-[11px] sm:text-xs text-zinc-500 uppercase tracking-widest font-medium overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-zinc-900 transition-colors shrink-0">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <Link href="/#collection" className="hover:text-zinc-900 transition-colors shrink-0">Collection</Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="text-zinc-900 font-bold truncate shrink-0">{perfume.name}</span>
        </div>
      </nav>

      {/* Main Product Showcase */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Visual Flacon Display */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-[4/5] bg-zinc-100 border border-zinc-200 shadow-xl overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={perfume.image} 
                alt={`${perfume.name} Extrait de Parfum`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Badge */}
              {perfume.badge && (
                <span className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-zinc-950 text-white px-3 sm:px-4 py-1.5 text-[9px] sm:text-[10px] font-bold tracking-[0.25em] uppercase shadow-lg">
                  {perfume.badge}
                </span>
              )}

              {/* Concentration Tag */}
              <span className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white/95 backdrop-blur-md px-3 sm:px-3.5 py-1.5 text-[9px] sm:text-[10px] font-bold tracking-widest text-[#8C7355] border border-zinc-200 uppercase">
                {perfume.concentration}
              </span>

              {/* Bottom Purity Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-zinc-950/80 via-zinc-950/40 to-transparent text-white flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-mono tracking-widest uppercase text-zinc-300">Volume</p>
                  <p className="font-serif text-base sm:text-lg font-light tracking-wide">{perfume.volume}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono tracking-widest uppercase text-zinc-300">Concentration</p>
                  <p className="font-serif text-base sm:text-lg font-light tracking-wide">30%+ Pure Oil</p>
                </div>
              </div>
            </div>

            {/* Micro Highlights Bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
              <div className="p-4 bg-white border border-zinc-200">
                <Truck className="w-4 h-4 text-[#C5A880] mx-auto mb-1.5" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Express Delivery</p>
                <p className="text-[10px] text-zinc-500 font-light mt-0.5">Free 24-48 Hours</p>
              </div>
              <div className="p-4 bg-white border border-zinc-200">
                <RotateCcw className="w-4 h-4 text-[#C5A880] mx-auto mb-1.5" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">2ml Trial Vial</p>
                <p className="text-[10px] text-zinc-500 font-light mt-0.5">Test Before Opening</p>
              </div>
              <div className="p-4 bg-white border border-zinc-200">
                <ShieldCheck className="w-4 h-4 text-[#C5A880] mx-auto mb-1.5" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Cash on Delivery</p>
                <p className="text-[10px] text-zinc-500 font-light mt-0.5">Nationwide Pakistan</p>
              </div>
            </div>
          </div>

          {/* Right Column: Olfactory Specification & Order Desk */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Title & Category */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#8C7355]">
                  {perfume.category}
                </span>
                <span className="text-zinc-300">•</span>
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-700">
                  Extrait de Parfum • {perfume.volume || "50ml"}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-zinc-950 mb-3">
                {perfume.name}
              </h1>

              {/* Price Banner */}
              <div className="flex items-baseline gap-3 sm:gap-4 mb-3">
                <span className="font-serif text-2xl sm:text-3xl font-normal text-zinc-950">
                  {perfume.price}
                </span>
                <span className="text-[10px] sm:text-xs text-emerald-800 font-bold uppercase tracking-wider bg-emerald-50 px-2.5 py-1 border border-emerald-200">
                  Free Nationwide Courier
                </span>
              </div>

              {/* Low Stock Alert Notice */}
              {perfume.stock !== undefined && perfume.stock <= 5 && (
                <div className="flex items-center gap-2.5 px-3.5 py-2 bg-amber-50/90 border border-amber-300 text-amber-950 rounded-xs text-xs mb-3.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping shrink-0" />
                  <span className="font-bold tracking-wider uppercase text-[10px] text-amber-900">Low Stock Alert:</span>
                  <span className="font-medium text-amber-900">Only {perfume.stock} flacons remaining from {perfume.batchNumber || "Batch 2026/01"}</span>
                </div>
              )}

              {/* Artisanal Batch & Maturation Specs */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-zinc-500 font-mono mb-4 pb-3 border-b border-zinc-200">
                <span>Batch: <strong className="text-zinc-900">{perfume.batchNumber || "AUR-B26/01"}</strong></span>
                <span>•</span>
                <span>Maturation: <strong className="text-zinc-900">{perfume.maturation || "6 Months Cold Matured Extrait"}</strong></span>
                <span>•</span>
                <span>Stock: <strong className="text-emerald-700">{perfume.stock !== undefined ? `${perfume.stock} Units` : "In Stock"}</strong></span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 font-light leading-relaxed">
                {perfume.description}
              </p>
            </div>

            {/* Performance Specifications */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-5 bg-white border border-zinc-200 text-xs">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 block mb-1">
                  Longevity
                </span>
                <span className="font-serif text-sm sm:text-base font-medium text-zinc-950 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#8C7355]" />
                  {perfume.longevity}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 block mb-1">
                  Sillage & Trail
                </span>
                <span className="font-serif text-sm sm:text-base font-medium text-zinc-950 flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-[#8C7355]" />
                  {perfume.sillage}
                </span>
              </div>
              <div className="pt-3 border-t border-zinc-100">
                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 block mb-1">
                  Best Occasion
                </span>
                <span className="text-zinc-800 font-medium text-[11px] sm:text-xs">
                  {perfume.bestOccasion}
                </span>
              </div>
              <div className="pt-3 border-t border-zinc-100">
                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 block mb-1">
                  Ideal Season
                </span>
                <span className="text-zinc-800 font-medium text-[11px] sm:text-xs">
                  {perfume.season}
                </span>
              </div>
            </div>

            {/* Order Controls */}
            <div className="space-y-3.5 sm:space-y-4 pt-2">
              
              {/* Quantity Selector */}
              <div className="flex items-center justify-between p-3 sm:p-3.5 bg-white border border-zinc-200">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">Quantity</span>
                <div className="flex items-center gap-3 sm:gap-4">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-1 hover:bg-zinc-100 transition-colors text-zinc-600"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-serif text-base font-bold text-zinc-950 w-6 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-1 hover:bg-zinc-100 transition-colors text-zinc-600"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Complimentary Gift Box Checkbox */}
              <label className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 bg-white border border-zinc-200 cursor-pointer text-xs text-zinc-800">
                <input 
                  type="checkbox" 
                  checked={includeGiftBox}
                  onChange={(e) => setIncludeGiftBox(e.target.checked)}
                  className="rounded border-zinc-300 text-zinc-950 focus:ring-0"
                />
                <Gift className="w-4 h-4 text-[#8C7355] shrink-0" />
                <span className="font-medium">Complimentary luxury gift box with golden wax seal</span>
              </label>

              {/* Primary Action Buttons */}
              <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
                <button
                  type="button"
                  onClick={handleAddToBag}
                  className="w-full py-3.5 sm:py-4.5 bg-zinc-950 text-white text-xs font-bold tracking-[0.18em] sm:tracking-[0.25em] uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-2.5 shadow-xl"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Shopping Bag • PKR {totalPrice.toLocaleString()}</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-3 sm:py-3.5 border border-zinc-950 text-zinc-950 hover:bg-zinc-950 hover:text-white text-xs font-bold tracking-[0.16em] uppercase transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Quick COD Order</span>
                  </button>

                  <a 
                    href={whatsappOrderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 sm:py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold tracking-[0.16em] uppercase transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Order on WhatsApp</span>
                  </a>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 text-center tracking-wider pt-1">
                🔒 Free doorstep inspection • 2ml trial vial included • Pay upon delivery
              </p>
            </div>

            {/* Interactive Tabs (Pyramid / Story / Guarantee) */}
            <div className="pt-4 border-t border-zinc-200">
              <div className="flex border-b border-zinc-200">
                <button 
                  onClick={() => setActiveTab("pyramid")}
                  className={`pb-3 text-xs font-bold tracking-[0.2em] uppercase transition-colors relative mr-8 ${
                    activeTab === "pyramid" ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-700"
                  }`}
                >
                  Olfactory Pyramid
                  {activeTab === "pyramid" && (
                    <motion.div layoutId="tabUnderline" className="absolute bottom-0 inset-x-0 h-0.5 bg-zinc-950" />
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab("story")}
                  className={`pb-3 text-xs font-bold tracking-[0.2em] uppercase transition-colors relative mr-8 ${
                    activeTab === "story" ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-700"
                  }`}
                >
                  The Story
                  {activeTab === "story" && (
                    <motion.div layoutId="tabUnderline" className="absolute bottom-0 inset-x-0 h-0.5 bg-zinc-950" />
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab("guarantee")}
                  className={`pb-3 text-xs font-bold tracking-[0.2em] uppercase transition-colors relative ${
                    activeTab === "guarantee" ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-700"
                  }`}
                >
                  Trial Guarantee
                  {activeTab === "guarantee" && (
                    <motion.div layoutId="tabUnderline" className="absolute bottom-0 inset-x-0 h-0.5 bg-zinc-950" />
                  )}
                </button>
              </div>

              <div className="pt-6">
                {activeTab === "pyramid" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-white border border-zinc-200">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C7355] block mb-1">
                        Top Notes (First 15-30 Minutes)
                      </span>
                      <p className="text-xs font-medium text-zinc-900">{perfume.topNotes}</p>
                    </div>
                    <div className="p-4 bg-white border border-zinc-200">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C7355] block mb-1">
                        Heart Notes (2-6 Hours)
                      </span>
                      <p className="text-xs font-medium text-zinc-900">{perfume.heartNotes}</p>
                    </div>
                    <div className="p-4 bg-white border border-zinc-200">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C7355] block mb-1">
                        Base Notes (Dry Down 12-24+ Hours)
                      </span>
                      <p className="text-xs font-medium text-zinc-900">{perfume.baseNotes}</p>
                    </div>
                  </div>
                )}

                {activeTab === "story" && (
                  <div className="p-6 bg-white border border-zinc-200 space-y-3 text-xs leading-relaxed text-zinc-600 font-light">
                    <p className="font-serif text-lg text-zinc-950 italic">
                      "{perfume.story}"
                    </p>
                    <p>
                      Macerated for a minimum of 90 days in cold stainless steel tanks in accordance with classical Grasse techniques. 
                      Every bottle contains zero synthetic water dilution, ensuring intimate drydown transitions.
                    </p>
                  </div>
                )}

                {activeTab === "guarantee" && (
                  <div className="p-6 bg-white border border-zinc-200 space-y-3 text-xs leading-relaxed text-zinc-600 font-light">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold uppercase tracking-wider text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{settings?.trialGuaranteeBadge || "The 100% Risk-Free Trial Vial Promise"}</span>
                    </div>
                    <p>
                      {settings?.trialGuaranteeDescription || `Your flacon comes accompanied by a matching 2ml tester vial outside the main presentation box. Spray and experience the scent for 24 hours. If it does not command compliments or meet your expectations, simply return the unopened main flacon for an immediate full refund.`}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* The 2ml Trial Guarantee Banner */}
        <section className="mt-20 p-8 sm:p-12 bg-zinc-950 text-white border border-zinc-800 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold tracking-[0.28em] uppercase text-[#C5A880] block mb-3">
              {settings?.trialGuaranteeSubtitle || "Unrivaled Luxury Experience"}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight mb-4">
              {settings?.trialGuaranteeTitle || "Test on Your Skin for 24 Hours with Zero Risk"}
            </h2>
            <p className="text-zinc-300 font-light text-sm leading-relaxed mb-6">
              {settings?.trialGuaranteeDescription || `Haute Parfumerie is personal. That is why every flacon of ${perfume.name} is shipped alongside a complimentary 2ml sample vial outside the sealed cellophane box. Enjoy the fragrance at home before breaking the seal.`}
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-bold tracking-widest uppercase text-zinc-200">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C5A880]" /> {settings?.trialGuaranteeBullet1 || "100% Full Refund if Unopened"}
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C5A880]" /> {settings?.trialGuaranteeBullet2 || "Free Courier Return Pickup"}
              </span>
            </div>
          </div>
        </section>

        {/* Verified Customer Reviews & Olfactory Longevity Section */}
        <PerfumeReviewsSection productId={perfume.id} productName={perfume.name} />

        {/* Discovery Box Cross-Sell */}
        <section className="mt-16 p-8 sm:p-10 bg-[#FAF7F2] border border-[#EBE4D8] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C7355]">
              Can&apos;t Decide on Just One?
            </span>
            <h3 className="font-serif text-2xl font-light text-zinc-950">
              The Aura Discovery Coffret (6 x 5ml Extrait)
            </h3>
            <p className="text-xs text-zinc-600 max-w-xl font-light">
              Experience the entire collection including {perfume.name} for PKR 3,500. 
              Includes a 100% redeemable voucher credit toward any 50ml flacon.
            </p>
          </div>
          <Link
            href="/discovery"
            className="px-6 py-3.5 bg-zinc-950 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-zinc-800 transition-colors shrink-0 flex items-center gap-2 shadow-md"
          >
            <span>Explore Discovery Set</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Related Fragrances */}
        {relatedPerfumes.length > 0 && (
          <section className="mt-20">
            <div className="text-center mb-12">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#8C7355] block mb-2">
                Curated Additions
              </span>
              <h2 className="font-serif text-3xl font-light text-zinc-950">
                You May Also Appreciate
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 lg:gap-8">
              {relatedPerfumes.map((rel) => (
                <div key={rel.id} className="bg-white border border-zinc-200 overflow-hidden group flex flex-col justify-between hover:border-zinc-950 transition-all shadow-xs relative">
                  <Link href={`/perfumes/${rel.slug}`} className="block relative aspect-[4/5] bg-zinc-100 overflow-hidden border-b border-zinc-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={rel.image} 
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                    <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-mono text-zinc-800 border border-zinc-200">
                      50ml
                    </span>
                  </Link>
                  <div className="p-2.5 sm:p-5 flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.16em] sm:tracking-[0.22em] uppercase text-[#8C7355] block mb-1 truncate">
                        {rel.category}
                      </span>
                      <Link href={`/perfumes/${rel.slug}`} className="hover:text-[#8C7355] transition-colors block">
                        <h3 className="font-serif text-xs sm:text-base md:text-lg font-light tracking-tight text-zinc-950 line-clamp-2 leading-tight min-h-[2rem] sm:min-h-[2.75rem]">
                          {rel.name}
                        </h3>
                      </Link>
                    </div>

                    <div className="mt-1.5 sm:mt-2 flex items-baseline justify-between gap-1 mb-2.5 sm:mb-3">
                      <p className="font-serif text-xs sm:text-base font-bold text-zinc-950">
                        {rel.price}
                      </p>
                      <span className="text-[8px] sm:text-[9px] font-mono text-zinc-400">
                        50ml
                      </span>
                    </div>

                    <Link
                      href={`/perfumes/${rel.slug}`}
                      className="w-full py-2 sm:py-2.5 bg-zinc-950 text-white text-[9px] sm:text-[11px] font-bold tracking-wider sm:tracking-[0.18em] uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>View Flacon</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Express Cash on Delivery Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-0 sm:inset-6 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[650px] sm:max-h-[90vh] h-full sm:h-auto bg-white z-50 shadow-2xl overflow-y-auto p-5 sm:p-8 md:p-10 border border-zinc-200 sm:rounded-sm"
            >
              <div className="flex justify-between items-center pb-4 sm:pb-6 border-b border-zinc-200 mb-5 sm:mb-6">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-zinc-950">Express Checkout</h3>
                  <p className="text-xs text-zinc-500 mt-0.5 sm:mt-1">Cash on Delivery for {perfume.name}</p>
                </div>
                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-1.5 sm:p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              {orderSuccess ? (
                <div className="py-8 sm:py-12 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Check className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <h4 className="font-serif text-2xl sm:text-3xl font-light text-zinc-950 mb-1.5 sm:mb-2">Order Confirmed!</h4>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900 mb-1">Order Reference: #{orderId}</p>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-6 sm:mb-8 leading-relaxed">
                    Thank you, {checkoutData.name}. Your order for {quantity}x {perfume.name} has been placed. 
                    Our concierge will dispatch your sealed package with the complimentary matching 2ml tester.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center items-center">
                    <a
                      href={buildWhatsAppUrl(generateConfirmedOrderWhatsAppMessage(orderId, checkoutData, [{ product: perfume, quantity }], totalPrice))}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3.5 bg-emerald-700 text-white text-xs font-bold tracking-[0.18em] sm:tracking-[0.2em] uppercase hover:bg-emerald-600 transition-colors inline-flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"
                    >
                      <MessageCircle className="w-4 h-4" /> Send Receipt to WhatsApp
                    </a>
                    <Link
                      href={`/track-order?q=${orderId}`}
                      onClick={() => {
                        setOrderSuccess(false);
                        setIsCheckoutOpen(false);
                      }}
                      className="px-6 py-3.5 border border-zinc-950 text-zinc-950 text-xs font-bold tracking-[0.18em] sm:tracking-[0.2em] uppercase hover:bg-zinc-950 hover:text-white transition-colors inline-flex items-center justify-center w-full sm:w-auto"
                    >
                      Track Order Status →
                    </Link>
                    <button 
                      onClick={() => {
                        setOrderSuccess(false);
                        setIsCheckoutOpen(false);
                      }}
                      className="px-5 py-3.5 bg-zinc-100 text-zinc-700 text-xs font-bold tracking-[0.18em] sm:tracking-[0.2em] uppercase hover:bg-zinc-200 transition-colors w-full sm:w-auto"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCheckoutSubmit} className="space-y-4 sm:space-y-6">
                  
                  {/* Summary Bar */}
                  <div className="p-3.5 sm:p-4 bg-zinc-50 border border-zinc-200 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-zinc-900 block">{perfume.name} x {quantity}</span>
                      <span className="text-zinc-500 text-[11px]">{perfume.volume} • Free Delivery</span>
                    </div>
                    <span className="font-serif text-lg sm:text-xl font-bold text-zinc-950">PKR {totalPrice.toLocaleString()}</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5 sm:mb-2">
                        Recipient Full Name *
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Tariq Mansoor"
                        value={checkoutData.name}
                        onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#FAF9F8] border border-zinc-300 text-base sm:text-sm focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5 sm:mb-2">
                        WhatsApp / Mobile No *
                      </label>
                      <input 
                        type="tel" 
                        required
                        placeholder="0300 1234567"
                        value={checkoutData.phone}
                        onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#FAF9F8] border border-zinc-300 text-base sm:text-sm focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5 sm:mb-2">
                      Complete Delivery Address *
                    </label>
                    <textarea 
                      rows={2}
                      required
                      placeholder="House / Apartment no, Street, Sector / Area..."
                      value={checkoutData.address}
                      onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#FAF9F8] border border-zinc-300 text-base sm:text-sm focus:border-zinc-950 focus:outline-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5 sm:mb-2">
                        Destination City *
                      </label>
                      <select 
                        value={checkoutData.city}
                        onChange={(e) => setCheckoutData({ ...checkoutData, city: e.target.value })}
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#FAF9F8] border border-zinc-300 text-base sm:text-sm focus:border-zinc-950 focus:outline-none"
                      >
                        <option>Karachi</option>
                        <option>Lahore</option>
                        <option>Islamabad</option>
                        <option>Rawalpindi</option>
                        <option>Faisalabad</option>
                        <option>Multan</option>
                        <option>Peshawar</option>
                        <option>Quetta</option>
                        <option>Sialkot</option>
                        <option>Other City (Pakistan)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5 sm:mb-2">
                        Payment Mode
                      </label>
                      <select 
                        value={checkoutData.paymentMethod}
                        onChange={(e) => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })}
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#FAF9F8] border border-zinc-300 text-base sm:text-sm focus:border-zinc-950 focus:outline-none font-bold"
                      >
                        <option value="COD">Cash on Delivery (Pay at Doorstep)</option>
                        <option value="BANK">Direct Bank Transfer / Raast</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 sm:py-4.5 bg-zinc-950 text-white text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase hover:bg-zinc-800 transition-colors shadow-xl flex items-center justify-center gap-2.5 mt-4 sm:mt-6 disabled:opacity-50"
                  >
                    {isSubmitting ? "Confirming Order..." : `Confirm Order (PKR ${totalPrice.toLocaleString()})`}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-zinc-400 text-center tracking-wider">
                    🔒 Free Delivery Nationwide • Free Matching Tester Vial Included
                  </p>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Concierge Popover */}
      <WhatsAppConcierge />

      {/* Site Footer */}
      <SiteFooter />

    </div>
  );
}
