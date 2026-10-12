import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppConcierge from "@/components/WhatsAppConcierge";
import { Sparkles, ShieldCheck, ArrowRight, Droplets, Clock, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "The House of Aura — Artisanal Haute Parfumerie & Heritage",
  description: "Discover the heritage of Aura Fragrances. Pure Extrait de Parfum formulated with raw absolutes from Grasse, France and cold-macerated for 90 days in Karachi.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FBFBF9] text-zinc-900 selection:bg-zinc-950 selection:text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1">
        
        {/* HERO EDITORIAL */}
        <section className="relative py-16 sm:py-28 md:py-36 px-4 sm:px-6 bg-zinc-950 text-white overflow-hidden border-b border-zinc-800">
          <div className="absolute inset-0 opacity-25">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=1920" 
              alt="Artisanal Maceration Drums" 
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 text-[#C5A880] text-[10px] font-bold tracking-[0.28em] uppercase border border-white/10 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" /> The House • Est. 2024
            </span>
            <h1 className="font-serif text-4xl sm:text-7xl lg:text-8xl font-light tracking-tight mb-8 leading-[1.05]">
              The Alchemy <br />
              <span className="italic font-normal text-[#E0C79F]">of Pure Extrait.</span>
            </h1>
            <p className="text-sm sm:text-xl text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto">
              We founded Aura with a single refusal: to accept the dilution of modern commercial perfumes. 
              Every flacon we pour is a commitment to raw botanical power and intimate skin longevity.
            </p>
          </div>
        </section>

        {/* 3 CORE PILLARS */}
        <section className="py-14 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14 sm:mb-20">
            <span className="text-xs font-bold tracking-[0.28em] uppercase text-[#8C7355] block mb-3">
              Our Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-zinc-950">
              The Three Tenets
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-12">
            <div className="p-6 sm:p-8 bg-white border border-zinc-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#FAF7F2] border border-[#E9E2D8] flex items-center justify-center text-[#8C7355] mb-6">
                  <Droplets className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-zinc-400 block mb-2">01 / CONCENTRATION</span>
                <h3 className="font-serif text-2xl font-light text-zinc-950 mb-4">
                  30%+ Pure Oil Weight
                </h3>
                <p className="text-xs text-zinc-600 font-light leading-relaxed">
                  While mass-market designer Eau de Parfum contains merely 10% to 15% fragrance oil diluted in fast-evaporating alcohol, every Aura creation is classified as genuine <strong>Extrait de Parfum</strong> with 28% to 35% pure raw oil weight.
                </p>
              </div>
              <div className="pt-6 border-t border-zinc-100 mt-6 text-[11px] font-bold text-zinc-900 tracking-wider uppercase">
                18 - 24 Hours Skin Longevity
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-white border border-zinc-200 shadow-sm flex flex-col justify-between" id="maceration">
              <div>
                <div className="w-12 h-12 bg-[#FAF7F2] border border-[#E9E2D8] flex items-center justify-center text-[#8C7355] mb-6">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-zinc-400 block mb-2">02 / MATURATION</span>
                <h3 className="font-serif text-2xl font-light text-zinc-950 mb-4">
                  90-Day Cold Maceration
                </h3>
                <p className="text-xs text-zinc-600 font-light leading-relaxed">
                  Raw essences cannot be rushed. Our formulations rest undisturbed for 90 days in dark, temperature-controlled stainless vessels. This allows volatile top notes and deep base ambers to marry seamlessly without alcohol bite.
                </p>
              </div>
              <div className="pt-6 border-t border-zinc-100 mt-6 text-[11px] font-bold text-zinc-900 tracking-wider uppercase">
                Zero Harsh Alcohol Blast
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-white border border-zinc-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#FAF7F2] border border-[#E9E2D8] flex items-center justify-center text-[#8C7355] mb-6">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-zinc-400 block mb-2">03 / PROVENANCE</span>
                <h3 className="font-serif text-2xl font-light text-zinc-950 mb-4">
                  Grasse to Karachi
                </h3>
                <p className="text-xs text-zinc-600 font-light leading-relaxed">
                  We source rare absolutes directly from historical family distilleries in Southern France, Italian bergamot groves in Calabria, and aged Cambodian agarwood. Finished and hand-bottled in Karachi to preserve regional freshness.
                </p>
              </div>
              <div className="pt-6 border-t border-zinc-100 mt-6 text-[11px] font-bold text-zinc-900 tracking-wider uppercase">
                Direct-to-Collector Luxury
              </div>
            </div>
          </div>
        </section>

        {/* FOUNDER'S LETTER */}
        <section className="py-14 sm:py-24 px-4 sm:px-6 bg-white border-y border-zinc-200">
          <div className="max-w-4xl mx-auto grid md:grid-cols-12 gap-8 sm:gap-12 items-center">
            <div className="md:col-span-5 relative aspect-[4/5] bg-zinc-100 border border-zinc-200 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800" 
                alt="Aura Flagship Bottle" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 p-3 sm:p-4 border border-zinc-200 text-center">
                <span className="font-serif text-sm font-light text-zinc-950">Aura Flacon No. 01</span>
                <span className="block text-[9px] font-mono text-zinc-400 uppercase mt-0.5">Heavy Crystal Glass • Magnetic Cap</span>
              </div>
            </div>

            <div className="md:col-span-7">
              <span className="text-xs font-bold tracking-[0.28em] uppercase text-[#8C7355] block mb-3">
                Letter From the Founder
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-light text-zinc-950 mb-6 leading-tight">
                “A scent should linger like an indelible memory, not vanish with the wind.”
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-zinc-600 font-light leading-relaxed">
                <p>
                  Growing up surrounded by traditional oriental attars and modern Western perfumery, I noticed an unmistakable decline in the performance of modern luxury scents. Brands doubled their prices while diluting their oil concentrations.
                </p>
                <p>
                  Aura was founded as an antidote. We set out to engineer fragrances with uncompromised sillage—where a single spray on collar or wrist remains vivid through dawn and dusk.
                </p>
                <p>
                  Every flacon we ship is packaged with a matching 2ml trial vial so you can test the fragrance risk-free in your own intimacy. We are proud to welcome you to our world.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <p className="font-serif text-xl font-light text-zinc-950">Muzammil</p>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">Founder & Creative Director</p>
                </div>
                <Link 
                  href="/#collection"
                  className="w-full sm:w-auto text-center px-6 py-3.5 bg-zinc-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                >
                  Explore Flacons <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
      <WhatsAppConcierge />
    </div>
  );
}
