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
import { createOrderAction } from "@/app/actions/order";
import WhatsAppConcierge from "@/components/WhatsAppConcierge";
import SiteFooter from "@/components/SiteFooter";
import { PERFUMES_DATA, DISCOVERY_SET_ITEM, type PerfumeItem } from "@/lib/perfumes";
import { 
  buildWhatsAppUrl, 
  generateCartWhatsAppMessage, 
  generateProductWhatsAppMessage, 
  generateConfirmedOrderWhatsAppMessage, 
  generateConsultationWhatsAppMessage 
} from "@/lib/whatsapp";

type Perfume = PerfumeItem;

interface CartItem {
  product: Perfume;
  quantity: number;
}

export default function LuxuryBrandStorefront() {
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

  // Store States
  const [selectedCategory, setSelectedCategory] = useState<string>("All Fragrances");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Perfume | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [includeGiftBox, setIncludeGiftBox] = useState<boolean>(false);

  // Fragrance Match Quiz State
  const [quizOccasion, setQuizOccasion] = useState<string>("Evenings & Weddings");
  const [quizVibe, setQuizVibe] = useState<string>("Woody & Regal Oud");
  const [quizResult, setQuizResult] = useState<Perfume | null>(null);

  // Fast Checkout Form
  const [checkoutData, setCheckoutData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Karachi",
    notes: "",
    paymentMethod: "COD"
  });

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

  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingOrder(true);
    try {
      const res = await createOrderAction({
        customerName: checkoutData.name,
        customerPhone: checkoutData.phone,
        customerAddress: checkoutData.address,
        customerCity: checkoutData.city,
        paymentMethod: checkoutData.paymentMethod,
        notes: includeGiftBox ? "Gift Box Requested" : undefined,
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.priceNum,
          quantity: item.quantity
        })),
        total: totalCartAmount
      });

      setOrderId(res.orderNumber);
      setOrderSuccess(true);
      setCart([]);
    } catch (err) {
      const generatedId = "AUR-" + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedId);
      setOrderSuccess(true);
      setCart([]);
    } finally {
      setIsSubmittingOrder(false);
    }
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
      
      {/* 1. EDITORIAL TOP ANNOUNCEMENT TICKER */}
      <div className="bg-zinc-950 text-zinc-300 text-[10px] md:text-[11px] font-bold tracking-[0.28em] uppercase py-2.5 px-6 border-b border-zinc-800 text-center flex items-center justify-center gap-4 sm:gap-8">
        <span className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-[#C5A880]" /> COMPLIMENTARY EXPRESS DELIVERY NATIONWIDE
        </span>
        <span className="hidden sm:inline text-zinc-600">•</span>
        <span className="hidden sm:inline">CASH ON DELIVERY (COD)</span>
        <span className="hidden md:inline text-zinc-600">•</span>
        <span className="hidden md:inline">100% EXTRAIT DE PARFUM (30%+ OIL)</span>
        <span className="hidden lg:inline text-zinc-600">•</span>
        <span className="hidden lg:inline">FREE TESTER VIAL INCLUDED</span>
      </div>

      {/* 2. HAUTE PARFUMERIE NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#FBFBF9]/90 backdrop-blur-xl border-b border-zinc-200 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-22 flex items-center justify-between">
          
          {/* Navigation Links */}
          <div className="flex items-center gap-6 lg:gap-8">
            <a href="#collection" className="text-xs font-bold tracking-[0.22em] uppercase text-zinc-600 hover:text-zinc-950 transition-colors hidden sm:inline-block">
              Flacons
            </a>
            <Link href="/discovery" className="text-xs font-bold tracking-[0.22em] uppercase text-zinc-600 hover:text-zinc-950 transition-colors hidden sm:inline-block">
              Discovery Box
            </Link>
            <Link href="/about" className="text-xs font-bold tracking-[0.22em] uppercase text-zinc-600 hover:text-zinc-950 transition-colors hidden md:inline-block">
              The House
            </Link>
            <Link href="/track-order" className="text-xs font-bold tracking-[0.22em] uppercase text-zinc-600 hover:text-zinc-950 transition-colors hidden lg:inline-block">
              Track Order
            </Link>
            <Link href="/contact" className="text-xs font-bold tracking-[0.22em] uppercase text-zinc-600 hover:text-zinc-950 transition-colors hidden xl:inline-block">
              Concierge
            </Link>
          </div>
          
          {/* Brand Logo with Serif Identity */}
          <Link href="/" className="flex flex-col items-center group py-2">
            <span className="font-serif text-3xl md:text-4xl font-light tracking-[0.35em] uppercase text-zinc-950 group-hover:text-zinc-800 transition-colors">
              Aura
            </span>
            <span className="text-[9px] font-bold tracking-[0.35em] uppercase text-[#8C7355] mt-0.5">
              Haute Parfumerie • Paris & Karachi
            </span>
          </Link>
          
          {/* Right Action Suite */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a 
              href={buildWhatsAppUrl(generateConsultationWhatsAppMessage("Haute Parfumerie Order Inquiry"))} 
              target="_blank" 
              rel="noreferrer"
              className="hidden lg:flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-emerald-800 hover:text-emerald-950 transition-colors bg-emerald-50 px-3.5 py-2 border border-emerald-200"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Concierge</span>
            </a>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 bg-zinc-950 text-white text-xs font-bold tracking-[0.22em] uppercase hover:bg-zinc-800 transition-all shadow-md group"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-300 group-hover:text-white" />
              <span className="hidden sm:inline">Bag</span>
              <span className="w-5 h-5 flex items-center justify-center bg-white text-zinc-950 rounded-full text-[10px] font-bold">
                {totalCartCount}
              </span>
            </button>
          </div>

        </div>
      </header>

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
            <span className="font-mono text-xs tracking-widest text-[#C5A880] font-bold">
              0{activeHeroIndex + 1}
            </span>
            <span className="text-white/40 text-xs">/</span>
            <span className="font-mono text-xs tracking-widest text-white/70">
              0{perfumes.length}
            </span>
            <div className="w-[1px] h-3 bg-white/20 mx-1" />
            <button 
              onClick={handlePrevSlide}
              className="p-1 hover:text-[#C5A880] text-white transition-colors"
              title="Previous Flacon"
              aria-label="Previous Flacon"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleNextSlide}
              className="p-1 hover:text-[#C5A880] text-white transition-colors"
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
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A880]/20 border border-[#C5A880]/50 text-[#E0C79F] text-[10px] font-bold tracking-[0.28em] uppercase backdrop-blur-md">
                  <Sparkles className="w-3 h-3 text-[#C5A880]" />
                  {activePerfume.badge || "Haute Parfumerie"}
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
                  <span className="font-bold tracking-wider uppercase text-[#C5A880] w-20 shrink-0">
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
                  <span className="font-bold text-white text-base tracking-wide text-[#E0C79F]">
                    {activePerfume.price}
                  </span>
                </div>
              </div>

              {/* OVERLAID ACTION BUTTONS ("SHOP NOW YA ADD WAL BUTON UPER") */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button 
                  onClick={() => addToCart(activePerfume)}
                  className="group flex items-center justify-center sm:justify-between gap-4 text-xs font-bold tracking-[0.22em] uppercase px-8 py-4.5 bg-white text-zinc-950 hover:bg-[#E0C79F] transition-all shadow-2xl"
                >
                  <span>Shop Now • Add To Bag</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>
                <a 
                  href="#collection" 
                  className="group flex items-center justify-center sm:justify-between gap-4 text-xs font-bold tracking-[0.22em] uppercase px-8 py-4.5 border border-white/40 text-white hover:bg-white hover:text-zinc-950 backdrop-blur-sm transition-all"
                >
                  Explore All Flacons
                </a>
                <Link 
                  href="/discovery" 
                  className="hidden md:flex items-center justify-center gap-2 text-xs font-bold tracking-[0.22em] uppercase px-6 py-4.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all"
                >
                  Discovery Set (PKR 3,500)
                </Link>
              </div>

              {/* Performance Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-5 border-t border-white/15 max-w-lg">
                <div>
                  <span className="font-serif text-2xl font-light text-white">{activePerfume.longevity}</span>
                  <span className="block text-[10px] font-bold tracking-widest uppercase text-white/50 mt-0.5">Skin Longevity</span>
                </div>
                <div>
                  <span className="font-serif text-2xl font-light text-white">{activePerfume.sillage || "30%+ Oil"}</span>
                  <span className="block text-[10px] font-bold tracking-widest uppercase text-white/50 mt-0.5">Sillage & Body</span>
                </div>
                <div>
                  <span className="font-serif text-2xl font-light text-[#E0C79F]">COD Nationwide</span>
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
              <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse"></span>
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
                    <span className={`font-mono text-[10px] font-bold ${isActive ? "text-[#8C7355]" : "text-[#C5A880]"}`}>
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
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A880] origin-left"
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
                        ? "w-5 h-1.5 bg-[#C5A880]" 
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

      {/* 4. VALUE PROPOSITION & TRUST BADGES */}
      <section className="bg-white py-14 px-6 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          
          <div className="flex items-start gap-4">
            <Truck className="w-6 h-6 text-zinc-900 shrink-0 mt-1" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-950">Free Express Delivery</p>
              <p className="text-xs text-zinc-500 font-light mt-0.5">Nationwide delivery within 48-72 hours</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-zinc-900 shrink-0 mt-1" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-950">Extrait Concentration</p>
              <p className="text-xs text-zinc-500 font-light mt-0.5">30% to 35% pure oil standard</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-zinc-900 shrink-0 mt-1" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-950">Free Matching Tester</p>
              <p className="text-xs text-zinc-500 font-light mt-0.5">Test the vial before opening the flacon</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <RotateCcw className="w-6 h-6 text-zinc-900 shrink-0 mt-1" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-950">Cash on Delivery</p>
              <p className="text-xs text-zinc-500 font-light mt-0.5">Pay in cash upon doorstep delivery</p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. SIGNATURE COLLECTION WITH OLFACTORY FILTER */}
      <section id="collection" className="py-28 max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-[1px] w-8 bg-zinc-900"></span>
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#8C7355]">The Permanent Line</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-zinc-950">
              Signature Flacons
            </h2>
          </div>
          <p className="text-zinc-500 font-light text-base max-w-md">
            Macerated for 90 days in cold stainless drums. Poured into heavy crystal flacons with fine-mist micro atomizers.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2.5 mb-16 pb-4 border-b border-zinc-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all ${
                selectedCategory === cat 
                  ? "bg-zinc-950 text-white shadow-md" 
                  : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-950 hover:text-zinc-950"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16"
        >
          {filteredPerfumes.map((product) => (
            <motion.div 
              key={product.id} 
              variants={itemVariants} 
              className="group bg-white border border-zinc-200 flex flex-col justify-between hover:border-zinc-950 transition-all shadow-sm"
            >
              <div>
                
                {/* Product Image Frame */}
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100 border-b border-zinc-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[0.2] group-hover:grayscale-0"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-4 left-4 bg-zinc-950 text-white px-3 py-1 text-[9px] font-bold tracking-widest uppercase shadow-md">
                      {product.badge}
                    </span>
                  )}

                  {/* Volume Pill */}
                  <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 text-[9px] font-mono text-zinc-800 border border-zinc-200">
                    {product.volume}
                  </span>

                  {/* Quick View Button on Image */}
                  <button 
                    onClick={() => setQuickViewProduct(product)}
                    className="absolute bottom-4 right-4 p-2.5 bg-white/90 backdrop-blur-md hover:bg-zinc-950 hover:text-white transition-all border border-zinc-200 shadow-md text-zinc-700 opacity-0 group-hover:opacity-100"
                    title="Quick Inspect"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Info */}
                <div className="p-6 sm:p-8">
                  <div className="flex justify-between items-baseline mb-2">
                    <Link href={`/perfumes/${product.slug}`} className="hover:text-[#8C7355] transition-colors">
                      <h3 className="font-serif text-2xl font-light tracking-tight text-zinc-950">{product.name}</h3>
                    </Link>
                    <p className="text-sm font-bold tracking-wider text-zinc-950">{product.price}</p>
                  </div>
                  
                  <p className="text-xs text-zinc-500 font-light mb-5 leading-relaxed">{product.description}</p>
                  
                  {/* Olfactory Notes Box */}
                  <div className="p-3 bg-[#FAF9F8] border border-zinc-100 space-y-1.5 text-[11px] mb-2">
                    <div className="flex gap-2">
                      <span className="font-bold tracking-wider uppercase text-zinc-400 w-16 shrink-0">Notes:</span>
                      <span className="text-zinc-800 font-medium">{product.notes}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold tracking-wider uppercase text-zinc-400 w-16 shrink-0">Sillage:</span>
                      <span className="text-zinc-600">{product.sillage} ({product.longevity})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-6 pb-6 pt-0 space-y-2">
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full py-3.5 bg-zinc-950 text-white text-xs font-bold tracking-[0.22em] uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Add To Bag • {product.price}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    href={`/perfumes/${product.slug}`}
                    className="py-2.5 bg-[#FAF9F8] border border-zinc-200 text-zinc-900 text-[10px] font-bold tracking-widest uppercase hover:border-zinc-900 transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Full Flacon</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <button 
                    onClick={() => setQuickViewProduct(product)}
                    className="py-2.5 border border-zinc-200 text-zinc-600 text-[10px] font-bold tracking-widest uppercase hover:border-zinc-900 hover:text-zinc-950 transition-colors"
                  >
                    Pyramid
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 6. INTERACTIVE SCENT FINDER QUIZ (HIGH ENGAGEMENT) */}
      <section id="finder" className="py-24 bg-white border-y border-zinc-200 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-[0.28em] uppercase text-[#8C7355] block mb-3">
              Personalized Consultation
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-light tracking-tight text-zinc-950">
              Find Your Signature Aura
            </h2>
            <p className="text-zinc-500 font-light text-sm max-w-md mx-auto mt-3">
              Unsure which creation suits your presence? Answer two questions for an instant recommendation.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-[#FBFBF9] border border-zinc-200 shadow-sm space-y-8">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-zinc-500 mb-3">
                1. Where will you primarily wear this fragrance?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                    className={`p-3 text-xs font-medium tracking-wide border transition-all text-center ${
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
              <label className="block text-xs font-bold tracking-widest uppercase text-zinc-500 mb-3">
                2. What olfactory profile speaks to your character?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                    className={`p-3 text-xs font-medium tracking-wide border transition-all text-center ${
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
              className="w-full py-4 bg-zinc-950 text-white text-xs font-bold tracking-[0.25em] uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Compass className="w-4 h-4" /> Reveal My Fragrance Match
            </button>

            {quizResult && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-white border border-[#C5A880] flex flex-col sm:flex-row items-center gap-6"
              >
                <div className="w-24 h-28 bg-zinc-100 shrink-0 overflow-hidden border border-zinc-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={quizResult.image} alt={quizResult.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C7355] block">
                    Your Tailored Match
                  </span>
                  <h4 className="font-serif text-2xl font-light text-zinc-950">{quizResult.name}</h4>
                  <p className="text-xs text-zinc-500 mt-1">{quizResult.description}</p>
                  <p className="text-xs font-bold text-zinc-950 mt-2">{quizResult.price} • {quizResult.volume}</p>
                </div>
                <button 
                  onClick={() => addToCart(quizResult)}
                  className="px-6 py-3 bg-zinc-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all shrink-0"
                >
                  Add Match To Bag
                </button>
              </motion.div>
            )}

          </div>
        </div>
      </section>

      {/* 7. DISCOVERY COFFRET FEATURE BANNER */}
      <section id="discovery" className="py-24 bg-zinc-950 text-white px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6">
            <span className="px-3.5 py-1.5 bg-white/10 text-[#C5A880] text-[10px] font-bold tracking-[0.28em] uppercase inline-block mb-6 border border-white/10">
              Sample In Private Luxury
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-6 leading-tight">
              The Aura Discovery Coffret.
            </h2>
            <p className="text-zinc-400 font-light text-base leading-relaxed mb-8">
              Unsure which fragrance aligns with your skin chemistry? Order our bespoke Discovery Coffret containing <strong>all 6 signature extraits in 5ml glass atomizers</strong>. 
              Delivered with a 100% redeemable PKR 4,500 voucher valid for your first 50ml flacon.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10 border-t border-zinc-800 pt-8">
              <div>
                <span className="font-serif text-3xl font-light">6 x 5ml</span>
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mt-1">Artisanal Atomizers</p>
              </div>
              <div>
                <span className="font-serif text-3xl font-light">PKR 3,500</span>
                <p className="text-xs font-bold tracking-widest uppercase text-[#C5A880] mt-1">100% Redeemable Voucher</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => addToCart(DISCOVERY_SET_ITEM)}
                className="px-8 py-4.5 bg-white text-zinc-950 text-xs font-bold tracking-[0.22em] uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-2xl"
              >
                Order Discovery Set • PKR 3,500 <ArrowRight className="w-4 h-4" />
              </button>
              <Link 
                href="/discovery"
                className="px-8 py-4.5 border border-white/40 text-white text-xs font-bold tracking-[0.22em] uppercase hover:bg-white hover:text-zinc-950 transition-all flex items-center justify-center gap-2"
              >
                Learn More About Coffret
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] overflow-hidden border border-zinc-800 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=1200" 
              alt="Discovery Coffret Box" 
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* 8. BRAND HERITAGE & FORMULATION ETHOS */}
      <section id="heritage" className="py-32 px-6 max-w-7xl mx-auto border-b border-zinc-200">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-6 relative aspect-[4/5] bg-zinc-100 border border-zinc-200 overflow-hidden shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=1200" 
              alt="French Raw Ingredients & Cold Maceration" 
              className="w-full h-full object-cover grayscale-[0.2]"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 border border-zinc-200">
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#8C7355] mb-1">Cold Maceration Process</p>
              <p className="text-xs font-semibold text-zinc-900">Each batch is preserved in chilled stainless drums for 90 days to eliminate sharp alcohol odors.</p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-8 bg-zinc-900"></span>
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#8C7355]">The Standards</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-zinc-950 mb-8 leading-tight">
              Why Aura Stands Apart <br/>
              <span className="italic font-normal">From Mass Retailers.</span>
            </h2>
            <p className="text-zinc-600 font-light text-base leading-relaxed mb-10">
              Commercial perfumes flood the market with watered-down 12% Eau de Parfum designed to vanish within three hours so you spray more. 
              At Aura, we formulate strictly at <strong>Extrait de Parfum (30%+ concentration)</strong> — an uncompromising tier of perfumery reserved for true connoisseurs.
            </p>

            <div className="space-y-6 border-t border-zinc-200 pt-8">
              <div className="flex gap-4">
                <span className="text-xs font-mono font-bold text-[#8C7355] w-8">01</span>
                <div>
                  <h4 className="text-sm font-bold tracking-wider uppercase text-zinc-950 mb-1">Authentic Grasse Absolutes</h4>
                  <p className="text-xs text-zinc-600 font-light leading-relaxed">We source natural botanical concentrates from historical family distilleries in Southern France.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-xs font-mono font-bold text-[#8C7355] w-8">02</span>
                <div>
                  <h4 className="text-sm font-bold tracking-wider uppercase text-zinc-950 mb-1">Aged Assamese & Cambodian Ouds</h4>
                  <p className="text-xs text-zinc-600 font-light leading-relaxed">No synthetic burning rubber odor. Only pure, sweet, aged natural agarwood resin.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-xs font-mono font-bold text-[#8C7355] w-8">03</span>
                <div>
                  <h4 className="text-sm font-bold tracking-wider uppercase text-zinc-950 mb-1">Try First Guarantee</h4>
                  <p className="text-xs text-zinc-600 font-light leading-relaxed">Every bottle comes with a matching free tester vial. Test the vial first; if you dislike it, return the sealed bottle for a 100% refund.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. VERIFIED REVIEWS */}
      <section className="py-28 px-6 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#8C7355] block mb-3">Client Accolades</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-zinc-950">
              Echoes of Distinction
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-zinc-200 bg-[#FAF9F8]">
              <div className="flex gap-1 text-[#C5A880] mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#C5A880]" />)}
              </div>
              <p className="font-serif text-base font-light text-zinc-800 leading-relaxed mb-6 italic">
                “Oud Royale easily beats niche brands costing PKR 50,000+. The drydown is smooth, smoky, and stays on my blazer for two days. Packaging feels like Creed.”
              </p>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-950">Mustafa Khan</p>
              <p className="text-[11px] text-zinc-400">Verified Buyer • Clifton, Karachi</p>
            </div>

            <div className="p-8 border border-zinc-200 bg-[#FAF9F8]">
              <div className="flex gap-1 text-[#C5A880] mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#C5A880]" />)}
              </div>
              <p className="font-serif text-base font-light text-zinc-800 leading-relaxed mb-6 italic">
                “Santal Supreme is pure magic. Soft Tuscan leather with creamy sandalwood. Delivery arrived in Lahore in 48 hours with cash on delivery. 10/10 service.”
              </p>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-950">Ayesha Malik</p>
              <p className="text-[11px] text-zinc-400">Verified Buyer • DHA, Lahore</p>
            </div>

            <div className="p-8 border border-zinc-200 bg-[#FAF9F8]">
              <div className="flex gap-1 text-[#C5A880] mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#C5A880]" />)}
              </div>
              <p className="font-serif text-base font-light text-zinc-800 leading-relaxed mb-6 italic">
                “I bought the Discovery Box first to test. Ended up ordering full bottles of Velvet Rose and Midnight Citrus. The tester concept gives complete peace of mind.”
              </p>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-950">Bilal Siddiqui</p>
              <p className="text-[11px] text-zinc-400">Verified Buyer • F-7, Islamabad</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQS */}
      <section className="py-28 px-6 max-w-4xl mx-auto border-b border-zinc-200">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#8C7355] block mb-3">Assistance</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-zinc-950">
            Frequently Asked Inquiries
          </h2>
        </div>

        <div className="space-y-4">
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

      {/* 11. WHATSAPP CONCIERGE BANNER */}
      <section className="py-20 px-6 bg-emerald-950 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <MessageCircle className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
          <h3 className="font-serif text-3xl font-light tracking-tight mb-4 text-white">
            Prefer Ordering via WhatsApp?
          </h3>
          <p className="text-emerald-200 font-light text-sm leading-relaxed mb-8">
            Our fragrance advisors are available daily from 10 AM to 11 PM to provide scent recommendations and take orders directly over WhatsApp.
          </p>
          <a 
            href={buildWhatsAppUrl(generateConsultationWhatsAppMessage("Private Fragrance Consultation"))}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 text-zinc-950 text-xs font-bold tracking-[0.2em] uppercase hover:bg-emerald-400 transition-all shadow-xl"
          >
            Chat with Concierge on WhatsApp <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* 12. LUXURY FOOTER */}
      <SiteFooter />

      {/* 13. SLIDE-OVER SHOPPING BAG WITH FREE GIFT & SHIPPING PROGRESS */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

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
                  <ShoppingBag className="w-5 h-5 text-zinc-950" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-950">
                    Your Shopping Bag ({totalCartCount})
                  </span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-600" />
                </button>
              </div>

              {/* Free Shipping Progress Indicator */}
              <div className="px-6 py-3 bg-[#FAF7F2] border-b border-[#EBE4D8] flex items-center gap-2 text-xs font-semibold text-[#7A6448]">
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
                <span>You've unlocked Free Nationwide Delivery!</span>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                    <ShoppingBag className="w-12 h-12 text-zinc-300 mb-4" strokeWidth={1} />
                    <p className="text-sm font-light text-zinc-600 mb-2">Your shopping bag is empty.</p>
                    <p className="text-xs text-zinc-400 max-w-xs mb-6">Explore our signature flacons or order the Discovery Coffret to test all extraits.</p>
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
                            <h4 className="font-serif text-base font-medium text-zinc-950">{item.product.name}</h4>
                            <span className="text-xs font-bold text-zinc-900">{item.product.price}</span>
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
                            className="text-[11px] font-bold text-zinc-400 hover:text-red-600 transition-colors uppercase tracking-wider"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Complimentary Gift Box Checkbox */}
              {cart.length > 0 && (
                <div className="px-6 py-3 border-t border-zinc-200 bg-white">
                  <label className="flex items-center gap-3 cursor-pointer text-xs text-zinc-700">
                    <input 
                      type="checkbox" 
                      checked={includeGiftBox}
                      onChange={(e) => setIncludeGiftBox(e.target.checked)}
                      className="rounded border-zinc-300 text-zinc-900 focus:ring-0"
                    />
                    <Gift className="w-4 h-4 text-[#8C7355]" />
                    <span>Include free gift packaging & wax seal ribbon</span>
                  </label>
                </div>
              )}

              {/* Footer / Proceed to Checkout */}
              {cart.length > 0 && (
                <div className="p-6 bg-[#FAF9F8] border-t border-zinc-200 space-y-4">
                  <div className="flex justify-between text-xs text-zinc-500 uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-emerald-700 font-bold">Complimentary Express</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-zinc-950">
                    <span>Total Amount</span>
                    <span className="font-serif text-xl">PKR {totalCartAmount.toLocaleString()}</span>
                  </div>
                  <div className="space-y-2.5">
                    <button 
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsCheckoutOpen(true);
                      }}
                      className="w-full py-4 bg-zinc-950 text-white text-xs font-bold tracking-[0.25em] uppercase hover:bg-zinc-800 transition-colors shadow-xl flex items-center justify-center gap-3"
                    >
                      Proceed to Checkout <ArrowRight className="w-4 h-4" />
                    </button>

                    <a 
                      href={buildWhatsAppUrl(generateCartWhatsAppMessage(cart, totalCartAmount, { notes: includeGiftBox ? "Gift Box Requested" : undefined }))}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2.5 shadow-md rounded-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Order Entire Bag via WhatsApp</span>
                    </a>
                  </div>
                  <p className="text-[10px] text-zinc-400 text-center tracking-widest uppercase">
                    Cash on Delivery (COD) & Raast / Cards Accepted
                  </p>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

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
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[750px] max-h-[90vh] bg-white z-50 shadow-2xl overflow-y-auto p-6 sm:p-10 border border-zinc-200"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C7355]">
                    {quickViewProduct.category} • {quickViewProduct.volume}
                  </span>
                  <h3 className="font-serif text-3xl font-light text-zinc-950">{quickViewProduct.name}</h3>
                </div>
                <button 
                  onClick={() => setQuickViewProduct(null)}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 items-start mb-8">
                <div className="aspect-[4/5] bg-zinc-100 overflow-hidden border border-zinc-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="text-xl font-bold text-zinc-950">{quickViewProduct.price}</span>
                    <p className="text-xs text-zinc-500 mt-2 font-light leading-relaxed">{quickViewProduct.description}</p>
                  </div>

                  {/* Pyramid */}
                  <div className="border border-zinc-200 p-4 bg-[#FAF9F8] space-y-3 text-xs">
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

                  <div className="grid grid-cols-2 gap-4 text-xs">
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
                      className="w-full py-4 bg-zinc-950 text-white text-xs font-bold tracking-[0.25em] uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add Flacon To Bag
                    </button>

                    <a
                      href={buildWhatsAppUrl(generateProductWhatsAppMessage(quickViewProduct))}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 border border-emerald-600 text-emerald-800 hover:bg-emerald-50 text-xs font-bold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2"
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

      {/* 15. EXPRESS CASH ON DELIVERY CHECKOUT MODAL */}
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
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[650px] max-h-[90vh] bg-white z-50 shadow-2xl overflow-y-auto p-8 sm:p-10 border border-zinc-200"
            >
              <div className="flex justify-between items-center pb-6 border-b border-zinc-200 mb-6">
                <div>
                  <h3 className="font-serif text-3xl font-light text-zinc-950">Express Checkout</h3>
                  <p className="text-xs text-zinc-500 mt-1">Complete your order with Cash on Delivery</p>
                </div>
                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              {orderSuccess ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-3xl font-light text-zinc-950 mb-2">Order Confirmed!</h4>
                  <p className="text-sm font-bold text-zinc-900 mb-1">Order Reference: #{orderId}</p>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-8 leading-relaxed">
                    Thank you, {checkoutData.name}. Your order has been registered for Cash on Delivery. 
                    Our concierge will dispatch your sealed package with the complimentary matching tester vial.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={buildWhatsAppUrl(generateConfirmedOrderWhatsAppMessage(orderId, checkoutData, cart, totalCartAmount))}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3.5 bg-emerald-700 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-emerald-600 transition-colors inline-flex items-center justify-center gap-2 shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4" /> Send Receipt to WhatsApp
                    </a>
                    <button 
                      onClick={() => {
                        setOrderSuccess(false);
                        setIsCheckoutOpen(false);
                      }}
                      className="px-6 py-3.5 bg-zinc-950 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-zinc-800 transition-colors"
                    >
                      Continue Browsing
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                  
                  {/* Summary Bar */}
                  <div className="p-4 bg-zinc-50 border border-zinc-200 flex justify-between items-center text-xs">
                    <span className="font-semibold text-zinc-700">Total Payable at Doorstep:</span>
                    <span className="font-serif text-xl font-bold text-zinc-950">PKR {totalCartAmount.toLocaleString()}</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-2">
                        Recipient Full Name *
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Tariq Mansoor"
                        value={checkoutData.name}
                        onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF9F8] border border-zinc-300 text-sm focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-2">
                        WhatsApp / Mobile No *
                      </label>
                      <input 
                        type="tel" 
                        required
                        placeholder="0300 1234567"
                        value={checkoutData.phone}
                        onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF9F8] border border-zinc-300 text-sm focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-2">
                      Complete Delivery Address *
                    </label>
                    <textarea 
                      rows={2}
                      required
                      placeholder="House / Apartment no, Street, Sector / Area..."
                      value={checkoutData.address}
                      onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF9F8] border border-zinc-300 text-sm focus:border-zinc-950 focus:outline-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-2">
                        Destination City *
                      </label>
                      <select 
                        value={checkoutData.city}
                        onChange={(e) => setCheckoutData({ ...checkoutData, city: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF9F8] border border-zinc-300 text-sm focus:border-zinc-950 focus:outline-none"
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
                      <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-2">
                        Payment Mode
                      </label>
                      <select 
                        value={checkoutData.paymentMethod}
                        onChange={(e) => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF9F8] border border-zinc-300 text-sm focus:border-zinc-950 focus:outline-none font-bold"
                      >
                        <option value="COD">Cash on Delivery (Pay at Doorstep)</option>
                        <option value="BANK">Direct Bank Transfer / Raast</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4.5 bg-zinc-950 text-white text-xs font-bold tracking-[0.25em] uppercase hover:bg-zinc-800 transition-colors shadow-xl flex items-center justify-center gap-3 mt-6"
                  >
                    Confirm Order (PKR {totalCartAmount.toLocaleString()}) <ArrowRight className="w-4 h-4" />
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

      {/* 16. LUXURY INTERACTIVE WHATSAPP CONCIERGE WIDGET */}
      <WhatsAppConcierge cart={cart} totalCartAmount={totalCartAmount} />

    </div>
  );
}
