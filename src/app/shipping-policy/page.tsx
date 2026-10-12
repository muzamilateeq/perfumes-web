import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppConcierge from "@/components/WhatsAppConcierge";
import { Truck, ShieldCheck, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { WHATSAPP_CONFIG } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy — Aura Fragrances",
  description: "Complimentary nationwide express delivery policy. Learn about Cash on Delivery (COD) coverage, delivery timelines, and transit care across Pakistan.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FBFBF9] text-zinc-900 selection:bg-zinc-950 selection:text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-zinc-100 text-[#8C7355] text-[10px] font-bold tracking-[0.28em] uppercase border border-zinc-200 mb-4">
              <Truck className="w-3.5 h-3.5" /> Nationwide Logistics
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-light text-zinc-950">
              Shipping & Delivery Policy
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 font-light mt-3 max-w-lg mx-auto">
              Every Aura flacon is packaged with the highest standard of temperature-controlled care and dispatched via tracked courier express across Pakistan.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-12 border border-zinc-200 shadow-sm space-y-10 sm:space-y-12 text-zinc-700 text-xs sm:text-sm font-light leading-relaxed">
            
            {/* Section 1 */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E9E2D8] flex items-center justify-center font-mono text-xs font-bold text-[#8C7355]">
                  01
                </span>
                <h2 className="font-serif text-2xl font-normal text-zinc-950">
                  Complimentary Express Shipping
                </h2>
              </div>
              <p className="mb-4">
                We provide <strong>100% complimentary express shipping</strong> on all orders of 50ml Extrait de Parfum flacons and Discovery Coffrets nationwide across Pakistan. There are zero hidden courier surcharges or packaging handling fees.
              </p>
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm">
                <span className="font-semibold text-zinc-900 block text-xs uppercase tracking-wider mb-1">Standard Rates:</span>
                <ul className="space-y-1 text-xs text-zinc-600">
                  <li>• Orders containing 50ml Flacons or Discovery Coffrets: <strong>FREE (PKR 0)</strong></li>
                  <li>• Nationwide delivery covers Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Sialkot, and all regional courier service areas.</li>
                </ul>
              </div>
            </div>

            {/* Section 2 */}
            <div className="pt-8 border-t border-zinc-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E9E2D8] flex items-center justify-center font-mono text-xs font-bold text-[#8C7355]">
                  02
                </span>
                <h2 className="font-serif text-2xl font-normal text-zinc-950">
                  Estimated Delivery Timelines
                </h2>
              </div>
              <p className="mb-6">
                All orders confirmed by 4:00 PM PKT (Monday through Saturday) are prepared and dispatched from our Karachi hub on the same business day.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div className="p-5 border border-zinc-200 bg-[#FAF9F7]">
                  <span className="font-serif text-2xl text-zinc-950 font-light block mb-1">24 - 48 Hours</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 block">Karachi Hub</span>
                  <p className="text-[11px] text-zinc-500 mt-2">Next-day local doorstep delivery</p>
                </div>
                <div className="p-5 border border-zinc-200 bg-[#FAF9F7]">
                  <span className="font-serif text-2xl text-zinc-950 font-light block mb-1">2 - 3 Days</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 block">Lahore & Islamabad</span>
                  <p className="text-[11px] text-zinc-500 mt-2">Express air cargo transit</p>
                </div>
                <div className="p-5 border border-zinc-200 bg-[#FAF9F7]">
                  <span className="font-serif text-2xl text-zinc-950 font-light block mb-1">3 - 4 Days</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 block">All Other Cities</span>
                  <p className="text-[11px] text-zinc-500 mt-2">Nationwide courier network</p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="pt-8 border-t border-zinc-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E9E2D8] flex items-center justify-center font-mono text-xs font-bold text-[#8C7355]">
                  03
                </span>
                <h2 className="font-serif text-2xl font-normal text-zinc-950">
                  Cash on Delivery (COD) Inspection
                </h2>
              </div>
              <p className="mb-3">
                Cash on Delivery (COD) is available nationwide. The courier rider will deliver your sealed parcel to your doorstep and collect the exact amount in cash.
              </p>
              <p>
                <strong>Packaging Security:</strong> Every flacon is shipped in a shock-absorbing bespoke box with tamper-evident holograms and enclosed with your complimentary matching 2ml trial vial.
              </p>
            </div>

            {/* Section 4 */}
            <div className="pt-8 border-t border-zinc-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E9E2D8] flex items-center justify-center font-mono text-xs font-bold text-[#8C7355]">
                  04
                </span>
                <h2 className="font-serif text-2xl font-normal text-zinc-950">
                  Live Dispatch Tracking
                </h2>
              </div>
              <p className="mb-4">
                Once your parcel is handed over to our courier partners (TCS, Trax Express, or Leopards), an SMS notification containing your consignment tracking number will be dispatched to your mobile number.
              </p>
              <Link
                href="/track-order"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-colors"
              >
                Go to Live Order Tracking <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </main>

      <SiteFooter />
      <WhatsAppConcierge />
    </div>
  );
}
