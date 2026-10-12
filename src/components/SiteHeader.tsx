"use client";

import Link from "next/link";
import { Sparkles, MessageCircle, ShoppingBag } from "lucide-react";
import { buildWhatsAppUrl, generateConsultationWhatsAppMessage } from "@/lib/whatsapp";

interface SiteHeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function SiteHeader({ cartCount = 0, onOpenCart }: SiteHeaderProps) {
  const whatsappUrl = buildWhatsAppUrl(
    generateConsultationWhatsAppMessage("Haute Parfumerie Concierge Inquiry")
  );

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT TICKER */}
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

      {/* 2. PRIMARY NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#FBFBF9]/95 backdrop-blur-xl border-b border-zinc-200 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Navigation Links */}
          <nav className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="text-xs font-bold tracking-[0.22em] uppercase text-zinc-600 hover:text-zinc-950 transition-colors">
              Home
            </Link>
            <Link href="/discovery" className="text-xs font-bold tracking-[0.22em] uppercase text-zinc-600 hover:text-zinc-950 transition-colors">
              Discovery Set
            </Link>
            <Link href="/about" className="text-xs font-bold tracking-[0.22em] uppercase text-zinc-600 hover:text-zinc-950 transition-colors hidden md:inline-block">
              The House
            </Link>
            <Link href="/track-order" className="text-xs font-bold tracking-[0.22em] uppercase text-zinc-600 hover:text-zinc-950 transition-colors hidden sm:inline-block">
              Track Order
            </Link>
            <Link href="/contact" className="text-xs font-bold tracking-[0.22em] uppercase text-zinc-600 hover:text-zinc-950 transition-colors hidden lg:inline-block">
              Concierge
            </Link>
          </nav>

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
          <div className="flex items-center gap-3 sm:gap-5">
            <a 
              href={whatsappUrl}
              target="_blank" 
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-emerald-800 hover:text-emerald-950 transition-colors bg-emerald-50 px-3.5 py-2 border border-emerald-200"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {onOpenCart ? (
              <button 
                onClick={onOpenCart}
                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950 text-white text-xs font-bold tracking-[0.22em] uppercase hover:bg-zinc-800 transition-all shadow-md group"
              >
                <ShoppingBag className="w-4 h-4 text-zinc-300 group-hover:text-white" />
                <span className="hidden sm:inline">Bag</span>
                <span className="w-5 h-5 flex items-center justify-center bg-white text-zinc-950 rounded-full text-[10px] font-bold">
                  {cartCount}
                </span>
              </button>
            ) : (
              <Link
                href="/#collection"
                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950 text-white text-xs font-bold tracking-[0.22em] uppercase hover:bg-zinc-800 transition-all shadow-md"
              >
                <ShoppingBag className="w-4 h-4 text-zinc-300" />
                <span>Shop</span>
              </Link>
            )}
          </div>

        </div>
      </header>
    </>
  );
}
