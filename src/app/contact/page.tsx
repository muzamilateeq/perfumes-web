"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppConcierge from "@/components/WhatsAppConcierge";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles, 
  Check, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { buildWhatsAppUrl, WHATSAPP_CONFIG } from "@/lib/whatsapp";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject: "Personal Scent Consultation",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMsg = 
      `🕊️ *CONCIERGE DESK INQUIRY*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Name:* ${formData.name}\n` +
      `📱 *Contact:* ${formData.phone}\n` +
      `📋 *Topic:* ${formData.subject}\n` +
      `💬 *Inquiry:* ${formData.message}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Salam! I would like assistance with this inquiry.`;

    window.open(buildWhatsAppUrl(whatsappMsg), "_blank");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-zinc-900 selection:bg-zinc-950 selection:text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 text-[#8C7355] text-[10px] font-bold tracking-[0.28em] uppercase border border-zinc-200 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Client Services & Scent Advisory
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-light text-zinc-950">
              The Aura Concierge
            </h1>
            <p className="text-zinc-600 font-light text-xs sm:text-sm mt-4 leading-relaxed">
              Whether you desire a personalized olfactory consultation, wish to arrange corporate wedding gifting, or require order assistance, our fragrance advisors are at your service.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Contact Cards */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* WhatsApp Card */}
              <div className="p-8 bg-emerald-950 text-white rounded-xs border border-emerald-800 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-light text-white">Instant WhatsApp Concierge</h3>
                    <span className="text-[10px] text-emerald-300 font-mono">Response within 5 minutes</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 font-light leading-relaxed mb-6">
                  Chat live with our certified master fragrance advisors. Ideal for rapid recommendations, tracking updates, and doorstep Cash on Delivery orders.
                </p>
                <a
                  href={buildWhatsAppUrl("Salam Aura Concierge! I would like to connect with an advisor.")}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xs text-xs font-bold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Message {WHATSAPP_CONFIG.displayNumber}
                </a>
              </div>

              {/* Service Info */}
              <div className="p-8 bg-white border border-zinc-200 shadow-xs space-y-6">
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-[#8C7355] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold tracking-widest uppercase text-zinc-900">Operating Hours</h4>
                    <p className="text-xs text-zinc-500 mt-1">{WHATSAPP_CONFIG.workingHours}</p>
                    <p className="text-[11px] text-zinc-400">Monday through Sunday (7 Days a Week)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-6 border-t border-zinc-100">
                  <MapPin className="w-5 h-5 text-[#8C7355] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold tracking-widest uppercase text-zinc-900">Karachi Atelier & Distribution</h4>
                    <p className="text-xs text-zinc-500 mt-1">D.H.A. Phase 6, Karachi, Pakistan</p>
                    <p className="text-[11px] text-zinc-400">Private tasting salon appointments by reservation</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-6 border-t border-zinc-100">
                  <Mail className="w-5 h-5 text-[#8C7355] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold tracking-widest uppercase text-zinc-900">Client Inquiries</h4>
                    <p className="text-xs text-zinc-500 mt-1">concierge@aurafragrances.pk</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Consultation Form */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-12 border border-zinc-200 shadow-sm">
              <span className="text-[10px] font-bold tracking-[0.28em] uppercase text-[#8C7355] block mb-2">
                Send a Message
              </span>
              <h2 className="font-serif text-3xl font-light text-zinc-950 mb-6">
                Consult With Our Scent Specialist
              </h2>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-200">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-emerald-950 mb-1">Inquiry Dispatched</h4>
                  <p className="text-xs text-zinc-600 mb-4">
                    Your inquiry has been opened with our WhatsApp concierge team. We are connecting with you momentarily!
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold tracking-wider uppercase underline text-zinc-900"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Farhan Zaidi"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF9F7] border border-zinc-300 text-xs focus:border-zinc-950 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                        WhatsApp Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0309 8541632"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF9F7] border border-zinc-300 text-xs focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      Subject / Purpose *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF9F7] border border-zinc-300 text-xs focus:border-zinc-950 focus:outline-none"
                    >
                      <option>Personal Scent Recommendation</option>
                      <option>Discovery Coffret Order Assistance</option>
                      <option>Wedding & Event Gifting Inquiries (Bulk)</option>
                      <option>Order Dispatch & Delivery Query</option>
                      <option>Private Atelier Tasting Appointment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-600 mb-1.5">
                      How Can We Help You? *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell us about the scent profiles you prefer (e.g. Woody, Rose, Fresh Citrus) or any special questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF9F7] border border-zinc-300 text-xs focus:border-zinc-950 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-zinc-950 text-white text-xs font-bold tracking-[0.25em] uppercase hover:bg-zinc-800 transition-colors shadow-xl flex items-center justify-center gap-3"
                  >
                    <span>Connect via WhatsApp Concierge</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-zinc-400 text-center tracking-wider">
                    🔒 Messages are encrypted & answered directly by senior fragrance advisors.
                  </p>
                </form>
              )}

            </div>

          </div>

        </div>
      </main>

      <SiteFooter />
      <WhatsAppConcierge />
    </div>
  );
}
