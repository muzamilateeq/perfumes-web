import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppConcierge from "@/components/WhatsAppConcierge";
import { RotateCcw, ShieldCheck, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import { buildWhatsAppUrl, WHATSAPP_CONFIG } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Trial Vial Guarantee & Returns Policy — Aura Fragrances",
  description: "Learn about our revolutionary risk-free perfume trial guarantee. Test the complimentary 2ml vial first before unsealing your 50ml flacon.",
};

export default function RefundPolicyPage() {
  const returnWhatsappUrl = buildWhatsAppUrl(
    "Salam Aura Concierge! I would like assistance with an exchange or return inquiry for my flacon."
  );

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-zinc-900 selection:bg-zinc-950 selection:text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-zinc-100 text-[#8C7355] text-[10px] font-bold tracking-[0.28em] uppercase border border-zinc-200 mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Risk-Free Guarantee
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-light text-zinc-950">
              The Trial Vial Guarantee & Returns
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 font-light mt-3 max-w-lg mx-auto">
              We believe you should never have to gamble on a high-concentration Extrait de Parfum.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-12 border border-zinc-200 shadow-sm space-y-12 text-zinc-700 text-xs sm:text-sm font-light leading-relaxed">
            
            {/* The Trial Vial Guarantee */}
            <div className="p-6 bg-[#FAF7F2] border border-[#E9E2D8]">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-[#8C7355]" />
                <h2 className="font-serif text-2xl font-normal text-zinc-950">
                  The Complimentary Matching Trial Vial
                </h2>
              </div>
              <p className="text-zinc-700 mb-4">
                Every full 50ml Extrait de Parfum flacon arrives with a <strong>free, matching 2ml trial spray vial</strong> placed outside the sealed presentation coffret.
              </p>
              <div className="space-y-2 text-xs text-zinc-600">
                <p>1. Open your delivery parcel and test the <strong>2ml trial vial</strong> on your skin first.</p>
                <p>2. Allow the fragrance to evolve over 6 to 12 hours to observe how the heart and base notes settle on your personal chemistry.</p>
                <p>3. If you love it, break the seal on your 50ml flacon and enjoy your signature scent.</p>
                <p>4. If the scent does not perfectly match your preference, <strong>do not break the seal on the 50ml bottle</strong>. Contact us within 7 days for an instant exchange or 100% refund!</p>
              </div>
            </div>

            {/* Conditions for Returns */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E9E2D8] flex items-center justify-center font-mono text-xs font-bold text-[#8C7355]">
                  01
                </span>
                <h3 className="font-serif text-2xl font-normal text-zinc-950">
                  Return & Exchange Eligibility
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-600 pl-4 list-disc">
                <li>Returns must be requested within <strong>7 days</strong> of delivery receipt.</li>
                <li>The main 50ml heavy crystal flacon must be <strong>unopened, sealed with original holographic tamper tape intact</strong>, and in its original black presentation coffret.</li>
                <li>You may keep and enjoy the complimentary 2ml trial vial—it is yours with our compliments regardless.</li>
                <li>Discovery Coffrets (6 x 5ml) come with a 100% redeemable PKR 4,500 voucher toward any 50ml flacon and are non-refundable once opened.</li>
              </ul>
            </div>

            {/* How to Initiate */}
            <div className="pt-8 border-t border-zinc-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E9E2D8] flex items-center justify-center font-mono text-xs font-bold text-[#8C7355]">
                  02
                </span>
                <h3 className="font-serif text-2xl font-normal text-zinc-950">
                  How to Initiate a Return or Exchange
                </h3>
              </div>
              <p className="mb-4">
                We make the return process frictionless without requiring complex paperwork.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 text-center mb-6">
                <div className="p-4 border border-zinc-200 bg-[#FAF9F7]">
                  <span className="font-mono text-xs font-bold text-zinc-400 block mb-1">STEP 1</span>
                  <p className="text-xs font-semibold text-zinc-900">Message on WhatsApp</p>
                  <p className="text-[11px] text-zinc-500 mt-1">Send your order # to {WHATSAPP_CONFIG.displayNumber}</p>
                </div>
                <div className="p-4 border border-zinc-200 bg-[#FAF9F7]">
                  <span className="font-mono text-xs font-bold text-zinc-400 block mb-1">STEP 2</span>
                  <p className="text-xs font-semibold text-zinc-900">Courier Pickup</p>
                  <p className="text-[11px] text-zinc-500 mt-1">Our courier collects the sealed box from your doorstep</p>
                </div>
                <div className="p-4 border border-zinc-200 bg-[#FAF9F7]">
                  <span className="font-mono text-xs font-bold text-zinc-400 block mb-1">STEP 3</span>
                  <p className="text-xs font-semibold text-zinc-900">Instant Refund</p>
                  <p className="text-[11px] text-zinc-500 mt-1">Full refund transferred via Bank / Raast / EasyPaisa</p>
                </div>
              </div>

              <a
                href={returnWhatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-700 text-white text-xs font-bold tracking-widest uppercase hover:bg-emerald-600 transition-colors shadow-md"
              >
                <MessageCircle className="w-4 h-4" /> Initiate Return on WhatsApp
              </a>
            </div>

            {/* Damaged in Transit Guarantee */}
            <div className="pt-8 border-t border-zinc-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E9E2D8] flex items-center justify-center font-mono text-xs font-bold text-[#8C7355]">
                  03
                </span>
                <h3 className="font-serif text-2xl font-normal text-zinc-950">
                  Damaged in Transit Guarantee
                </h3>
              </div>
              <p>
                In the rare event that your flacon is damaged or leaks during courier handling, simply take a quick photo of the parcel and message our WhatsApp concierge. We dispatch an immediate <strong>100% free brand-new replacement flacon</strong> without delay.
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
