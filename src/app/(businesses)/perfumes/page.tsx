"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Menu, 
  ArrowRight, 
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
  MessageCircle,
  Heart
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import WhatsAppConcierge from "@/components/WhatsAppConcierge";
import { 
  buildWhatsAppUrl, 
  generateCartWhatsAppMessage, 
  generateConsultationWhatsAppMessage 
} from "@/lib/whatsapp";

import SiteFooter from "@/components/SiteFooter";
import { PERFUMES_DATA, DISCOVERY_SET_ITEM, type PerfumeItem } from "@/lib/perfumes";

type Perfume = PerfumeItem;

interface CartItem {
  product: Perfume;
  quantity: number;
}

export default function PerfumeStorefront() {
  const perfumes: PerfumeItem[] = PERFUMES_DATA;

  // Hero Carousel & Pagination State
  const [activeHeroIndex, setActiveHeroIndex] = useState<number>(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isAutoplayPaused) return;
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % 6);
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoplayPaused]);

  const activePerfume = perfumes[activeHeroIndex] || perfumes[0];

  const handlePrevSlide = () => {
    setActiveHeroIndex((prev) => (prev === 0 ? perfumes.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveHeroIndex((prev) => (prev + 1) % perfumes.length);
  };

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>("All Fragrances");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const categories = ["All Fragrances", "Woody & Oud", "Floral & Rose", "Fresh & Citrus", "Warm Gourmand"];

  const filteredPerfumes = selectedCategory === "All Fragrances"
    ? perfumes
    : perfumes.filter(p => p.category === selectedCategory);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartAmount = cart.reduce((acc, item) => acc + (item.product.priceNum * item.quantity), 0);

  const addToCart = (product: Perfume) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
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
    <div className="min-h-screen bg-[#F9F9F8] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white overflow-x-hidden">
      
      {/* 1. LUXURY ANNOUNCEMENT MARQUEE */}
      <div className="bg-zinc-950 text-zinc-300 text-[10px] md:text-[11px] font-bold tracking-[0.25em] uppercase py-2.5 px-6 text-center border-b border-zinc-800 flex items-center justify-center gap-6">
        <span>COMPLIMENTARY EXPRESS DELIVERY ON ORDERS OVER PKR 5,000</span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline">100% EXTRAIT DE PARFUM (30%+ CONCENTRATION)</span>
        <span className="hidden lg:inline">•</span>
        <span className="hidden lg:inline">2 COMPLIMENTARY VIALS WITH EVERY FLACON</span>
      </div>

      {/* 2. PRIMARY NAVBAR */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="sticky top-0 z-40 bg-[#F9F9F8]/90 backdrop-blur-xl border-b border-zinc-200"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-950 transition-colors flex items-center gap-1.5">
              ← Home
            </Link>
            <Link href="/about" className="hidden lg:block text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-900 transition-colors">
              The House
            </Link>
            <Link href="/track-order" className="hidden xl:block text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-900 transition-colors">
              Track Order
            </Link>
          </div>
          
          <Link href="/" className="text-2xl md:text-3xl font-light tracking-[0.45em] uppercase absolute left-1/2 -translate-x-1/2 text-zinc-950 font-serif">
            Aura
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/discovery" className="hidden md:block text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-900 transition-colors">
              Discovery Box
            </Link>
            <Link href="/contact" className="hidden md:block text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-900 transition-colors">
              Concierge
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.2em] uppercase hover:text-zinc-500 transition-colors relative"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              <span className="w-5 h-5 flex items-center justify-center bg-zinc-900 text-white rounded-full text-[10px] font-bold">
                {totalCartCount}
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* 3. FULL-WIDTH CINEMATIC HERO SHOWCASE WITH BACKGROUND IMAGE & OVERLAID ACTIONS */}
      <section 
        onMouseEnter={() => setIsAutoplayPaused(true)}
        onMouseLeave={() => setIsAutoplayPaused(false)}
        className="relative min-h-[85vh] sm:min-h-[88vh] lg:min-h-[92vh] w-full flex flex-col justify-between overflow-hidden bg-black text-white"
      >
        {/* Full-Width Background Image with Smooth Crossfade Transitions */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHeroIndex}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={activePerfume.image.replace("w=800", "w=1920")} 
                alt={activePerfume.name} 
                className="w-full h-full object-cover object-center brightness-[0.75] contrast-[1.05]"
              />
            </motion.div>
          </AnimatePresence>

          {/* Cinematic Dark Vignette & Gradient Overlays for High Contrast & Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/65 to-black/35 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40 z-10" />
        </div>

        {/* Top-Right Floating Controls (Slide counter & chevrons) */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 pt-8 flex justify-end">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 border border-white/20 rounded-full shadow-2xl">
            <span className="font-mono text-xs tracking-widest text-amber-400 font-bold">
              0{activeHeroIndex + 1}
            </span>
            <span className="text-white/40 text-xs">/</span>
            <span className="font-mono text-xs tracking-widest text-white/70">
              0{perfumes.length}
            </span>
            <div className="w-[1px] h-3 bg-white/20 mx-1" />
            <button 
              onClick={handlePrevSlide}
              className="p-1 hover:text-amber-400 text-white transition-colors"
              title="Previous Flacon"
              aria-label="Previous Flacon"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleNextSlide}
              className="p-1 hover:text-amber-400 text-white transition-colors"
              title="Next Flacon"
              aria-label="Next Flacon"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Overlaid Editorial Content & Buttons (Directly on top of background image) */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 py-8 sm:py-14 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHeroIndex}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              {/* Category & Badge Pills */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-400/50 text-amber-300 text-[10px] font-bold tracking-[0.28em] uppercase backdrop-blur-md">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Collection 01 • Haute Parfumerie
                </span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-bold tracking-[0.25em] uppercase">
                  {activePerfume.category}
                </span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-[10px] font-mono">
                  {activePerfume.volume}
                </span>
              </div>

              {/* Main Perfume Title */}
              <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light leading-[1.02] mb-5 tracking-tight text-white drop-shadow-md">
                {activePerfume.name}
              </h1>

              {/* Fragrance Description */}
              <p className="text-base sm:text-lg text-white/80 max-w-xl mb-6 font-light leading-relaxed drop-shadow-sm">
                {activePerfume.description}
              </p>

              {/* Scent Profile Overlay Box */}
              <div className="p-4 sm:p-5 bg-black/55 backdrop-blur-md border border-white/15 max-w-xl mb-8 space-y-2">
                <div className="flex items-start gap-3 text-xs">
                  <span className="font-bold tracking-wider uppercase text-amber-400 w-20 shrink-0">
                    Olfactory:
                  </span>
                  <span className="text-white font-medium">
                    {activePerfume.notes}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2.5 border-t border-white/10">
                  <span className="text-white/70 font-light">
                    {activePerfume.concentration}
                  </span>
                  <span className="font-bold text-white text-base tracking-wide text-amber-300">
                    {activePerfume.price}
                  </span>
                </div>
              </div>

              {/* OVERLAID ACTION BUTTONS ("SHOP NOW YA ADD WAL BUTON UPER") */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button 
                  onClick={() => addToCart(activePerfume)}
                  className="group flex items-center justify-center sm:justify-between gap-4 text-xs font-bold tracking-[0.22em] uppercase px-8 py-4.5 bg-white text-zinc-950 hover:bg-amber-300 transition-all shadow-2xl"
                >
                  <span>Shop Now • Add To Cart</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>
                <a 
                  href="#collection" 
                  className="group flex items-center justify-center sm:justify-between gap-4 text-xs font-bold tracking-[0.22em] uppercase px-8 py-4.5 border border-white/40 text-white hover:bg-white hover:text-zinc-950 backdrop-blur-sm transition-all"
                >
                  Explore Fragrances
                </a>
                <a 
                  href="#discovery" 
                  className="hidden md:flex items-center justify-center gap-2 text-xs font-bold tracking-[0.22em] uppercase px-6 py-4.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all"
                >
                  Discovery Set (PKR 4,500)
                </a>
              </div>

              {/* Performance Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-5 border-t border-white/15 max-w-lg">
                <div>
                  <span className="font-serif text-2xl font-light text-white">18+ Hours</span>
                  <span className="block text-[10px] font-bold tracking-widest uppercase text-white/50 mt-0.5">Skin Longevity</span>
                </div>
                <div>
                  <span className="font-serif text-2xl font-light text-white">{activePerfume.volume}</span>
                  <span className="block text-[10px] font-bold tracking-widest uppercase text-white/50 mt-0.5">Volume</span>
                </div>
                <div>
                  <span className="font-serif text-2xl font-light text-amber-300">COD Nationwide</span>
                  <span className="block text-[10px] font-bold tracking-widest uppercase text-white/50 mt-0.5">Pay at Doorstep</span>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* FULL-WIDTH INTERACTIVE PAGINATION BAR AT BOTTOM OF HERO */}
        <div className="relative z-20 bg-black/60 backdrop-blur-xl border-t border-white/15 px-6 py-3.5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Left: Section Label */}
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/70">
                Signature Flacons Gallery
              </span>
            </div>

            {/* Middle: 6 Interactive Perfume Pagination Tabs with Active Progress */}
            <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {perfumes.map((p, idx) => {
                const isActive = idx === activeHeroIndex;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveHeroIndex(idx)}
                    className={`group relative flex items-center gap-2.5 px-3.5 py-2 border transition-all text-left shrink-0 backdrop-blur-md ${
                      isActive 
                        ? "bg-white text-zinc-950 border-white shadow-lg" 
                        : "bg-black/40 text-white/80 border-white/15 hover:border-white/50 hover:text-white"
                    }`}
                  >
                    <span className={`font-mono text-[10px] font-bold ${isActive ? "text-amber-600" : "text-amber-400"}`}>
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
                      {p.name}
                    </span>
                    
                    {/* Active dynamic progress line */}
                    {isActive && (
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 5.5, ease: "linear" }}
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400 origin-left"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right: Dot Pagination and Chevrons */}
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={handlePrevSlide}
                className="p-1.5 border border-white/20 hover:border-white hover:bg-white hover:text-zinc-950 text-white transition-all"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1.5 px-1">
                {perfumes.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={() => setActiveHeroIndex(idx)}
                    className={`cursor-pointer transition-all ${
                      idx === activeHeroIndex 
                        ? "w-5 h-1.5 bg-amber-400" 
                        : "w-1.5 h-1.5 bg-white/30 hover:bg-white/70 rounded-full"
                    }`}
                  />
                ))}
              </div>
              <button 
                onClick={handleNextSlide}
                className="p-1.5 border border-white/20 hover:border-white hover:bg-white hover:text-zinc-950 text-white transition-all"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* 4. TRUST & CRAFTSMANSHIP BADGES */}
      <section className="bg-white py-12 px-6 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <Truck className="w-6 h-6 text-zinc-800 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-900">Complimentary Delivery</p>
              <p className="text-xs text-zinc-500 font-light">Nationwide express shipping</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-6 h-6 text-zinc-800 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-900">Extrait Concentration</p>
              <p className="text-xs text-zinc-500 font-light">30%+ pure fragrance oils</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Sparkles className="w-6 h-6 text-zinc-800 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-900">Complimentary Vials</p>
              <p className="text-xs text-zinc-500 font-light">2 discovery vials with bottle</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <RotateCcw className="w-6 h-6 text-zinc-800 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-900">Risk-Free Try First</p>
              <p className="text-xs text-zinc-500 font-light">Test vial before breaking seal</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COLLECTION & INTERACTIVE NOTES FILTER */}
      <section id="collection" className="py-12 sm:py-24 max-w-7xl mx-auto px-3 sm:px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-14 gap-3 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <span className="h-[1px] w-6 sm:w-8 bg-zinc-900"></span>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-zinc-400">The Flacons</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-zinc-950">
              Signature Fragrances
            </h2>
          </div>
          <p className="text-zinc-500 font-light text-xs sm:text-base max-w-md">
            Hand-poured in limited batches of 150 flacons to ensure uninterrupted maturation and aromatic fidelity.
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
                  : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
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
                className="group bg-white border border-zinc-200 flex flex-col justify-between hover:border-zinc-900 transition-all shadow-xs relative overflow-hidden"
              >
                <div>
                  {/* Product Image Frame */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100 border-b border-zinc-200">
                    <Link href={`/perfumes/${product.slug}`} className="block w-full h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[0.15] group-hover:grayscale-0"
                      />
                    </Link>
                    
                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 bg-zinc-950/90 backdrop-blur-sm text-white px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-bold tracking-wider sm:tracking-widest uppercase shadow-sm pointer-events-none">
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

                  <Link 
                    href={`/perfumes/${product.slug}`}
                    className="hidden sm:flex py-1.5 bg-[#FAF9F8] border border-zinc-200 text-zinc-900 text-[10px] font-bold tracking-wider uppercase hover:border-zinc-900 transition-colors items-center justify-center gap-1 text-center"
                  >
                    <span>Flacon Details</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>

              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* 6. BESPOKE DISCOVERY SET FEATURE */}
      <section id="discovery" className="py-24 bg-zinc-950 text-white px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6">
            <span className="px-3 py-1 bg-white/10 text-zinc-300 text-[10px] font-bold tracking-[0.25em] uppercase inline-block mb-6">
              Sample Before You Commit
            </span>
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight mb-6 leading-tight">
              The Aura Discovery Coffret.
            </h2>
            <p className="text-zinc-400 font-light text-base leading-relaxed mb-8">
              Experience the entire collection of six signature fragrances in bespoke 5ml glass atomizers. 
              Delivered in an embossed black keepsake coffret with a full redeemable PKR 4,500 voucher toward any 50ml flacon.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10 border-t border-zinc-800 pt-8">
              <div>
                <span className="text-2xl font-light">6 x 5ml</span>
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mt-1">Artisanal Vials</p>
              </div>
              <div>
                <span className="text-2xl font-light">PKR 3,500</span>
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mt-1">100% Redeemable Voucher</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => addToCart(DISCOVERY_SET_ITEM)}
                className="px-8 py-4 bg-white text-zinc-950 text-xs font-bold tracking-[0.2em] uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                Order Discovery Set (PKR 3,500) <ArrowRight className="w-4 h-4" />
              </button>
              <Link 
                href="/discovery"
                className="px-8 py-4 border border-white/40 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-zinc-950 transition-all flex items-center justify-center gap-2"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] rounded-sm overflow-hidden border border-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=1200" 
              alt="Discovery Coffret Box" 
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* 7. ARTISANAL HERITAGE & EXTRACTION */}
      <section id="heritage" className="py-32 px-6 max-w-7xl mx-auto border-b border-zinc-200">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-6 relative aspect-[4/5] bg-zinc-100 border border-zinc-200 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=1200" 
              alt="Artisanal Maceration Process" 
              className="w-full h-full object-cover grayscale-[0.2]"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 border border-zinc-200">
              <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-1">Raw Formulation</p>
              <p className="text-xs font-semibold text-zinc-900">Cold-Macerated in Bordeaux glass drums for 90 days before sterile flacon fill.</p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-8 bg-zinc-900"></span>
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-zinc-400">The Alchemy</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-zinc-950 mb-8 leading-tight">
              From Grasse to Karachi: <br/>
              <span className="font-serif italic font-normal">Pure Extrait Standard.</span>
            </h2>
            <p className="text-zinc-600 font-light text-base leading-relaxed mb-10">
              Mass-market fragrances dilute essences down to 10% or 15% Eau de Parfum to maximize corporate margins. 
              At Aura, we refuse compromise. Every flacon is formulated as a legitimate <strong>Extrait de Parfum</strong> with 28% to 35% oil weight.
            </p>

            <div className="space-y-6 border-t border-zinc-200 pt-8">
              <div className="flex gap-4">
                <span className="text-xs font-mono font-bold text-zinc-400 w-8">01</span>
                <div>
                  <h4 className="text-sm font-bold tracking-wider uppercase text-zinc-950 mb-1">Unfiltered Aged Botanicals</h4>
                  <p className="text-xs text-zinc-600 font-light leading-relaxed">Sourced directly from historical family distilleries in Southern France and Southeast Asia.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-xs font-mono font-bold text-zinc-400 w-8">02</span>
                <div>
                  <h4 className="text-sm font-bold tracking-wider uppercase text-zinc-950 mb-1">Intimate Skin Chemistry</h4>
                  <p className="text-xs text-zinc-600 font-light leading-relaxed">Formulated to evolve with your skin warmth over 18+ hours rather than vanishing into air.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-xs font-mono font-bold text-zinc-400 w-8">03</span>
                <div>
                  <h4 className="text-sm font-bold tracking-wider uppercase text-zinc-950 mb-1">Sustainable Bespoke Vessels</h4>
                  <p className="text-xs text-zinc-600 font-light leading-relaxed">Recyclable heavy crystal glass flacons with magnetic zamak caps and fine-mist micro atomizers.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. CLIENT REVIEWS & ACCOLADES */}
      <section className="py-28 px-6 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-zinc-400 block mb-3">Client Impressions</span>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-zinc-950">
              Echoes of Distinction
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-zinc-200 bg-[#FAF9F8]">
              <div className="flex gap-1 text-amber-500 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
              </div>
              <p className="text-sm font-light text-zinc-700 leading-relaxed mb-6 italic">
                “Oud Royale is easily on par with Roja Dove and Frederic Malle. The sillage is royal yet never overpowering. Lasts beyond 24 hours on linen.”
              </p>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-950">Kamran S.</p>
              <p className="text-[11px] text-zinc-400">Collector • Lahore</p>
            </div>

            <div className="p-8 border border-zinc-200 bg-[#FAF9F8]">
              <div className="flex gap-1 text-amber-500 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
              </div>
              <p className="text-sm font-light text-zinc-700 leading-relaxed mb-6 italic">
                “Santal Supreme is the holy grail. The soft leather and creamy sandalwood drydown is perfection. Packaging is pure international luxury.”
              </p>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-950">Zoya M.</p>
              <p className="text-[11px] text-zinc-400">Architect • Karachi</p>
            </div>

            <div className="p-8 border border-zinc-200 bg-[#FAF9F8]">
              <div className="flex gap-1 text-amber-500 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
              </div>
              <p className="text-sm font-light text-zinc-700 leading-relaxed mb-6 italic">
                “The Discovery Box allowed me to test them all. Midnight Citrus is crisp and electric for hot summer evenings. Exceptional work.”
              </p>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-950">Hamza B.</p>
              <p className="text-[11px] text-zinc-400">Founder • Islamabad</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      <section className="py-28 px-6 max-w-4xl mx-auto border-b border-zinc-200">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-zinc-400 block mb-3">Answers</span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-zinc-950">
            Frequently Asked Inquiries
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "What makes Extrait de Parfum different from regular perfume?",
              a: "Standard retail perfumes (Eau de Parfum or Eau de Toilette) contain only 10% to 15% fragrance oil mixed with fast-evaporating alcohol. Aura Extraits contain 28% to 35% pure oil concentration, creating a deep, skin-hugging scent that evolves for 18+ hours without harsh alcohol blast."
            },
            {
              q: "How does nationwide delivery work in Pakistan?",
              a: "All orders are dispatched via tracked courier express within 24 hours. Delivery takes 2 to 3 business days for Karachi, Lahore, and Islamabad, and 3 to 4 days for other cities. Tracking links are provided via SMS and email."
            },
            {
              q: "Can I try the perfume before opening the main flacon?",
              a: "Yes. Every full 50ml flacon shipment includes a complimentary matching 2ml trial vial. We recommend testing the trial vial first. If it does not match your taste, you may return the unopened, sealed flacon for an exchange or full refund."
            },
            {
              q: "What payment methods are accepted?",
              a: "We accept Cash on Delivery (COD) across Pakistan, as well as Direct Bank Transfer, Visa, and Mastercard credit/debit cards."
            }
          ].map((item, idx) => (
            <div key={idx} className="border border-zinc-200 bg-white">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-zinc-50 transition-colors"
              >
                <span className="text-sm font-semibold tracking-wide text-zinc-950">{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-6 text-xs text-zinc-600 font-light leading-relaxed border-t border-zinc-100 pt-4">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. NEWSLETTER & VIP CLUB */}
      <section className="py-24 px-6 bg-zinc-100 text-center">
        <div className="max-w-xl mx-auto">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-500 block mb-3">
            Private Olfactory Club
          </span>
          <h3 className="text-3xl font-light tracking-tight text-zinc-950 mb-4">
            Reserved Batch Notifications
          </h3>
          <p className="text-zinc-600 font-light text-sm leading-relaxed mb-8">
            Join our private ledger to receive priority access to limited seasonal extraits, bespoke flacon engravings, and private salon tastings.
          </p>

          {newsletterSubscribed ? (
            <div className="p-4 bg-white border border-zinc-300 text-emerald-700 text-xs font-bold tracking-widest uppercase inline-flex items-center gap-2">
              <Check className="w-4 h-4" /> Welcome to the Aura Ledger.
            </div>
          ) : (
            <form 
              onSubmit={(e) => { e.preventDefault(); setNewsletterSubscribed(true); }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input 
                type="email" 
                required
                placeholder="Enter your email address..."
                className="w-full px-5 py-3.5 bg-white border border-zinc-300 text-xs focus:border-zinc-950 focus:outline-none"
              />
              <button 
                type="submit"
                className="px-8 py-3.5 bg-zinc-950 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-zinc-800 transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 11. LUXURY EXPANSIVE FOOTER */}
      <SiteFooter />

      {/* 12. SLIDE-OVER CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Drawer */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full max-w-md h-full bg-white z-50 shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-zinc-900" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-950">
                    Your Selection ({totalCartCount})
                  </span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-600" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                    <ShoppingBag className="w-12 h-12 text-zinc-300 mb-4" strokeWidth={1} />
                    <p className="text-sm font-light text-zinc-600 mb-2">Your shopping bag is empty.</p>
                    <p className="text-xs text-zinc-400 max-w-xs mb-6">Explore our artisanal collection or discovery set to experience our extraits.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-3 bg-zinc-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-colors"
                    >
                      Browse Flacons
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4 pb-6 border-b border-zinc-100">
                      <div className="w-20 h-24 bg-zinc-100 shrink-0 border border-zinc-200 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-medium text-zinc-950">{item.product.name}</h4>
                            <span className="text-xs font-semibold text-zinc-900">{item.product.price}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 tracking-wider uppercase mt-0.5">{item.product.concentration}</p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-zinc-200">
                            <button 
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-100 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-medium text-zinc-900">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-100 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button 
                            onClick={() => updateQuantity(item.product.id, -item.quantity)}
                            className="text-[11px] font-semibold text-zinc-400 hover:text-red-600 transition-colors uppercase tracking-wider"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer / Checkout */}
              {cart.length > 0 && (
                <div className="p-6 bg-[#FAF9F8] border-t border-zinc-200 space-y-4">
                  <div className="flex justify-between text-xs text-zinc-500 uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-emerald-700 font-bold">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-base font-medium text-zinc-950">
                    <span>Subtotal</span>
                    <span>PKR {totalCartAmount.toLocaleString()}</span>
                  </div>
                  <div className="space-y-2.5">
                    <Link
                      href="/"
                      className="w-full py-4 bg-zinc-950 text-white text-xs font-bold tracking-[0.25em] uppercase hover:bg-zinc-800 transition-colors shadow-lg flex items-center justify-center gap-3"
                    >
                      Proceed to Checkout <ArrowRight className="w-4 h-4" />
                    </Link>

                    <a 
                      href={buildWhatsAppUrl(generateCartWhatsAppMessage(cart, totalCartAmount))}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2.5 shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Order Entire Bag via WhatsApp</span>
                    </a>
                  </div>
                  <p className="text-[10px] text-zinc-400 text-center tracking-widest uppercase">
                    Cash on Delivery & Secure Cards Accepted
                  </p>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* LUXURY INTERACTIVE WHATSAPP CONCIERGE WIDGET */}
      <WhatsAppConcierge cart={cart} totalCartAmount={totalCartAmount} />

    </div>
  );
}
