"use client";

import { useState } from "react";
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  ShoppingBag, 
  Clock, 
  Search, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  WHATSAPP_CONFIG, 
  buildWhatsAppUrl, 
  generateCartWhatsAppMessage, 
  generateConsultationWhatsAppMessage,
  generateOrderTrackingWhatsAppMessage,
  type CartItemLike 
} from "@/lib/whatsapp";

interface WhatsAppConciergeProps {
  cart?: CartItemLike[];
  totalCartAmount?: number;
}

export default function WhatsAppConcierge({ 
  cart = [], 
  totalCartAmount = 0 
}: WhatsAppConciergeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [showTrackingInput, setShowTrackingInput] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) return;
    const url = buildWhatsAppUrl(customMessage);
    window.open(url, "_blank");
    setCustomMessage("");
    setIsOpen(false);
  };

  const handleOrderCartOnWhatsApp = () => {
    if (cart.length === 0) return;
    const msg = generateCartWhatsAppMessage(cart, totalCartAmount);
    window.open(buildWhatsAppUrl(msg), "_blank");
    setIsOpen(false);
  };

  const handleConsultation = (topic: string) => {
    const msg = generateConsultationWhatsAppMessage(topic);
    window.open(buildWhatsAppUrl(msg), "_blank");
    setIsOpen(false);
  };

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    const msg = generateOrderTrackingWhatsAppMessage(trackingId);
    window.open(buildWhatsAppUrl(msg), "_blank");
    setTrackingId("");
    setShowTrackingInput(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-emerald-700 hover:bg-emerald-600 text-white p-3 sm:p-4 rounded-full shadow-2xl flex items-center gap-2.5 transition-all border border-emerald-500/40"
          aria-label="Open WhatsApp Concierge"
        >
          {/* Pulsing Online Indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-zinc-950"></span>
          </span>

          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-xs font-bold tracking-widest uppercase hidden sm:inline-block pr-1">
            WhatsApp Concierge
          </span>
        </motion.button>
      </div>

      {/* Concierge Popover Dialog */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for Mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 sm:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed bottom-0 sm:bottom-24 inset-x-0 sm:inset-x-auto sm:right-6 z-50 w-full sm:w-[410px] max-h-[85vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden text-zinc-900"
            >
              {/* Header */}
              <div className="bg-zinc-950 text-white p-4 sm:p-5 relative">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center text-white font-serif text-lg font-bold shadow-md">
                      A
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-base font-medium tracking-wide">
                          Aura Concierge Desk
                        </h4>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      </div>
                      <p className="text-[11px] text-zinc-400 flex items-center gap-1.5 font-light">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        Online Now • Avg response: 2-5 mins
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-zinc-300 font-light mt-2 leading-relaxed">
                  Welcome to Aura Haute Parfumerie. How may our fragrance advisors assist you today?
                </p>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 max-h-[62vh] overflow-y-auto space-y-3.5 bg-[#FAF9F7]">

                {/* Dynamic Cart Quick Order Card */}
                {totalItems > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-emerald-950 text-white rounded-xl border border-emerald-700/50 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold tracking-wider uppercase text-emerald-300">
                          Ready to Checkout ({totalItems} {totalItems === 1 ? "item" : "items"})
                        </span>
                      </div>
                      <span className="text-xs font-bold font-serif text-emerald-100">
                        PKR {totalCartAmount.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300 font-light mb-3">
                      Order your bag items directly via WhatsApp with free express Cash on Delivery.
                    </p>
                    <button
                      onClick={handleOrderCartOnWhatsApp}
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Send Order on WhatsApp
                    </button>
                  </motion.div>
                )}

                {/* Pre-formatted Quick Action Buttons */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">
                    Quick Inquiries
                  </p>

                  <button
                    onClick={() => handleConsultation("Scent Recommendation for Evenings & Weddings")}
                    className="w-full p-3 bg-white hover:bg-zinc-50 rounded-xl border border-zinc-200 text-left transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-zinc-900">Need Scent Recommendation</p>
                        <p className="text-[10px] text-zinc-500 font-light">Find your signature perfume match</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleConsultation("Aura Discovery Coffret Set (6x5ml)")}
                    className="w-full p-3 bg-white hover:bg-zinc-50 rounded-xl border border-zinc-200 text-left transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-zinc-700 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-zinc-900">Order Discovery Coffret (PKR 4,500)</p>
                        <p className="text-[10px] text-zinc-500 font-light">Sample all 6 perfumes with redeemable voucher</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setShowTrackingInput(!showTrackingInput)}
                    className="w-full p-3 bg-white hover:bg-zinc-50 rounded-xl border border-zinc-200 text-left transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Search className="w-4 h-4 text-zinc-700 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-zinc-900">Track My Existing Order</p>
                        <p className="text-[10px] text-zinc-500 font-light">Courier dispatch updates via WhatsApp</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-zinc-400 transition-transform ${showTrackingInput ? "rotate-90" : "group-hover:translate-x-1"}`} />
                  </button>

                  {/* Expandable Tracking Input */}
                  {showTrackingInput && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      onSubmit={handleTrackOrder}
                      className="p-3 bg-white rounded-xl border border-zinc-200 flex gap-2"
                    >
                      <input
                        type="text"
                        required
                        placeholder="Enter Order # (e.g. AUR-829104)..."
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        className="flex-1 text-base sm:text-xs px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg focus:border-zinc-950 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-zinc-950 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors"
                      >
                        Track
                      </button>
                    </motion.form>
                  )}
                </div>

                {/* Custom Message Field */}
                <div className="pt-2">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-2">
                    Send Direct Message
                  </p>
                  <form onSubmit={handleSendCustom} className="relative">
                    <input
                      type="text"
                      placeholder="Type your question..."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="w-full text-base sm:text-xs pl-3.5 pr-10 py-3 bg-white border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none shadow-2xs"
                    />
                    <button
                      type="submit"
                      disabled={!customMessage.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-lg transition-colors"
                      title="Send message on WhatsApp"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

              </div>

              {/* Footer Trust strip */}
              <div className="p-3 bg-white border-t border-zinc-200 text-center">
                <p className="text-[10px] text-zinc-500 font-medium">
                  Official WhatsApp: <span className="font-semibold text-zinc-900">{WHATSAPP_CONFIG.displayNumber}</span> • {WHATSAPP_CONFIG.workingHours}
                </p>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
