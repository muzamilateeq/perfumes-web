"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Heart, 
  X, 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Droplets,
  Truck
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function WishlistDrawer() {
  const {
    wishlistItems,
    wishlistCount,
    isWishlistOpen,
    closeWishlist,
    toggleWishlist,
    clearWishlist,
    addToCart,
    openCart
  } = useStore();

  const handleMoveAllToBag = () => {
    wishlistItems.forEach((item) => {
      addToCart(item);
    });
    closeWishlist();
    openCart();
  };

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWishlist}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 w-full sm:max-w-md h-full bg-white z-50 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-zinc-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-light text-zinc-950">
                    Your Curated Wishlist
                  </h3>
                  <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-400 block -mt-0.5">
                    {wishlistCount} {wishlistCount === 1 ? "Creation" : "Creations"} Saved
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={closeWishlist}
                className="p-1.5 sm:p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-600"
                aria-label="Close Wishlist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Delivery / Tester Banner */}
            <div className="px-4 sm:px-6 py-2.5 bg-[#FAF7F2] border-b border-[#EBE4D8] flex items-center gap-2 text-xs font-semibold text-[#7A6448]">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span>Complimentary Tester Vial with every saved 50ml flacon!</span>
            </div>

            {/* Wishlist Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {wishlistItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                  <div className="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-zinc-300" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-serif text-lg font-light text-zinc-950 mb-1">
                    Your wishlist is empty
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-xs mb-6 font-light leading-relaxed">
                    Tap the heart icon on any signature flacon to save your favorites for easy comparison or checkout.
                  </p>
                  <Link
                    href="/perfumes"
                    onClick={closeWishlist}
                    className="px-6 py-2.5 bg-zinc-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-colors shadow-sm"
                  >
                    Explore Signature Flacons
                  </Link>
                </div>
              ) : (
                wishlistItems.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-3.5 p-3 sm:p-4 bg-zinc-50/70 border border-zinc-200/90 rounded-xs hover:border-zinc-900 transition-all group relative"
                  >
                    {/* Flacon Image */}
                    <Link
                      href={`/perfumes/${product.slug}`}
                      onClick={closeWishlist}
                      className="w-20 h-24 sm:w-24 sm:h-28 bg-zinc-100 shrink-0 border border-zinc-200 overflow-hidden block"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[9px] font-bold tracking-widest uppercase text-[#8C7355] block truncate">
                            {product.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product.id)}
                            className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <Link
                          href={`/perfumes/${product.slug}`}
                          onClick={closeWishlist}
                          className="font-serif text-sm sm:text-base font-medium text-zinc-950 hover:text-[#8C7355] transition-colors block truncate"
                        >
                          {product.name}
                        </Link>

                        <p className="text-[10px] text-zinc-500 font-light truncate mt-0.5">
                          {product.notes}
                        </p>
                      </div>

                      {/* Price & Move To Cart */}
                      <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between gap-2">
                        <div>
                          <span className="font-serif text-xs sm:text-sm font-semibold text-zinc-950">
                            {product.price}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            addToCart(product);
                            toggleWishlist(product.id);
                          }}
                          className="px-3 py-1.5 bg-zinc-950 text-white text-[10px] font-bold tracking-wider uppercase hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shrink-0"
                        >
                          <ShoppingBag className="w-3 h-3" /> Add To Bag
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with Move All & Clear */}
            {wishlistItems.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-zinc-200 bg-white space-y-3">
                <button
                  type="button"
                  onClick={handleMoveAllToBag}
                  className="w-full py-3.5 bg-zinc-950 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Move All to Bag & Checkout
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={clearWishlist}
                    className="text-[11px] text-zinc-400 hover:text-zinc-950 uppercase tracking-wider font-semibold transition-colors"
                  >
                    Clear All
                  </button>
                  <Link
                    href="/perfumes"
                    onClick={closeWishlist}
                    className="text-[11px] text-[#8C7355] hover:text-zinc-950 uppercase tracking-wider font-semibold transition-colors flex items-center gap-1"
                  >
                    Continue Browsing <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
