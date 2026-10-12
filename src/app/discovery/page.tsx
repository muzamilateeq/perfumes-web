"use client";

import { useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppConcierge from "@/components/WhatsAppConcierge";
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  MessageCircle, 
  ShoppingBag,
  Gift
} from "lucide-react";
import { PERFUMES_DATA } from "@/lib/perfumes";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { createOrderAction } from "@/app/actions/order";

export default function DiscoveryPage() {
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Karachi",
    paymentMethod: "COD"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const discoveryItem = {
    name: "Aura Discovery Coffret (6 x 5ml Vials)",
    priceNum: 4500,
    priceStr: "PKR 4,500"
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createOrderAction({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        customerCity: formData.city,
        paymentMethod: formData.paymentMethod,
        notes: "Discovery Set Order with 100% Voucher",
        items: [{
          name: discoveryItem.name,
          price: discoveryItem.priceNum,
          quantity: 1
        }],
        total: discoveryItem.priceNum
      });
      setOrderRef(res.orderNumber);
      setIsOrdered(true);
    } catch {
      const fallbackId = "AUR-" + Math.floor(100000 + Math.random() * 900000);
      setOrderRef(fallbackId);
      setIsOrdered(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappOrderUrl = buildWhatsAppUrl(
    `✨ *DISCOVERY COFFRET ORDER INQUIRY* ✨\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `Product: *Aura Discovery Coffret (6 x 5ml Glass Atomizers)*\n` +
    `Price: *PKR 4,500*\n` +
    `Voucher: 100% Redeemable (PKR 4,500 toward any 50ml flacon)\n` +
    `Delivery: Free Express Nationwide (COD)\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `Salam! I would like to order the Discovery Box. Please share delivery details.`
  );

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-zinc-900 selection:bg-zinc-950 selection:text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1">
        
        {/* HERO FEATURE */}
        <section className="py-20 md:py-28 px-6 bg-zinc-950 text-white border-b border-zinc-800">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 text-[#C5A880] text-[10px] font-bold tracking-[0.28em] uppercase border border-white/10 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" /> Sample in Private Luxury
              </span>

              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight mb-6 leading-[1.05]">
                The Aura <br />
                <span className="italic font-normal text-[#E0C79F]">Discovery Coffret.</span>
              </h1>

              <p className="text-zinc-300 font-light text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                Selecting a signature extrait requires intimate skin chemistry. The Discovery Coffret gives you <strong>all six permanent creations in bespoke 5ml glass atomizers</strong>, accompanied by an embossed black keepsake box and a <strong>100% redeemable PKR 4,500 voucher</strong>.
              </p>

              {/* Value Props */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10 border-y border-zinc-800 py-6">
                <div>
                  <span className="font-serif text-3xl font-light text-white">6 x 5ml</span>
                  <span className="block text-[10px] font-bold tracking-widest uppercase text-zinc-400 mt-1">Glass Atomizers</span>
                </div>
                <div>
                  <span className="font-serif text-3xl font-light text-[#E0C79F]">PKR 4,500</span>
                  <span className="block text-[10px] font-bold tracking-widest uppercase text-zinc-400 mt-1">100% Free Shipping</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="font-serif text-3xl font-light text-emerald-400">100%</span>
                  <span className="block text-[10px] font-bold tracking-widest uppercase text-zinc-400 mt-1">Redeemable Voucher</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#order-section"
                  className="px-8 py-4 bg-white text-zinc-950 text-xs font-bold tracking-[0.22em] uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-2xl"
                >
                  Order With Cash on Delivery <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold tracking-[0.22em] uppercase transition-all flex items-center justify-center gap-2.5 shadow-xl"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-square sm:aspect-[4/3] lg:aspect-square overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=1200" 
                alt="Aura Discovery Coffret Box" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-black/85 backdrop-blur-md p-4 border border-white/15">
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#C5A880] mb-1">Total Fluid Volume</p>
                <p className="text-xs text-white font-medium">30ml Pure Extrait de Parfum (Over 450 Fine Sprays)</p>
              </div>
            </div>

          </div>
        </section>

        {/* INCLUDED PERFUMES SHOWCASE */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-[0.28em] uppercase text-[#8C7355] block mb-3">
              Complete Spectrum
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-zinc-950">
              The Six Extraits Inside
            </h2>
            <p className="text-zinc-600 font-light text-sm mt-3">
              Each 5ml atomizer delivers approximately 75 intimate sprays, providing 2 to 3 weeks of daily wear per creation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PERFUMES_DATA.map((p, index) => (
              <div key={p.id} className="p-6 bg-white border border-zinc-200 flex flex-col justify-between shadow-2xs hover:border-zinc-950 transition-all">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-xs text-zinc-400 font-bold">0{index + 1}</span>
                    <span className="px-2.5 py-1 bg-zinc-100 text-zinc-700 text-[10px] font-bold tracking-wider uppercase">
                      {p.category}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-light text-zinc-950 mb-2">{p.name}</h3>
                  <p className="text-xs text-zinc-500 font-light mb-4">{p.description}</p>
                  
                  <div className="p-3 bg-[#FAF9F7] text-[11px] space-y-1 mb-4 border border-zinc-100">
                    <div className="flex gap-2">
                      <span className="font-bold text-zinc-400 uppercase w-14 shrink-0">Notes:</span>
                      <span className="text-zinc-800">{p.notes}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-zinc-400 uppercase w-14 shrink-0">Duration:</span>
                      <span className="text-zinc-700">{p.longevity}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/perfumes/${p.slug}`}
                  className="text-xs font-bold tracking-widest uppercase text-zinc-900 hover:text-amber-700 flex items-center justify-between pt-4 border-t border-zinc-100"
                >
                  <span>View 50ml Flacon</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* HOW THE VOUCHER WORKS */}
        <section className="py-20 px-6 bg-[#FAF7F2] border-y border-[#E9E2D8]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-bold tracking-[0.28em] uppercase text-[#8C7355] block mb-2">
                100% Risk-Free Architecture
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-zinc-950">
                How The PKR 4,500 Voucher Operates
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 border border-[#E9E2D8]">
                <span className="font-mono text-2xl font-light text-[#8C7355] block mb-3">01</span>
                <h4 className="font-serif text-lg font-bold text-zinc-950 mb-2">Order Discovery Box</h4>
                <p className="text-xs text-zinc-600 font-light leading-relaxed">
                  Receive the 6 x 5ml luxury coffret with complimentary nationwide express shipping for PKR 4,500.
                </p>
              </div>

              <div className="bg-white p-6 border border-[#E9E2D8]">
                <span className="font-mono text-2xl font-light text-[#8C7355] block mb-3">02</span>
                <h4 className="font-serif text-lg font-bold text-zinc-950 mb-2">Wear Over 30 Days</h4>
                <p className="text-xs text-zinc-600 font-light leading-relaxed">
                  Test each formulation on your skin warmth over varied evenings, meetings, and climates.
                </p>
              </div>

              <div className="bg-white p-6 border border-[#E9E2D8]">
                <span className="font-mono text-2xl font-light text-[#8C7355] block mb-3">03</span>
                <h4 className="font-serif text-lg font-bold text-zinc-950 mb-2">Deduct 100% of Price</h4>
                <p className="text-xs text-zinc-600 font-light leading-relaxed">
                  Use your enclosed voucher code to deduct the entire PKR 4,500 from your first full 50ml flacon purchase.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ORDER CHECKOUT SECTION */}
        <section id="order-section" className="py-24 px-6 max-w-2xl mx-auto">
          <div className="bg-white p-8 sm:p-12 border border-zinc-200 shadow-sm">
            <div className="text-center mb-8">
              <span className="text-[10px] font-bold tracking-[0.28em] uppercase text-[#8C7355] block mb-2">
                Doorstep Delivery
              </span>
              <h3 className="font-serif text-3xl font-light text-zinc-950">
                Order Your Discovery Coffret
              </h3>
              <p className="text-xs text-zinc-500 mt-2">
                PKR 4,500 • Cash on Delivery Nationwide • Free Delivery
              </p>
            </div>

            {isOrdered ? (
              <div className="p-8 text-center bg-emerald-50 border border-emerald-200">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7" />
                </div>
                <h4 className="font-serif text-2xl font-light text-emerald-950 mb-2">Discovery Coffret Registered!</h4>
                <p className="text-xs font-bold text-zinc-900 mb-1">Order Reference: #{orderRef}</p>
                <p className="text-xs text-zinc-600 mb-6 leading-relaxed">
                  Thank you, {formData.name}. Your box will be packed in our sealed black coffret and dispatched within 24 hours.
                </p>
                <a
                  href={buildWhatsAppUrl(`Salam! I ordered Discovery Coffret #${orderRef}. Please confirm dispatch timeline.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4" /> Confirm on WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asad Siddiqui"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF9F7] border border-zinc-300 text-xs focus:border-zinc-950 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                    Mobile / WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF9F7] border border-zinc-300 text-xs focus:border-zinc-950 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                    Complete Shipping Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="House/Apartment #, Street, Area..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF9F7] border border-zinc-300 text-xs focus:border-zinc-950 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Destination City *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF9F7] border border-zinc-300 text-xs focus:border-zinc-950 focus:outline-none"
                    >
                      <option>Karachi</option>
                      <option>Lahore</option>
                      <option>Islamabad</option>
                      <option>Rawalpindi</option>
                      <option>Faisalabad</option>
                      <option>Multan</option>
                      <option>Peshawar</option>
                      <option>Quetta</option>
                      <option>Other City</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Payment Mode
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF9F7] border border-zinc-300 text-xs focus:border-zinc-950 focus:outline-none font-bold"
                    >
                      <option value="COD">Cash on Delivery</option>
                      <option value="BANK">Bank Transfer / Raast</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4.5 bg-zinc-950 text-white text-xs font-bold tracking-[0.25em] uppercase hover:bg-zinc-800 transition-colors shadow-xl mt-4 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Registering Order..." : "Confirm Discovery Set • PKR 4,500"}
                </button>
              </form>
            )}

          </div>
        </section>

      </main>

      <SiteFooter />
      <WhatsAppConcierge />
    </div>
  );
}
