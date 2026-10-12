import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppConcierge from "@/components/WhatsAppConcierge";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — Aura Fragrances",
  description: "Terms and conditions governing orders, deliveries, and boutique operations at Aura Fragrances.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FBFBF9] text-zinc-900 selection:bg-zinc-950 selection:text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-zinc-100 text-[#8C7355] text-[10px] font-bold tracking-[0.28em] uppercase border border-zinc-200 mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Boutique Protocol
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-light text-zinc-950">
              Terms of Service
            </h1>
            <p className="text-xs text-zinc-500 font-light mt-2">
              Aura Haute Parfumerie • Terms of Order & Engagement
            </p>
          </div>

          <div className="bg-white p-8 sm:p-12 border border-zinc-200 shadow-sm space-y-8 text-zinc-700 text-xs sm:text-sm font-light leading-relaxed">
            <div>
              <h2 className="font-serif text-xl font-bold text-zinc-950 mb-3">1. Ordering & Acceptance</h2>
              <p>
                By placing an order on our online boutique or through our WhatsApp Concierge Desk, you affirm that the contact number and delivery address provided are accurate. All orders undergo phone or WhatsApp automated verification prior to physical parcel dispatch.
              </p>
            </div>

            <div className="pt-6 border-t border-zinc-200">
              <h2 className="font-serif text-xl font-bold text-zinc-950 mb-3">2. Pricing & Currency</h2>
              <p>
                All prices displayed on Aura Fragrances are in Pakistani Rupees (PKR) and include complimentary express nationwide delivery. Prices are subject to periodic review in accordance with raw botanical essence import costs from France and Southeast Asia.
              </p>
            </div>

            <div className="pt-6 border-t border-zinc-200">
              <h2 className="font-serif text-xl font-bold text-zinc-950 mb-3">3. Cash on Delivery (COD) Obligations</h2>
              <p>
                When selecting Cash on Delivery, the client agrees to have the exact cash payment ready upon arrival of the courier representative. Repeated unverified refusal of dispatched parcels without prior notice may result in blacklisting from future COD privileges.
              </p>
            </div>

            <div className="pt-6 border-t border-zinc-200">
              <h2 className="font-serif text-xl font-bold text-zinc-950 mb-3">4. Intellectual Property</h2>
              <p>
                All formulations, flacon vessel designs, photography, and brand editorial literature are protected intellectual property of Aura Fragrances. Unauthorized commercial reproduction or dilution under our trademark is strictly prohibited.
              </p>
            </div>
          </div>

        </div>
      </main>

      <SiteFooter />
      <WhatsAppConcierge />
    </div>
  );
}
