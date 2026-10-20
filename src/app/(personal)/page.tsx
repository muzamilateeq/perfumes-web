"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Star, 
  Plus, 
  Minus, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  Check, 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  Clock, 
  Heart, 
  Droplet,
  Gift,
  Eye,
  SlidersHorizontal,
  Compass
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { getAdminDataAction } from "@/app/actions/admin";
import WhatsAppConcierge from "@/components/WhatsAppConcierge";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import HeaderSearch from "@/components/HeaderSearch";
import { PERFUMES_DATA, DISCOVERY_SET_ITEM, type PerfumeItem } from "@/lib/perfumes";
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from "@/lib/storeTypes";
import { 
  buildWhatsAppUrl, 
  generateProductWhatsAppMessage, 
  generateConsultationWhatsAppMessage 
} from "@/lib/whatsapp";
import { useStore } from "@/context/StoreContext";

type Perfume = PerfumeItem;

export default function LuxuryBrandStorefront() {
  const [perfumes, setPerfumes] = useState<PerfumeItem[]>(PERFUMES_DATA);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  // Live Sync with Admin Panel updates
  useEffect(() => {
    getAdminDataAction()
      .then((data) => {
        if (data?.success) {
          if (data.products && data.products.length > 0) {
            setPerfumes(data.products);
          }
          if (data.settings) {
            setStoreSettings(data.settings);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Hero Carousel & Continuous Autoplay State (Always moving automatically)
  const [activeHeroIndex, setActiveHeroIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % perfumes.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [perfumes.length]);

  const activePerfume = perfumes[activeHeroIndex] || perfumes[0];

  const handlePrevSlide = () => {
    setActiveHeroIndex((prev) => (prev === 0 ? perfumes.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveHeroIndex((prev) => (prev + 1) % perfumes.length);
  };

  // Store States
  const [selectedCategory, setSelectedCategory] = useState<string>("All Fragrances");
  const [quickViewProduct, setQuickViewProduct] = useState<Perfume | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const store = useStore();
  const wishlist = store.wishlist;

  const toggleWishlist = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    store.toggleWishlist(productId);
  };

  // Fragrance Match Quiz State
  const [quizOccasion, setQuizOccasion] = useState<string>("Evenings & Weddings");
  const [quizVibe, setQuizVibe] = useState<string>("Woody & Regal Oud");
  const [quizResult, setQuizResult] = useState<Perfume | null>(null);

  const categories = ["All Fragrances", "Woody & Oud", "Floral & Rose", "Fresh & Citrus", "Warm Gourmand"];

  const filteredPerfumes = selectedCategory === "All Fragrances"
    ? perfumes
    : perfumes.filter(p => p.category === selectedCategory);

  const addToCart = (product: Perfume) => {
    store.addToCart(product);
    store.openCart();
  };

  const handleQuizFind = () => {
    if (quizVibe.includes("Oud")) {
      setQuizResult(perfumes[0]); // Oud Royale
    } else if (quizVibe.includes("Rose")) {
      setQuizResult(perfumes[1]); // Velvet Rose
    } else if (quizVibe.includes("Citrus") || quizVibe.includes("Fresh")) {
      setQuizResult(perfumes[2]); // Midnight Citrus
    } else if (quizVibe.includes("Sandalwood")) {
      setQuizResult(perfumes[3]); // Santal Supreme
    } else {
      setQuizResult(perfumes[4]); // Vanilla Whisper
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-zinc-900 selection:bg-zinc-950 selection:text-white overflow-x-hidden">
      
      {/* Primary Navigation & Announcement Bar */}
      <SiteHeader cartCount={store.cartCount} onOpenCart={store.openCart} />

      {/* 3. FULL-WIDTH CINEMATIC HERO SHOWCASE (CLICK PICTURE TO OPEN PERFUME PAGE) */}
      <section 
        className="relative min-h-[66vh] sm:min-h-[80vh] lg:min-h-[88vh] w-full flex flex-col justify-between overflow-hidden bg-black text-white"
      >
        {/* Full-Width Background Picture & Name Overlay (Direct Link to Dedicated Perfume Page) */}
        <Link 
          href={`/perfumes/${activePerfume.slug}`}
          className="absolute inset-0 z-10 block overflow-hidden group cursor-pointer"
          title={`Click to view ${activePerfume.name} Flacon & Full Details`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHeroIndex}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={
                  activePerfume.image 
                    ? activePerfume.image.replace("w=800", "w=1920") 
                    : (activePerfume.bannerImage || "/banners/oud-royale.png")
                } 
                alt={activePerfume.name} 
                className="w-full h-full object-cover object-[70%_center] md:object-center brightness-[0.92] contrast-[1.05] group-hover:scale-102 transition-transform duration-1000 ease-out"
              />
            </motion.div>
          </AnimatePresence>

          {/* Elegant Vignette & Gradients: Darker on bottom and left for text, completely transparent on right for flacon */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/20 sm:from-black/75 sm:via-transparent sm:to-black/25 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent z-10" />

          {/* Minimalist Presentation: ONLY Perfume Name + Subtle Luxury Prompt */}
          <div className="absolute inset-0 z-20 max-w-7xl mx-auto w-full px-4 sm:px-12 flex flex-col justify-end pb-8 sm:pb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHeroIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl"
              >
                {/* Grand Perfume Name (Responsive text size) */}
                <h1 className="font-serif text-3xl xs:text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-light leading-[1.05] sm:leading-[1] tracking-tight text-white drop-shadow-2xl group-hover:text-[#F3E7D3] transition-colors">
                  {activePerfume.name}
                </h1>

                {/* Minimalist Click Prompt */}
                <div className="mt-2.5 sm:mt-5 inline-flex items-center gap-2 text-[10px] sm:text-xs font-medium tracking-[0.18em] sm:tracking-[0.22em] uppercase text-white/85 group-hover:text-white transition-colors">
                  <span className="border-b border-[#C5A880]/60 pb-0.5">Click photo to view flacon & details</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C5A880] group-hover:translate-x-1.5 transition-transform" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Link>

        {/* Left Transparent Navigation Arrow */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePrevSlide();
          }}
          className="absolute left-2 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-4 rounded-full bg-black/30 hover:bg-black/60 text-white/70 hover:text-white backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 shadow-xl group cursor-pointer"
          title="Previous Flacon"
          aria-label="Previous Flacon"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Right Transparent Navigation Arrow */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNextSlide();
          }}
          className="absolute right-2 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-4 rounded-full bg-black/30 hover:bg-black/60 text-white/70 hover:text-white backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 shadow-xl group cursor-pointer"
          title="Next Flacon"
          aria-label="Next Flacon"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

      </section>

      {/* 4. VALUE PROPOSITION & TRUST BADGES */}
      <section className="bg-white py-10 sm:py-14 px-4 sm:px-6 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-8 md:gap-12">
          
          <div className="flex items-start gap-2.5 sm:gap-4">
            <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-900 shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <p className="text-[11px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase text-zinc-950">Free Express Delivery</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 font-light mt-0.5">Nationwide within 48-72 hrs</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 sm:gap-4">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-900 shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <p className="text-[11px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase text-zinc-950">Extrait Concentration</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 font-light mt-0.5">30% to 35% pure oil standard</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 sm:gap-4">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-900 shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <p className="text-[11px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase text-zinc-950">Free Matching Tester</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 font-light mt-0.5">Test vial before opening</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 sm:gap-4">
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-900 shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <p className="text-[11px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase text-zinc-950">Cash on Delivery</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 font-light mt-0.5">Pay cash upon delivery</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4.5. THE AI SIGNATURE SCRIBE VIP ATTRACTION BANNER */}
      <section className="py-10 sm:py-14 bg-gradient-to-r from-[#121214] via-[#18181B] to-[#202024] text-white px-4 sm:px-6 relative overflow-hidden border-y border-[#C5A880]/30 shadow-2xl">
        {/* Subtle Background Watermark */}
        <div className="absolute -right-8 -bottom-10 opacity-5 pointer-events-none select-none text-[#C5A880] hidden md:block">
          <span className="font-serif text-[180px] leading-none">AURA</span>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Column: Headline & Callout */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A880]/20 border border-[#C5A880]/40 rounded-full text-[#C5A880] text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              World-First AI Olfactory Scribe
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-white leading-tight">
              Find Your Perfume With <span className="italic text-[#C5A880] font-normal">Your Signature</span>
            </h2>

            <p className="text-zinc-300 font-light text-xs sm:text-base leading-relaxed max-w-xl">
              Don&apos;t guess your fragrance through a screen. Sign your name or draw your moniker on our digital parchment. Our master perfumer algorithm analyzes your stroke pressure to reveal your 98% soulmate flacon—with complimentary custom bottle engraving.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/signature-scent"
                className="px-6 py-3.5 sm:px-8 sm:py-4 bg-[#C5A880] hover:bg-[#d6bc97] text-zinc-950 rounded-xl text-xs sm:text-sm font-bold tracking-[0.2em] uppercase transition-all shadow-xl flex items-center gap-2.5 group cursor-pointer"
              >
                <span>Sign Your Name & Reveal Scent</span>
                <ArrowRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                100% Free • Takes 30 Seconds
              </span>
            </div>
          </div>

          {/* Right Column: Visual Interactive Teaser Card */}
          <div className="lg:col-span-5">
            <Link
              href="/signature-scent"
              className="group block relative p-6 sm:p-7 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-[#C5A880]/40 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-2xl overflow-hidden cursor-pointer"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                <span className="font-mono text-[#C5A880] tracking-widest uppercase text-[10px] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
                  Live Scribe Pad
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 bg-white/10 px-2 py-0.5 rounded">
                  Touch / Mouse
                </span>
              </div>

              {/* Simulated Signature & Wax Seal */}
              <div className="py-5 sm:py-6 flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <p className="font-serif italic text-2xl sm:text-3xl text-[#C5A880] drop-shadow-sm font-light">
                    Muzammil Ateeq
                  </p>
                  <div className="h-0.5 w-32 bg-gradient-to-r from-[#C5A880] to-transparent" />
                  <p className="text-[10px] text-zinc-400 font-mono">
                    Analysis: The Sovereign • 98% Match
                  </p>
                </div>

                {/* Golden Wax Seal Monogram */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#8C7355] via-[#C5A880] to-[#E9DCC9] border-2 border-white/30 shadow-xl flex flex-col items-center justify-center text-zinc-950 shrink-0 group-hover:rotate-12 transition-transform">
                  <span className="font-serif text-sm sm:text-base font-bold">AURA</span>
                  <span className="text-[7px] font-bold tracking-wider uppercase text-zinc-900">SEAL</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-300">
                <span className="text-[11px] text-zinc-400">Click to sign on digital parchment</span>
                <span className="text-[#C5A880] font-bold tracking-wider uppercase flex items-center gap-1 group-hover:underline text-[11px]">
                  Open Pad <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </div>

        </div>
      </section>

      {/* 5. SIGNATURE COLLECTION WITH OLFACTORY FILTER */}
      <section id="collection" className="py-12 sm:py-24 max-w-7xl mx-auto px-3 sm:px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-14 gap-3 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <span className="h-[1px] w-6 sm:w-8 bg-zinc-900"></span>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#8C7355]">The Permanent Line</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-zinc-950">
              Signature Flacons
            </h2>
          </div>
          <p className="text-zinc-500 font-light text-xs sm:text-base max-w-md">
            Macerated for 90 days in cold stainless drums. Poured into heavy crystal flacons with fine-mist micro atomizers.
          </p>
        </div>

        {/* Category Filters with smooth horizontal swipe on mobile */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar sm:flex-wrap pb-2 mb-8 sm:mb-12 -mx-3 px-3 sm:mx-0 sm:px-0 border-b border-zinc-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? "bg-zinc-950 text-white shadow-md" 
                  : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-950 hover:text-zinc-950"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid - 2 COLUMNS ON MOBILE (As requested), 3 on Desktop */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8"
        >
          {filteredPerfumes.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            return (
              <motion.div 
                key={product.id} 
                variants={itemVariants} 
                className="group bg-white border border-zinc-200 flex flex-col justify-between hover:border-zinc-950 transition-all shadow-xs relative overflow-hidden"
              >
                <div>
                  
                  {/* Product Image Frame */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100 border-b border-zinc-200">
                    <Link href={`/perfumes/${product.slug}`} className="block w-full h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </Link>
                    
                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-zinc-950/90 backdrop-blur-sm text-white px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-bold tracking-wider sm:tracking-widest uppercase shadow-sm pointer-events-none">
                        {product.badge}
                      </span>
                    )}

                    {/* Circular Wishlist Heart Icon (Matching 2nd Reference Picture) */}
                    <button 
                      type="button"
                      onClick={(e) => toggleWishlist(e, product.id)}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/90 flex items-center justify-center transition-all hover:scale-110 shadow-sm z-10"
                      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      aria-label="Wishlist"
                    >
                      <Heart 
                        className={`w-3.5 h-3.5 transition-colors ${
                          isWishlisted 
                            ? "fill-rose-500 text-rose-500" 
                            : "text-zinc-500 hover:text-zinc-950"
                        }`} 
                      />
                    </button>

                    {/* Quick View Eye Button */}
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                      className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-1.5 sm:p-2 bg-white/90 backdrop-blur-md hover:bg-zinc-950 hover:text-white transition-all border border-zinc-200 shadow-sm text-zinc-700 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 rounded-sm z-10"
                      title="Quick Inspect"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Info (Clean, Luxury, Compact for 2 Columns) */}
                  <div className="p-2.5 sm:p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.16em] sm:tracking-[0.22em] uppercase text-[#8C7355] block mb-1 truncate">
                        {product.category}
                      </span>
                      
                      <Link href={`/perfumes/${product.slug}`} className="hover:text-[#8C7355] transition-colors block">
                        <h3 className="font-serif text-xs sm:text-base md:text-lg font-light tracking-tight text-zinc-950 line-clamp-2 leading-tight min-h-[2rem] sm:min-h-[2.75rem]">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    <div className="mt-1.5 sm:mt-2 flex items-baseline justify-between gap-1">
                      <p className="font-serif text-xs sm:text-base font-bold text-zinc-950">
                        {product.price}
                      </p>
                      <span className="text-[8px] sm:text-[9px] font-mono text-zinc-400">
                        50ml
                      </span>
                    </div>

                    {/* Sillage & Notes Hint on Desktop */}
                    <p className="hidden sm:block text-[11px] text-zinc-500 font-light line-clamp-1 mt-1.5">
                      {product.notes}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-2.5 pt-0 sm:p-5 sm:pt-0 space-y-1.5">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="w-full py-2 sm:py-2.5 bg-zinc-950 text-white text-[9px] sm:text-[11px] font-bold tracking-wider sm:tracking-[0.18em] uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Add to Bag</span>
                  </button>

                  <div className="hidden sm:grid grid-cols-2 gap-1.5">
                    <Link 
                      href={`/perfumes/${product.slug}`}
                      className="py-1.5 bg-[#FAF9F8] border border-zinc-200 text-zinc-900 text-[10px] font-bold tracking-wider uppercase hover:border-zinc-900 transition-colors flex items-center justify-center gap-1 text-center"
                    >
                      <span>Flacon</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                      className="py-1.5 border border-zinc-200 text-zinc-600 text-[10px] font-bold tracking-wider uppercase hover:border-zinc-900 hover:text-zinc-950 transition-colors"
                    >
                      Pyramid
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* 6. INTERACTIVE SCENT FINDER QUIZ (HIGH ENGAGEMENT) */}
      <section id="finder" className="py-14 sm:py-24 bg-white border-y border-zinc-200 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] sm:tracking-[0.28em] uppercase text-[#8C7355] block mb-2 sm:mb-3">
              Personalized Consultation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-zinc-950">
              Find Your Signature Aura
            </h2>
            <p className="text-zinc-500 font-light text-xs sm:text-sm max-w-md mx-auto mt-2 sm:mt-3">
              Unsure which creation suits your presence? Answer two questions for an instant recommendation.
            </p>
          </div>

          <div className="p-5 sm:p-8 md:p-12 bg-[#FBFBF9] border border-zinc-200 shadow-xs space-y-6 sm:space-y-8">
            <div>
              <label className="block text-[11px] sm:text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2.5 sm:mb-3">
                1. Where will you primarily wear this fragrance?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                {[
                  "Evenings & Weddings", 
                  "Daily & Boardroom", 
                  "Romantic Dates", 
                  "Summer & High Heat"
                ].map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setQuizOccasion(occ)}
                    className={`p-2.5 sm:p-3 text-[11px] sm:text-xs font-medium tracking-wide border transition-all text-center ${
                      quizOccasion === occ 
                        ? "bg-zinc-950 text-white border-zinc-950" 
                        : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-900"
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2.5 sm:mb-3">
                2. What olfactory profile speaks to your character?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                {[
                  "Woody & Regal Oud", 
                  "Rich Dark Rose", 
                  "Crisp Bergamot & Citrus", 
                  "Creamy Sandalwood & Suede"
                ].map((vibe) => (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => setQuizVibe(vibe)}
                    className={`p-2.5 sm:p-3 text-[11px] sm:text-xs font-medium tracking-wide border transition-all text-center ${
                      quizVibe === vibe 
                        ? "bg-zinc-950 text-white border-zinc-950" 
                        : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-900"
                    }`}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleQuizFind}
              className="w-full py-3.5 sm:py-4 bg-zinc-950 text-white text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Compass className="w-4 h-4" /> Reveal My Fragrance Match
            </button>

            {quizResult && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 sm:p-6 bg-white border border-[#C5A880] flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
              >
                <div className="w-20 h-24 sm:w-24 sm:h-28 bg-zinc-100 shrink-0 overflow-hidden border border-zinc-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={quizResult.image} alt={quizResult.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C7355] block">
                    Your Tailored Match
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-light text-zinc-950">{quizResult.name}</h4>
                  <p className="text-xs text-zinc-500 mt-1">{quizResult.description}</p>
                  <p className="text-xs font-bold text-zinc-950 mt-1.5">{quizResult.price} • {quizResult.volume}</p>
                </div>
                <button 
                  onClick={() => addToCart(quizResult)}
                  className="w-full sm:w-auto px-6 py-3 bg-zinc-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all shrink-0"
                >
                  Add Match To Bag
                </button>
              </motion.div>
            )}

          </div>
        </div>
      </section>

      {/* 7. DISCOVERY COFFRET FEATURE BANNER */}
      <section id="discovery" className="py-14 sm:py-24 bg-zinc-950 text-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          <div className="lg:col-span-6">
            <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 bg-white/10 text-[#C5A880] text-[9px] sm:text-[10px] font-bold tracking-[0.25em] sm:tracking-[0.28em] uppercase inline-block mb-4 sm:mb-6 border border-white/10">
              Sample In Private Luxury
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-4 sm:mb-6 leading-tight">
              The Aura Discovery Coffret.
            </h2>
            <p className="text-zinc-400 font-light text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
              Unsure which fragrance aligns with your skin chemistry? Order our bespoke Discovery Coffret containing <strong>all 6 signature extraits in 5ml glass atomizers</strong>. 
              Delivered with a 100% redeemable PKR 4,500 voucher valid for your first 50ml flacon.
            </p>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10 border-t border-zinc-800 pt-6 sm:pt-8">
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-light">6 x 5ml</span>
                <p className="text-[10px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase text-zinc-400 mt-1">Artisanal Atomizers</p>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-light">PKR 3,500</span>
                <p className="text-[10px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase text-[#C5A880] mt-1">100% Redeemable Voucher</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button 
                onClick={() => addToCart(DISCOVERY_SET_ITEM)}
                className="px-6 py-3.5 sm:px-8 sm:py-4.5 bg-white text-zinc-950 text-xs font-bold tracking-[0.18em] sm:tracking-[0.22em] uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-2.5 shadow-2xl"
              >
                Order Discovery Set • PKR 3,500 <ArrowRight className="w-4 h-4" />
              </button>
              <Link 
                href="/discovery"
                className="px-6 py-3.5 sm:px-8 sm:py-4.5 border border-white/40 text-white text-xs font-bold tracking-[0.18em] sm:tracking-[0.22em] uppercase hover:bg-white hover:text-zinc-950 transition-all flex items-center justify-center gap-2"
              >
                Learn More About Coffret
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] overflow-hidden border border-zinc-800 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/discovery-box.jpg" 
              alt="Aura Discovery Coffret Box with 6 Mini Samples" 
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* 8. BRAND HERITAGE & FORMULATION ETHOS */}
      <section id="heritage" className="py-16 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto border-b border-zinc-200">
        <div className="grid lg:grid-cols-12 gap-10 sm:gap-16 items-center">
          
          <div className="lg:col-span-6 relative aspect-[4/5] bg-zinc-100 border border-zinc-200 overflow-hidden shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=1200" 
              alt="French Raw Ingredients & Cold Maceration" 
              className="w-full h-full object-cover grayscale-[0.2]"
            />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md p-4 sm:p-6 border border-zinc-200 shadow-sm">
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#8C7355] mb-1">
                {storeSettings.storyProcessBadge || "Cold Maceration Process"}
              </p>
              <p className="text-xs font-semibold text-zinc-900">
                {storeSettings.storyProcessText || "Each batch is preserved in chilled stainless drums for 90 days to eliminate sharp alcohol odors."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <span className="h-[1px] w-6 sm:w-8 bg-zinc-900"></span>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#8C7355]">
                {storeSettings.storySubtitle || "The Standards"}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-zinc-950 mb-6 sm:mb-8 leading-tight">
              {storeSettings.storyTitle || "Why Aura Stands Apart From Mass Retailers."}
            </h2>
            <p className="text-zinc-600 font-light text-sm sm:text-base leading-relaxed mb-8 sm:mb-10">
              {storeSettings.storyDescription || "Commercial perfumes flood the market with watered-down 12% Eau de Parfum designed to vanish within three hours so you spray more. At Aura, we formulate strictly at Extrait de Parfum (30%+ concentration) — an uncompromising tier of perfumery reserved for true connoisseurs."}
            </p>

            <div className="space-y-5 sm:space-y-6 border-t border-zinc-200 pt-6 sm:pt-8">
              <div className="flex gap-3 sm:gap-4">
                <span className="text-xs font-mono font-bold text-[#8C7355] w-6 sm:w-8 shrink-0">01</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-zinc-950 mb-1">
                    {storeSettings.storyPoint1Title || "Authentic Grasse Absolutes"}
                  </h4>
                  <p className="text-xs text-zinc-600 font-light leading-relaxed">
                    {storeSettings.storyPoint1Text || "We source natural botanical concentrates from historical family distilleries in Southern France."}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <span className="text-xs font-mono font-bold text-[#8C7355] w-6 sm:w-8 shrink-0">02</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-zinc-950 mb-1">
                    {storeSettings.storyPoint2Title || "Aged Assamese & Cambodian Ouds"}
                  </h4>
                  <p className="text-xs text-zinc-600 font-light leading-relaxed">
                    {storeSettings.storyPoint2Text || "No synthetic burning rubber odor. Only pure, sweet, aged natural agarwood resin."}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <span className="text-xs font-mono font-bold text-[#8C7355] w-6 sm:w-8 shrink-0">03</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-zinc-950 mb-1">
                    {storeSettings.storyPoint3Title || "Try First Guarantee"}
                  </h4>
                  <p className="text-xs text-zinc-600 font-light leading-relaxed">
                    {storeSettings.storyPoint3Text || "Every bottle comes with a matching free tester vial. Test the vial first; if you dislike it, return the sealed bottle for a 100% refund."}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. VERIFIED REVIEWS */}
      <section className="py-16 sm:py-28 px-4 sm:px-6 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-16">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#8C7355] block mb-2 sm:mb-3">Client Accolades</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-zinc-950">
              Echoes of Distinction
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-5 sm:p-8 border border-zinc-200 bg-[#FAF9F8]">
              <div className="flex gap-1 text-[#C5A880] mb-4 sm:mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#C5A880]" />)}
              </div>
              <p className="font-serif text-sm sm:text-base font-light text-zinc-800 leading-relaxed mb-4 sm:mb-6 italic">
                “Oud Royale easily beats niche brands costing PKR 50,000+. The drydown is smooth, smoky, and stays on my blazer for two days. Packaging feels like Creed.”
              </p>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-950">Mustafa Khan</p>
              <p className="text-[10px] sm:text-[11px] text-zinc-400">Verified Buyer • Clifton, Karachi</p>
            </div>

            <div className="p-5 sm:p-8 border border-zinc-200 bg-[#FAF9F8]">
              <div className="flex gap-1 text-[#C5A880] mb-4 sm:mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#C5A880]" />)}
              </div>
              <p className="font-serif text-sm sm:text-base font-light text-zinc-800 leading-relaxed mb-4 sm:mb-6 italic">
                “Santal Supreme is pure magic. Soft Tuscan leather with creamy sandalwood. Delivery arrived in Lahore in 48 hours with cash on delivery. 10/10 service.”
              </p>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-950">Ayesha Malik</p>
              <p className="text-[10px] sm:text-[11px] text-zinc-400">Verified Buyer • DHA, Lahore</p>
            </div>

            <div className="p-5 sm:p-8 border border-zinc-200 bg-[#FAF9F8]">
              <div className="flex gap-1 text-[#C5A880] mb-4 sm:mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#C5A880]" />)}
              </div>
              <p className="font-serif text-sm sm:text-base font-light text-zinc-800 leading-relaxed mb-4 sm:mb-6 italic">
                “I bought the Discovery Box first to test. Ended up ordering full bottles of Velvet Rose and Midnight Citrus. The tester concept gives complete peace of mind.”
              </p>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-950">Bilal Siddiqui</p>
              <p className="text-[10px] sm:text-[11px] text-zinc-400">Verified Buyer • F-7, Islamabad</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQS */}
      <section className="py-16 sm:py-28 px-4 sm:px-6 max-w-4xl mx-auto border-b border-zinc-200">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#8C7355] block mb-2 sm:mb-3">Assistance</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-zinc-950">
            Frequently Asked Inquiries
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {[
            {
              q: "How does Cash on Delivery (COD) work?",
              a: "When ordering on our website, simply choose 'Cash on Delivery'. We dispatch your parcel via courier. You only pay the rider in cash when the parcel arrives safely at your address."
            },
            {
              q: "How long does delivery take across Pakistan?",
              a: "Karachi deliveries arrive within 24 to 48 hours. Lahore, Islamabad, Rawalpindi, and other major cities arrive within 2 to 3 business days. Remote locations take 3 to 4 days. Full tracking is provided via SMS."
            },
            {
              q: "What is the difference between Extrait and Eau de Parfum?",
              a: "Extrait de Parfum contains 30% to 35% pure perfume oils, whereas ordinary Eau de Parfum contains only 10% to 15%. This means our fragrances project for 18 to 24+ hours and feel rich on the skin without evaporating quickly."
            },
            {
              q: "Can I return the bottle if I don't like the scent?",
              a: "Yes! Every 50ml bottle comes with a free matching 2ml tester vial in the package. Open and spray the tester vial first. If you don't love it, keep the tester vial and return the unsealed 50ml flacon for a 100% full refund or exchange."
            }
          ].map((item, idx) => (
            <div key={idx} className="border border-zinc-200 bg-white">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-6 text-left flex justify-between items-center gap-3 sm:gap-4 hover:bg-zinc-50 transition-colors"
              >
                <span className="text-xs sm:text-sm font-semibold tracking-wide text-zinc-950">{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {openFaq === idx && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-xs text-zinc-600 font-light leading-relaxed border-t border-zinc-100 pt-3 sm:pt-4">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 11. WHATSAPP CONCIERGE BANNER */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-emerald-950 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="font-serif text-2xl sm:text-3xl font-light tracking-tight mb-3 sm:mb-4 text-white">
            Prefer Ordering via WhatsApp?
          </h3>
          <p className="text-emerald-200 font-light text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
            Our fragrance advisors are available daily from 10 AM to 11 PM to provide scent recommendations and take orders directly over WhatsApp.
          </p>
          <a 
            href={buildWhatsAppUrl(generateConsultationWhatsAppMessage("Private Fragrance Consultation"))}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-emerald-500 text-zinc-950 text-xs font-bold tracking-[0.18em] sm:tracking-[0.2em] uppercase hover:bg-emerald-400 transition-all shadow-xl"
          >
            Chat with Concierge on WhatsApp <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>
        </div>
      </section>

      {/* 12. LUXURY FOOTER */}
      <SiteFooter />



      {/* 14. PRODUCT QUICK VIEW MODAL (INSPECT OLFACTORY PYRAMID) */}
      <AnimatePresence>
        {quickViewProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-0 sm:inset-6 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[750px] sm:max-h-[90vh] h-full sm:h-auto bg-white z-50 shadow-2xl overflow-y-auto p-5 sm:p-8 md:p-10 border border-zinc-200 sm:rounded-sm"
            >
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C7355]">
                    {quickViewProduct.category} • {quickViewProduct.volume}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-zinc-950">{quickViewProduct.name}</h3>
                </div>
                <button 
                  onClick={() => setQuickViewProduct(null)}
                  className="p-1.5 sm:p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-start mb-6 sm:mb-8">
                <div className="aspect-[4/5] bg-zinc-100 overflow-hidden border border-zinc-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <span className="text-lg sm:text-xl font-bold text-zinc-950">{quickViewProduct.price}</span>
                    <p className="text-xs text-zinc-500 mt-1.5 sm:mt-2 font-light leading-relaxed">{quickViewProduct.description}</p>
                  </div>

                  {/* Pyramid */}
                  <div className="border border-zinc-200 p-3.5 sm:p-4 bg-[#FAF9F8] space-y-2.5 sm:space-y-3 text-xs">
                    <div>
                      <span className="font-bold tracking-wider uppercase text-zinc-400 block text-[10px]">Top Notes:</span>
                      <span className="text-zinc-800 font-medium">{quickViewProduct.topNotes}</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-200">
                      <span className="font-bold tracking-wider uppercase text-zinc-400 block text-[10px]">Heart Notes:</span>
                      <span className="text-zinc-800 font-medium">{quickViewProduct.heartNotes}</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-200">
                      <span className="font-bold tracking-wider uppercase text-zinc-400 block text-[10px]">Base Notes:</span>
                      <span className="text-zinc-800 font-medium">{quickViewProduct.baseNotes}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs">
                    <div>
                      <span className="font-bold text-zinc-400 uppercase text-[10px] block">Sillage:</span>
                      <span className="text-zinc-900 font-medium">{quickViewProduct.sillage}</span>
                    </div>
                    <div>
                      <span className="font-bold text-zinc-400 uppercase text-[10px] block">Longevity:</span>
                      <span className="text-zinc-900 font-medium">{quickViewProduct.longevity}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <button 
                      onClick={() => {
                        addToCart(quickViewProduct);
                        setQuickViewProduct(null);
                      }}
                      className="w-full py-3.5 sm:py-4 bg-zinc-950 text-white text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add Flacon To Bag
                    </button>

                    <a
                      href={buildWhatsAppUrl(generateProductWhatsAppMessage(quickViewProduct))}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 sm:py-3 border border-emerald-600 text-emerald-800 hover:bg-emerald-50 text-xs font-bold tracking-[0.18em] sm:tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>Order This Flacon on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 15. LUXURY INTERACTIVE WHATSAPP CONCIERGE WIDGET */}
      <WhatsAppConcierge />

    </div>
  );
}
