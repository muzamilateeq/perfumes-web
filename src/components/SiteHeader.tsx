"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  MessageCircle, 
  ShoppingBag, 
  Truck, 
  Menu, 
  X, 
  ChevronRight, 
  Droplets, 
  ShieldCheck,
  Compass,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { buildWhatsAppUrl, generateConsultationWhatsAppMessage } from "@/lib/whatsapp";
import HeaderSearch from "@/components/HeaderSearch";
import { useStore } from "@/context/StoreContext";

interface SiteHeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function SiteHeader({ cartCount = 0, onOpenCart }: SiteHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { wishlistCount, openWishlist, cartCount: storeCartCount, openCart: storeOpenCart } = useStore();
  const effectiveCartCount = cartCount > 0 ? cartCount : storeCartCount;
  const handleOpenCart = onOpenCart || storeOpenCart;

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayCartCount = mounted ? effectiveCartCount : 0;
  const displayWishlistCount = mounted ? wishlistCount : 0;

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const whatsappUrl = buildWhatsAppUrl(
    generateConsultationWhatsAppMessage("Haute Parfumerie Concierge Inquiry")
  );

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <div className="bg-zinc-950 text-zinc-300 text-[10px] md:text-[11px] font-bold tracking-[0.16em] sm:tracking-[0.28em] uppercase py-2 sm:py-2.5 px-3 sm:px-6 border-b border-zinc-800 text-center flex items-center justify-center gap-3 sm:gap-8">
        <span className="flex items-center gap-1.5 sm:gap-2">
          <Sparkles className="w-3 h-3 text-[#C5A880] shrink-0" /> COMPLIMENTARY EXPRESS DELIVERY NATIONWIDE
        </span>
        <span className="hidden sm:inline text-zinc-600">•</span>
        <span className="hidden sm:inline">CASH ON DELIVERY (COD)</span>
        <span className="hidden md:inline text-zinc-600">•</span>
        <span className="hidden md:inline">100% EXTRAIT DE PARFUM (30%+ OIL)</span>
        <span className="hidden lg:inline text-zinc-600">•</span>
        <span className="hidden lg:inline">FREE TESTER VIAL INCLUDED</span>
      </div>

      {/* 2. PRIMARY NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#FBFBF9]/95 backdrop-blur-xl border-b border-zinc-200 transition-all">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 lg:gap-4">
          
          {/* Left Column: Mobile Menu Toggle / Desktop Nav Links */}
          <div className="flex items-center shrink min-w-0">
            {/* Hamburger Button for Mobile & Tablet */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-zinc-900 hover:text-zinc-600 transition-colors flex items-center gap-1.5 focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-zinc-900" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-800 hidden xs:inline">Menu</span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8">
              <Link 
                href="/perfumes" 
                className="text-xs font-bold tracking-[0.18em] uppercase text-zinc-600 hover:text-zinc-950 transition-colors whitespace-nowrap"
              >
                Collection
              </Link>
              <Link 
                href="/discovery" 
                className="text-xs font-bold tracking-[0.18em] uppercase text-zinc-600 hover:text-zinc-950 transition-colors whitespace-nowrap"
              >
                Discovery Set
              </Link>
              <Link 
                href="/about" 
                className="text-xs font-bold tracking-[0.18em] uppercase text-zinc-600 hover:text-zinc-950 transition-colors whitespace-nowrap"
              >
                The House
              </Link>
              <Link 
                href="/track-order" 
                className="hidden xl:flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] uppercase text-zinc-600 hover:text-zinc-950 transition-colors whitespace-nowrap"
              >
                <Truck className="w-3.5 h-3.5 text-[#8C7355] shrink-0" />
                <span>Track</span>
              </Link>
            </nav>
          </div>

          {/* Center Column: Unobstructed Brand Identity */}
          <Link href="/" className="flex flex-col items-center group py-1 text-center shrink-0 px-2 sm:px-4">
            <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.24em] sm:tracking-[0.32em] uppercase text-zinc-950 group-hover:text-zinc-800 transition-colors whitespace-nowrap">
              Aura
            </span>
            <span className="text-[7.5px] sm:text-[8.5px] font-bold tracking-[0.22em] sm:tracking-[0.32em] uppercase text-[#8C7355] mt-0.5 whitespace-nowrap">
              Haute Parfumerie
            </span>
          </Link>

          {/* Right Column: Search, WhatsApp, Track Icon, Wishlist & Shopping Bag */}
          <div className="flex items-center justify-end gap-2 sm:gap-2.5 lg:gap-3 shrink-0">
            {/* Open Live Perfume Search Bar (Desktop & Tablets) */}
            <div className="hidden sm:block">
              <HeaderSearch />
            </div>

            {/* Quick Track Icon on tablet/smaller desktop where text link is hidden */}
            <Link
              href="/track-order"
              className="hidden lg:flex xl:hidden p-2 text-zinc-700 hover:text-zinc-950 transition-colors items-center justify-center rounded-full hover:bg-zinc-100 shrink-0"
              title="Track Order"
              aria-label="Track Order"
            >
              <Truck className="w-4 h-4 text-[#8C7355]" />
            </Link>

            <a 
              href={whatsappUrl}
              target="_blank" 
              rel="noreferrer"
              className="hidden xl:flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-emerald-800 hover:text-emerald-950 transition-colors bg-emerald-50 px-3 py-2 border border-emerald-200 whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Wishlist Heart Button */}
            <button 
              type="button"
              onClick={openWishlist}
              className="relative p-2 text-zinc-700 hover:text-zinc-950 transition-colors flex items-center justify-center rounded-full hover:bg-zinc-100 shrink-0"
              title="Curated Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors ${displayWishlistCount > 0 ? "fill-rose-500 text-rose-500" : "text-zinc-700"}`} />
              {displayWishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-rose-500 text-white rounded-full text-[9px] font-bold shadow-xs">
                  {displayWishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button 
              type="button"
              onClick={handleOpenCart}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-2.5 bg-zinc-950 text-white text-[11px] sm:text-xs font-bold tracking-[0.16em] sm:tracking-[0.22em] uppercase hover:bg-zinc-800 transition-all shadow-md group shrink-0 whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-300 group-hover:text-white" />
              <span className="hidden sm:inline">Bag</span>
              <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center bg-white text-zinc-950 rounded-full text-[9px] sm:text-[10px] font-bold">
                {displayCartCount}
              </span>
            </button>
          </div>

        </div>

        {/* Mobile Open Live Search Strip (Always open and visible on smartphones) */}
        <div className="sm:hidden px-3 py-2 bg-[#FBFBF9] border-t border-zinc-200/80">
          <HeaderSearch className="w-full" />
        </div>
      </header>

      {/* 3. LUXURY MOBILE NAVIGATION DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />

            {/* Slide-out Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[340px] bg-[#FBFBF9] z-50 shadow-2xl flex flex-col justify-between border-r border-zinc-200 lg:hidden overflow-hidden"
            >
              {/* Drawer Top Header */}
              <div>
                <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-white">
                  <div>
                    <span className="font-serif text-xl font-light tracking-[0.25em] uppercase text-zinc-950 block">
                      Aura
                    </span>
                    <span className="text-[8px] font-bold tracking-[0.25em] uppercase text-[#8C7355] block">
                      Haute Parfumerie
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-700"
                    aria-label="Close Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 sm:p-5 space-y-1">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-3 hover:bg-white rounded-xs text-xs font-bold tracking-[0.2em] uppercase text-zinc-900 border-b border-zinc-100"
                  >
                    <span>Home</span>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </Link>

                  <Link
                    href="/perfumes"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-3 hover:bg-white rounded-xs text-xs font-bold tracking-[0.2em] uppercase text-zinc-900 border-b border-zinc-100"
                  >
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-[#8C7355]" />
                      <span>Signature Flacons</span>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-400">6 Extraits</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openWishlist();
                    }}
                    className="flex items-center justify-between w-full py-3 px-3 hover:bg-white rounded-xs text-xs font-bold tracking-[0.2em] uppercase text-zinc-900 border-b border-zinc-100 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                      <span>Curated Wishlist</span>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-700 bg-zinc-200/80 px-2 py-0.5 rounded-full font-bold">
                      {wishlistCount}
                    </span>
                  </button>

                  <Link
                    href="/discovery"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-3 hover:bg-white rounded-xs text-xs font-bold tracking-[0.2em] uppercase text-zinc-900 border-b border-zinc-100"
                  >
                    <div>
                      <span>Discovery Coffret</span>
                      <span className="block text-[9px] font-light text-[#8C7355] normal-case mt-0.5">
                        6x5ml • 100% Redeemable Voucher
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </Link>

                  <Link
                    href="/#quiz"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-3 hover:bg-white rounded-xs text-xs font-bold tracking-[0.2em] uppercase text-zinc-900 border-b border-zinc-100"
                  >
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-zinc-600" />
                      <span>Fragrance Match Quiz</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </Link>

                  <Link
                    href="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-3 hover:bg-white rounded-xs text-xs font-bold tracking-[0.2em] uppercase text-zinc-900 border-b border-zinc-100"
                  >
                    <span>The House (Principles)</span>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </Link>

                  <Link
                    href="/track-order"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-3 hover:bg-white rounded-xs text-xs font-bold tracking-[0.2em] uppercase text-zinc-900 border-b border-zinc-100"
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#8C7355]" />
                      <span>Track Order</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-3 hover:bg-white rounded-xs text-xs font-bold tracking-[0.2em] uppercase text-zinc-900"
                  >
                    <span>Concierge Contact</span>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </Link>
                </nav>
              </div>

              {/* Drawer Bottom Actions & WhatsApp */}
              <div className="p-4 sm:p-5 border-t border-zinc-200 bg-white space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-[0.16em] uppercase flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <div className="pt-2 text-[10px] text-zinc-500 font-light space-y-1 text-center">
                  <p className="flex items-center justify-center gap-1 font-medium text-zinc-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-900" />
                    Free Nationwide Delivery & COD
                  </p>
                  <p>Daily Concierge: 10 AM - 11 PM PKT</p>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

