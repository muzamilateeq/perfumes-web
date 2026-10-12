import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppConcierge from "@/components/WhatsAppConcierge";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Aura Fragrances",
  description: "Read our privacy policy regarding data collection, order processing, and customer privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FBFBF9] text-zinc-900 selection:bg-zinc-950 selection:text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-zinc-100 text-[#8C7355] text-[10px] font-bold tracking-[0.28em] uppercase border border-zinc-200 mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Client Data Protection
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-light text-zinc-950">
              Privacy Policy
            </h1>
            <p className="text-xs text-zinc-500 font-light mt-2">
              Last updated: January 2026 • Aura Haute Parfumerie
            </p>
          </div>

          <div className="bg-white p-8 sm:p-12 border border-zinc-200 shadow-sm space-y-8 text-zinc-700 text-xs sm:text-sm font-light leading-relaxed">
            <div>
              <h2 className="font-serif text-xl font-bold text-zinc-950 mb-3">1. Information We Collect</h2>
              <p>
                When you place an order on Aura Fragrances, we collect necessary shipping and contact details including your full name, mobile / WhatsApp contact number, destination delivery address, and city in Pakistan. We do not sell, rent, or lease client data to third-party telemarketers under any circumstances.
              </p>
            </div>

            <div className="pt-6 border-t border-zinc-200">
              <h2 className="font-serif text-xl font-bold text-zinc-950 mb-3">2. How Your Information Is Used</h2>
              <p>
                Your information is used exclusively to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-zinc-600 mt-2">
                <li>Process, prepare, and dispatch your ordered Extrait de Parfum flacons.</li>
                <li>Coordinate with courier riders for Cash on Delivery (COD) doorstep delivery.</li>
                <li>Send automated SMS notifications containing courier tracking numbers.</li>
                <li>Provide direct concierge advisory via WhatsApp if requested by you.</li>
              </ul>
            </div>

            <div className="pt-6 border-t border-zinc-200">
              <h2 className="font-serif text-xl font-bold text-zinc-950 mb-3">3. Payment & Security</h2>
              <p>
                We prioritize Cash on Delivery (COD), meaning your sensitive financial details (such as credit card numbers or banking passwords) are never required or stored on our servers. For bank transfer orders, proof of payment is verified over secure encrypted WhatsApp protocols.
              </p>
            </div>

            <div className="pt-6 border-t border-zinc-200">
              <h2 className="font-serif text-xl font-bold text-zinc-950 mb-3">4. Client Rights & Data Removal</h2>
              <p>
                You may request complete removal of your contact information from our dispatch records at any time by messaging our concierge team at <strong>+92 309 8541632</strong>.
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
