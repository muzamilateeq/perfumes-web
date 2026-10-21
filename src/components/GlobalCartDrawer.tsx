"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  Gift, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Tag, 
  CheckCircle2, 
  ArrowRight,
  MessageCircle,
  Copy,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/StoreContext";
import { validateCouponAction, CouponValidationResult } from "@/app/actions/coupon";
import { createOrderAction } from "@/app/actions/order";
import { buildWhatsAppUrl, generateConfirmedOrderWhatsAppMessage } from "@/lib/whatsapp";

export default function GlobalCartDrawer() {
  const { 
    settings,
    cart, 
    cartCount, 
    cartTotal, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    includeGiftBox,
    setIncludeGiftBox 
  } = useStore();

  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
  const [couponError, setCouponError] = useState("");

  // Checkout Mode Inside Drawer
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Karachi",
    paymentMethod: "COD",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState<{
    orderNumber: string;
    total: number;
    items?: typeof cart;
  } | null>(null);

  // Compute Calculations
  const giftBoxPrice = includeGiftBox ? 500 : 0;
  const subtotalWithGift = cartTotal + giftBoxPrice;
  const discount = appliedCoupon?.discountAmount || 0;
  const isFreeShipping = Boolean(settings?.freeShippingEnabled) || 
    (Boolean(settings?.freeDeliveryThreshold && settings.freeDeliveryThreshold > 0) && subtotalWithGift >= settings.freeDeliveryThreshold);
  const deliveryCharges = cart.length === 0 ? 0 : (isFreeShipping ? 0 : (settings?.deliveryCharges ?? 250));
  const finalTotal = Math.max(0, subtotalWithGift - discount + deliveryCharges);

  // Apply Coupon Handler
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsValidatingCoupon(true);
    setCouponError("");

    try {
      const res = await validateCouponAction(couponInput, subtotalWithGift);
      if (res.valid) {
        setAppliedCoupon(res);
        setCouponError("");
      } else {
        setAppliedCoupon(null);
        setCouponError(res.message);
      }
    } catch {
      setCouponError("Could not validate coupon. Please try again.");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  // Submit Order Handler
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const res = await createOrderAction({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        customerCity: formData.city,
        paymentMethod: formData.paymentMethod,
        couponCode: appliedCoupon?.code,
        discountAmount: discount,
        notes: [
          includeGiftBox ? "Luxury Wax-Sealed Gift Box Requested (+PKR 500)" : "",
          formData.notes
        ].filter(Boolean).join(" | "),
        items: cart.map((it) => ({
          productId: it.product.id,
          name: it.product.name,
          price: it.product.priceNum,
          quantity: it.quantity,
        })),
        shippingFee: deliveryCharges,
        total: finalTotal,
      });

      if (res.success && res.orderNumber) {
        setOrderConfirmed({
          orderNumber: res.orderNumber,
          total: finalTotal,
          items: [...cart],
        });
        clearCart();
      } else {
        setSubmitError(res.message || "Could not place order. Please check details or order directly via WhatsApp.");
      }
    } catch (err: any) {
      console.error("Order submission failed:", err);
      setSubmitError(err?.message || "An unexpected network error occurred. Please contact our WhatsApp concierge.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    closeCart();
    // Reset checkout form if successfully confirmed
    if (orderConfirmed) {
      setTimeout(() => {
        setOrderConfirmed(null);
        setIsCheckingOut(false);
        handleRemoveCoupon();
      }, 300);
    }
  };

  const whatsappUrl = orderConfirmed
    ? buildWhatsAppUrl(
        generateConfirmedOrderWhatsAppMessage(
          orderConfirmed.orderNumber,
          {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            paymentMethod: formData.paymentMethod,
          },
          orderConfirmed.items || [],
          orderConfirmed.total
        )
      )
    : "#";

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="relative w-full max-w-md bg-[#FBFBF9] text-zinc-900 h-full shadow-2xl flex flex-col justify-between border-l border-zinc-200 overflow-hidden z-10"
          >
            {/* Top Bar */}
            <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
                </div>
                <div>
                  <h2 className="font-serif text-lg tracking-[0.16em] uppercase text-zinc-950">
                    Artisanal Bag
                  </h2>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                    {cartCount} {cartCount === 1 ? "Flacon" : "Flacons"} Selected
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-zinc-400 hover:text-zinc-950 rounded-full hover:bg-zinc-100 transition-colors"
                aria-label="Close bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              {/* Order Confirmed Screen */}
              {orderConfirmed ? (
                <div className="py-8 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8C7355]">
                      Maison Aura Parfumerie
                    </span>
                    <h3 className="font-serif text-2xl text-zinc-950">
                      Order Reserved Successfully
                    </h3>
                    <p className="text-xs text-zinc-600 max-w-xs mx-auto pt-1 font-light leading-relaxed">
                      Your artisanal Extrait flacon is being packaged with complimentary 2ml sample vial and personalized wax seal.
                    </p>
                  </div>

                  {/* Order Card */}
                  <div className="p-4 bg-white border border-zinc-200 rounded-xs text-left space-y-2 shadow-xs">
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-100 font-mono">
                      <span className="text-zinc-500">Order Reference:</span>
                      <span className="font-bold text-zinc-950">{orderConfirmed.orderNumber}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-100">
                      <span className="text-zinc-500">Total Amount:</span>
                      <span className="font-bold text-zinc-950">PKR {orderConfirmed.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-zinc-700">
                      <span>Delivery:</span>
                      <span className="font-bold">
                        {deliveryCharges > 0 ? `PKR ${deliveryCharges.toLocaleString()} (COD)` : "Complimentary Express (COD)"}
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Confirmation */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-widest uppercase rounded-xs transition-all shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Confirm Order on WhatsApp</span>
                  </a>

                  <Link
                    href={`/track-order?q=${orderConfirmed.orderNumber}`}
                    onClick={handleClose}
                    className="block text-center text-xs text-zinc-600 hover:text-zinc-950 underline underline-offset-4 tracking-wider uppercase font-medium pt-2"
                  >
                    Track Live Dispatch Status →
                  </Link>
                </div>
              ) : cart.length === 0 ? (
                /* Empty Bag State */
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl text-zinc-900">Your Bag is Empty</h3>
                    <p className="text-xs text-zinc-500 max-w-xs mx-auto font-light">
                      Discover our 100% Extrait de Parfum flacons crafted with 30%+ perfume oil concentration.
                    </p>
                  </div>
                  <Link
                    href="/perfumes"
                    onClick={handleClose}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-colors shadow-xs"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : isCheckingOut ? (
                /* 1-Click Fast Checkout Form */
                <form onSubmit={handleOrderSubmit} className="space-y-4 pt-1">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-900">
                      Express Checkout Details
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="text-xs text-zinc-500 hover:text-zinc-950 underline"
                    >
                      ← Back to Bag
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-zinc-700 text-[10px] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Hamza Tariq"
                        className="w-full px-3 py-2.5 bg-white border border-zinc-300 rounded-xs focus:border-zinc-950 focus:outline-none text-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-zinc-700 text-[10px] mb-1">
                        WhatsApp / Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0300 1234567"
                        className="w-full px-3 py-2.5 bg-white border border-zinc-300 rounded-xs focus:border-zinc-950 focus:outline-none text-zinc-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold uppercase tracking-wider text-zinc-700 text-[10px] mb-1">
                          Destination City *
                        </label>
                        <select
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-3 py-2.5 bg-white border border-zinc-300 rounded-xs focus:border-zinc-950 focus:outline-none text-zinc-900 text-xs"
                        >
                          <option value="Karachi">Karachi (Same/Next Day)</option>
                          <option value="Lahore">Lahore (2-3 Days)</option>
                          <option value="Islamabad">Islamabad (2-3 Days)</option>
                          <option value="Rawalpindi">Rawalpindi (2-3 Days)</option>
                          <option value="Faisalabad">Faisalabad</option>
                          <option value="Multan">Multan</option>
                          <option value="Peshawar">Peshawar</option>
                          <option value="Quetta">Quetta</option>
                          <option value="Sialkot">Sialkot</option>
                          <option value="Other">Other Nationwide</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold uppercase tracking-wider text-zinc-700 text-[10px] mb-1">
                          Payment Option
                        </label>
                        <select
                          value={formData.paymentMethod}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                          className="w-full px-3 py-2.5 bg-white border border-zinc-300 rounded-xs focus:border-zinc-950 focus:outline-none text-zinc-900 text-xs font-bold"
                        >
                          <option value="COD">Cash on Delivery (COD)</option>
                          <option value="BANK">Direct Bank Transfer</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-zinc-700 text-[10px] mb-1">
                        Complete Delivery Address *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="House / Apartment #, Street, Phase, Landmark"
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xs focus:border-zinc-950 focus:outline-none text-zinc-900 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-zinc-700 text-[10px] mb-1">
                        Special Instructions / Card Note (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="e.g. Call before arrival, leave with security"
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xs focus:border-zinc-950 focus:outline-none text-zinc-900"
                      />
                    </div>
                  </div>

                  {/* Summary Inside Checkout */}
                  <div className="p-3 bg-zinc-100/80 rounded-xs space-y-1 text-xs">
                    <div className="flex justify-between text-zinc-600">
                      <span>Subtotal:</span>
                      <span>PKR {subtotalWithGift.toLocaleString()}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Promo Code ({appliedCoupon.code}):</span>
                        <span>-PKR {discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-zinc-600">
                      <span>Delivery / Courier:</span>
                      {deliveryCharges > 0 ? (
                        <span className="font-semibold text-zinc-900">PKR {deliveryCharges.toLocaleString()}</span>
                      ) : (
                        <span className="text-emerald-700 font-bold uppercase text-[10px]">Free</span>
                      )}
                    </div>
                    <div className="flex justify-between text-zinc-950 font-bold text-sm pt-1 border-t border-zinc-200">
                      <span>Total Payable:</span>
                      <span className="text-[#8C7355]">PKR {finalTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xs text-[11px] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Placing Order with Fragrance House...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                        <span>Place Order — PKR {finalTotal.toLocaleString()}</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Normal Cart Items List */
                <>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-3 p-3 bg-white border border-zinc-200/80 rounded-xs shadow-xs relative group"
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-20 bg-zinc-100 rounded-xs overflow-hidden shrink-0 relative flex items-center justify-center">
                          <Image
                            src={item.product.image || item.product.bannerImage || "/banners/oud-royale.png"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="font-serif text-sm font-medium text-zinc-950 leading-tight">
                                {item.product.name}
                              </h4>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
                                title="Remove"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-[10px] text-zinc-500 font-mono block">
                              {item.product.volume || "50ml Extrait"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-zinc-200 rounded-xs bg-zinc-50">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, -1)}
                                className="p-1 hover:bg-zinc-200 transition-colors text-zinc-600"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-mono font-bold text-zinc-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, 1)}
                                className="p-1 hover:bg-zinc-200 transition-colors text-zinc-600"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price */}
                            <span className="text-xs font-bold text-zinc-950">
                              PKR {(item.product.priceNum * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Luxury Wax Seal Gift Box Option */}
                  <div className="p-3 bg-white border border-zinc-200 rounded-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#8C7355]/10 text-[#8C7355] flex items-center justify-center shrink-0">
                        <Gift className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-zinc-900 block leading-tight">
                          Wax-Sealed Gift Coffret Packaging
                        </span>
                        <span className="text-[10px] text-zinc-500 font-light">
                          Hand-poured gold wax seal + calligraphy card (+PKR 500)
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIncludeGiftBox(!includeGiftBox)}
                      className={`px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all rounded-xs ${
                        includeGiftBox
                          ? "bg-zinc-950 text-white"
                          : "border border-zinc-300 text-zinc-700 hover:border-zinc-950"
                      }`}
                    >
                      {includeGiftBox ? "Added" : "+ Add"}
                    </button>
                  </div>

                  {/* PROMO CODE & DISCOUNT COUPONS SECTION */}
                  <div className="p-3.5 bg-white border border-zinc-200 rounded-xs space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-zinc-800">
                      <Tag className="w-3.5 h-3.5 text-[#8C7355]" />
                      <span>Luxury Promo Code</span>
                    </div>

                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-xs">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 font-mono">
                            <span>{appliedCoupon.code}</span>
                            <span className="text-[10px] bg-emerald-200/60 text-emerald-800 px-1.5 py-0.2 rounded-full">
                              {appliedCoupon.discountType === "PERCENT"
                                ? `${appliedCoupon.discountValue}% OFF`
                                : `PKR ${appliedCoupon.discountValue} OFF`}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-700">
                            Saved PKR {discount.toLocaleString()}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-xs text-rose-600 hover:text-rose-800 underline font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="e.g. WELCOME10"
                          className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xs text-xs font-mono uppercase focus:border-zinc-950 focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={isValidatingCoupon || !couponInput.trim()}
                          className="px-4 py-2 bg-zinc-900 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-zinc-800 transition-colors disabled:opacity-40"
                        >
                          {isValidatingCoupon ? "..." : "Apply"}
                        </button>
                      </form>
                    )}

                    {couponError && (
                      <div className="flex items-center gap-1.5 text-[11px] text-rose-600 font-light">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{couponError}</span>
                      </div>
                    )}

                    {/* Quick Hint Pill */}
                    {!appliedCoupon && (
                      <div className="text-[10px] text-zinc-500 font-light flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#8C7355]" />
                        <span>Use code <strong className="font-mono text-zinc-800 font-bold">WELCOME10</strong> for 10% off your initial flacon</span>
                      </div>
                    )}
                  </div>

                  {/* Trust Guarantees */}
                  <div className="p-3 bg-zinc-100/60 rounded-xs space-y-2 text-[11px] text-zinc-600 font-light">
                    <div className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-[#8C7355] shrink-0" />
                      <span>Express Nationwide Courier Delivery (COD)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#8C7355] shrink-0" />
                      <span>Free 2ml sample vial included outside box for skin testing</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Sticky Action Bar */}
            {!orderConfirmed && cart.length > 0 && !isCheckingOut && (
              <div className="p-4 sm:p-5 border-t border-zinc-200 bg-white space-y-3 shrink-0">
                {/* Cost Breakdown */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal:</span>
                    <span>PKR {subtotalWithGift.toLocaleString()}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Promo Discount ({appliedCoupon.code}):</span>
                      <span>-PKR {discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-600">
                    <span>Delivery / Shipping:</span>
                    {deliveryCharges > 0 ? (
                      <span className="font-semibold text-zinc-900">
                        PKR {deliveryCharges.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold uppercase text-[10px]">
                        Free
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between text-zinc-950 font-bold text-sm pt-2 border-t border-zinc-100">
                    <span>Estimated Total:</span>
                    <span className="text-[#8C7355] text-base font-serif">
                      PKR {finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-md flex items-center justify-center gap-2 group"
                >
                  <span>Proceed to Express Checkout</span>
                  <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
