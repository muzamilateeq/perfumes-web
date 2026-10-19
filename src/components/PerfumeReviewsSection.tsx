"use client";

import { useState, useEffect } from "react";
import { 
  Star, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Check, 
  Plus, 
  X, 
  MessageSquare,
  ThumbsUp,
  MapPin,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StoreReview } from "@/lib/storeTypes";
import { getProductReviewsAction, submitReviewAction, ProductReviewsSummary } from "@/app/actions/review";

interface PerfumeReviewsSectionProps {
  productId: string | number;
  productName: string;
}

export default function PerfumeReviewsSection({ productId, productName }: PerfumeReviewsSectionProps) {
  const [summary, setSummary] = useState<ProductReviewsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    customerName: "",
    customerCity: "",
    rating: 5,
    longevity: "18+ Hours",
    sillage: "Commanding & Royal",
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Load Reviews
  const loadReviews = async () => {
    try {
      const res = await getProductReviewsAction(productId);
      setSummary(res);
    } catch (e) {
      console.error("Failed to load reviews:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.comment) return;

    setSubmitting(true);
    try {
      const res = await submitReviewAction({
        productId,
        ...formData,
      });

      if (res.success) {
        setFormSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setFormSuccess(false);
          setFormData({
            customerName: "",
            customerCity: "",
            rating: 5,
            longevity: "18+ Hours",
            sillage: "Commanding & Royal",
            comment: "",
          });
          loadReviews();
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const reviews = summary?.reviews || [];
  const averageRating = summary?.averageRating || 5.0;
  const totalReviews = summary?.totalReviews || reviews.length;

  return (
    <section className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-zinc-200">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#8C7355] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Collector Feedback & Testing</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-zinc-950">
            Verified Impressions of {productName}
          </h2>
          <p className="text-xs text-zinc-500 max-w-xl font-light pt-1">
            Authentic longevity and sillage reports submitted by verified patrons across Pakistan.
          </p>
        </div>

        {/* Big Rating Pill & Action */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xs text-center min-w-[120px]">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-serif text-2xl font-bold text-zinc-950 block leading-none">
              {averageRating} <span className="text-xs text-zinc-400 font-sans font-normal">/ 5.0</span>
            </span>
            <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500">
              {totalReviews} Verified {totalReviews === 1 ? "Collector" : "Collectors"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3.5 bg-zinc-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* Luxury Performance Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8 p-5 bg-[#FAF7F2] border border-[#EBE4D8] rounded-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-[#8C7355]" />
            <span>Longevity Rating</span>
          </div>
          <span className="font-serif text-lg font-bold text-zinc-950 block">
            18–20+ Hours on Clothes
          </span>
          <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-[#8C7355] h-full w-[94%]" />
          </div>
          <span className="text-[10px] text-zinc-500 block pt-0.5 font-light">
            94% of patrons report staying power into the next day
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#8C7355]" />
            <span>Sillage & Scent Bubble</span>
          </div>
          <span className="font-serif text-lg font-bold text-zinc-950 block">
            Commanding & Royal
          </span>
          <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-[#8C7355] h-full w-[90%]" />
          </div>
          <span className="text-[10px] text-zinc-500 block pt-0.5 font-light">
            Noticeable scent trail without being synthetic or suffocating
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8C7355]" />
            <span>Oil Concentration</span>
          </div>
          <span className="font-serif text-lg font-bold text-zinc-950 block">
            100% Extrait de Parfum
          </span>
          <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-[#8C7355] h-full w-[98%]" />
          </div>
          <span className="text-[10px] text-zinc-500 block pt-0.5 font-light">
            30%+ pure perfume oil matured in chilled stainless steel
          </span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 && !loading ? (
          <div className="py-12 text-center text-zinc-400 text-xs">
            No public reviews yet. Be the first connoisseur to review {productName}!
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 sm:p-6 bg-white border border-zinc-200 rounded-xs space-y-3 shadow-xs hover:border-zinc-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-serif text-base font-bold text-zinc-950">
                    {rev.customerName}
                  </span>
                  {rev.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <Check className="w-2.5 h-2.5" /> Verified Collector
                    </span>
                  )}
                  {rev.customerCity && (
                    <span className="text-[10px] text-zinc-400 font-light flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" /> {rev.customerCity}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {new Date(rev.createdAt).toLocaleDateString("en-PK", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Longevity & Sillage Tags */}
              <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                {rev.longevity && (
                  <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-xs border border-zinc-200">
                    ⏱️ Longevity: <strong className="text-zinc-950">{rev.longevity}</strong>
                  </span>
                )}
                {rev.sillage && (
                  <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-xs border border-zinc-200">
                    👑 Sillage: <strong className="text-zinc-950">{rev.sillage}</strong>
                  </span>
                )}
              </div>

              {/* Review Comment */}
              <p className="text-xs text-zinc-700 font-light leading-relaxed">
                “{rev.comment}”
              </p>
            </div>
          ))
        )}
      </div>

      {/* Leave a Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white border border-zinc-200 p-6 sm:p-8 shadow-2xl z-10 rounded-xs space-y-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8C7355] block">
                    Verified Collector Feedback
                  </span>
                  <h3 className="font-serif text-2xl text-zinc-950">
                    Review {productName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-950 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl text-zinc-950">
                    Review Submitted Successfully
                  </h4>
                  <p className="text-xs text-zinc-500 font-light">
                    Thank you for sharing your olfactory journey with the community.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                      Your Rating *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className={`p-2 rounded-xs border text-xs flex items-center gap-1 transition-all ${
                            formData.rating >= star
                              ? "border-amber-400 bg-amber-50 text-amber-900"
                              : "border-zinc-200 text-zinc-400 hover:border-zinc-300"
                          }`}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              formData.rating >= star
                                ? "fill-amber-400 text-amber-400"
                                : "text-zinc-300"
                            }`}
                          />
                          <span>{star}★</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({ ...formData, customerName: e.target.value })
                        }
                        placeholder="e.g. Hamza Tariq"
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xs focus:border-zinc-950 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                        City / Location (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.customerCity}
                        onChange={(e) =>
                          setFormData({ ...formData, customerCity: e.target.value })
                        }
                        placeholder="e.g. DHA Karachi"
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xs focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                        Longevity Tested
                      </label>
                      <select
                        value={formData.longevity}
                        onChange={(e) =>
                          setFormData({ ...formData, longevity: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xs focus:border-zinc-950 focus:outline-none text-xs"
                      >
                        <option value="20+ Hours">20+ Hours (Super Beast)</option>
                        <option value="18+ Hours">18+ Hours (All Day)</option>
                        <option value="16+ Hours">16+ Hours (Very Strong)</option>
                        <option value="12–14 Hours">12–14 Hours (Strong)</option>
                        <option value="8–10 Hours">8–10 Hours (Moderate)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                        Sillage & Projection
                      </label>
                      <select
                        value={formData.sillage}
                        onChange={(e) =>
                          setFormData({ ...formData, sillage: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xs focus:border-zinc-950 focus:outline-none text-xs"
                      >
                        <option value="Commanding & Royal">Commanding & Royal</option>
                        <option value="Room-Filling & Heavy">Room-Filling & Heavy</option>
                        <option value="Moderate & Radiant">Moderate & Radiant</option>
                        <option value="Intimate & Close">Intimate & Close</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                      Your Scent Impressions & Performance *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                      placeholder="How did the fragrance evolve on your skin? How were the compliments and longevity?"
                      className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xs focus:border-zinc-950 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-md disabled:opacity-50"
                  >
                    {submitting ? "Publishing Review..." : "Publish Olfactory Review"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
