"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl, generateConsultationWhatsAppMessage, WHATSAPP_CONFIG } from "@/lib/whatsapp";

export default function SiteFooter() {
  const whatsappUrl = buildWhatsAppUrl(
    generateConsultationWhatsAppMessage("Haute Parfumerie Concierge Inquiry")
  );

  return (
    <footer className="border-t border-zinc-200 py-12 sm:py-20 px-4 sm:px-6 bg-white text-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 mb-12 sm:mb-16">
          
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="font-serif text-3xl font-light tracking-[0.35em] uppercase text-zinc-950 block mb-4">
              Aura
            </Link>
            <p className="text-zinc-500 font-light text-xs max-w-sm leading-relaxed mb-6">
              Artisanal Haute Parfumerie engineered for enduring distinction. Formulated with raw absolutes from Grasse, France; hand-finished in Karachi, Pakistan.
            </p>
            <div className="p-4 bg-zinc-50 border border-zinc-200 text-xs space-y-1.5 max-w-sm">
              <p className="font-semibold text-zinc-900">Official Concierge Desk</p>
              <p className="text-zinc-600 font-mono text-[11px]">{WHATSAPP_CONFIG.displayNumber}</p>
              <p className="text-zinc-400 text-[10px]">{WHATSAPP_CONFIG.workingHours}</p>
            </div>
          </div>

          {/* Collection Column */}
          <div className="col-span-1 md:col-span-2">
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-950 block mb-4 sm:mb-6">
              Flacons
            </span>
            <ul className="space-y-2.5 sm:space-y-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              <li><Link href="/perfumes/oud-royale" className="hover:text-zinc-950 transition-colors">Oud Royale</Link></li>
              <li><Link href="/perfumes/velvet-rose" className="hover:text-zinc-950 transition-colors">Velvet Rose</Link></li>
              <li><Link href="/perfumes/midnight-citrus" className="hover:text-zinc-950 transition-colors">Midnight Citrus</Link></li>
              <li><Link href="/perfumes/santal-supreme" className="hover:text-zinc-950 transition-colors">Santal Supreme</Link></li>
              <li><Link href="/perfumes/vanilla-whisper" className="hover:text-zinc-950 transition-colors">Vanilla Whisper</Link></li>
              <li><Link href="/perfumes/aqua-celestia" className="hover:text-zinc-950 transition-colors">Aqua Celestia</Link></li>
              <li><Link href="/discovery" className="hover:text-amber-700 font-bold transition-colors">Discovery Coffret</Link></li>
            </ul>
          </div>

          {/* Experience & The House */}
          <div className="col-span-1 md:col-span-3">
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-950 block mb-4 sm:mb-6">
              The House
            </span>
            <ul className="space-y-2.5 sm:space-y-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              <li><Link href="/about" className="hover:text-zinc-950 transition-colors">About Aura Heritage</Link></li>
              <li><Link href="/about#maceration" className="hover:text-zinc-950 transition-colors">90-Day Maceration</Link></li>
              <li><Link href="/discovery" className="hover:text-zinc-950 transition-colors">Discovery Coffret Set</Link></li>
              <li><Link href="/track-order" className="hover:text-zinc-950 transition-colors">Live Order Tracking</Link></li>
              <li><Link href="/contact" className="hover:text-zinc-950 transition-colors">Concierge & Scent Quiz</Link></li>
              <li><Link href="/admin" className="hover:text-zinc-950 transition-colors">Founder Portal</Link></li>
            </ul>
          </div>

          {/* Client Service & Legal */}
          <div className="col-span-2 md:col-span-3">
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-950 block mb-4 sm:mb-6">
              Client Service
            </span>
            <ul className="space-y-2.5 sm:space-y-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              <li><Link href="/shipping-policy" className="hover:text-zinc-950 transition-colors">Express Shipping & Delivery</Link></li>
              <li><Link href="/refund-policy" className="hover:text-zinc-950 transition-colors">Trial Vial & Returns</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-zinc-950 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-zinc-950 transition-colors">Terms of Service</Link></li>
              <li>
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-800 font-bold hover:text-emerald-950 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Concierge</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-6 sm:pt-8 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left text-xs text-zinc-400 gap-4">
          <p>© 2025 Aura Fragrances. All rights reserved. Artisanal Haute Parfumerie.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 uppercase tracking-wider text-[11px]">
            <Link href="/privacy-policy" className="hover:text-zinc-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-900 transition-colors">Terms</Link>
            <Link href="/shipping-policy" className="hover:text-zinc-900 transition-colors">Shipping</Link>
            <Link href="/refund-policy" className="hover:text-zinc-900 transition-colors">Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
