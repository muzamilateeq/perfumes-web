"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  Heart, 
  ShoppingBag, 
  Eye, 
  ArrowRight, 
  Check, 
  Clock, 
  Droplets, 
  X, 
  Plus, 
  Minus,
  MessageCircle,
  Truck,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppConcierge from "@/components/WhatsAppConcierge";
import { PerfumeItem, DISCOVERY_SET_ITEM } from "@/lib/perfumes";
import { useStore } from "@/context/StoreContext";

interface PerfumesCatalogClientProps {
  initialProducts: PerfumeItem[];
}

const SCENT_FAMILIES = [
  "All Fragrances",
  "Woody & Oud",
  "Floral & Rose",
  "Fresh & Citrus",
  "Warm Gourmand"
];

const SEASONS = [
  "All Seasons",
  "Autumn / Winter",
  "Spring / Summer",
  "Year-Round"
];

type SortOption = "featured" | "price-asc" | "price-desc" | "longevity";

export default function PerfumesCatalogClient({ initialProducts }: PerfumesCatalogClientProps) {
  // Filter States
  const [selectedFamily, setSelectedFamily] = useState<string>("All Fragrances");
  const [selectedSeason, setSelectedSeason] = useState<string>("All Seasons");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  
  // UI States
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const store = useStore();
  const wishlist = store.wishlist;
  const [quickViewProduct, setQuickViewProduct] = useState<PerfumeItem | null>(null);

  // Toggle Wishlist
  const toggleWishlist = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    store.toggleWishlist(productId);
  };

  // Cart Helpers
  const addToCart = (product: PerfumeItem) => {
    store.addToCart(product);
    store.openCart();
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(item => {
      // Scent Family
      if (selectedFamily !== "All Fragrances" && item.category !== selectedFamily) {
        return false;
      }
      // Season
      if (selectedSeason !== "All Seasons") {
        if (!item.season.toLowerCase().includes(selectedSeason.toLowerCase().split(" ")[0])) {
          return false;
        }
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesNotes = item.notes.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesStory = item.story.toLowerCase().includes(query);
        if (!matchesName && !matchesNotes && !matchesCategory && !matchesStory) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.priceNum - b.priceNum;
      if (sortBy === "price-desc") return b.priceNum - a.priceNum;
      if (sortBy === "longevity") {
        const getHours = (str: string) => parseInt(str) || 0;
        return getHours(b.longevity) - getHours(a.longevity);
      }
      return a.id - b.id; // featured / natural order
    });
  }, [initialProducts, selectedFamily, selectedSeason, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedFamily("All Fragrances");
    setSelectedSeason("All Seasons");
    setSearchQuery("");
    setSortBy("featured");
  };

  const hasActiveFilters = selectedFamily !== "All Fragrances" || selectedSeason !== "All Seasons" || searchQuery !== "" || sortBy !== "featured";



  return (
    <div className="min-h-screen bg-[#FBFBF9] text-zinc-900 selection:bg-zinc-950 selection:text-white flex flex-col justify-between">
      {/* Header */}
      <SiteHeader cartCount={store.cartCount} onOpenCart={store.openCart} />

      <main className="flex-1">
        {/* 1. EDITORIAL HERO BANNER */}
        <section className="relative py-14 sm:py-20 md:py-28 px-4 sm:px-6 bg-zinc-950 text-white overflow-hidden border-b border-zinc-800">
          <div className="absolute inset-0 opacity-25">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/banners/oud-royale.png" 
              alt="Haute Parfumerie Flacons" 
              className="w-full h-full object-cover object-center filter blur-[1px]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/50" />

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 text-[#C5A880] text-[10px] font-bold tracking-[0.28em] uppercase border border-white/10 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" /> The Permanent Line • Extrait de Parfum
            </span>
            <h1 className="font-serif text-3xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.08] mb-6">
              The Artisanal <br />
              <span className="italic font-normal text-[#F3E7D3]">Flacon Collection</span>
            </h1>
            <p className="text-xs sm:text-base text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto mb-8">
              Poured at an uncompromised 30% to 35% pure fragrance oil weight. Each formulation is cold-macerated for 90 days in chilled stainless drums to ensure velvet projection and 20+ hour skin longevity.
            </p>

            {/* Quick Guarantees Strip */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] font-medium tracking-widest uppercase text-zinc-400 border-t border-zinc-800/80 pt-6">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Droplets className="w-3.5 h-3.5 text-[#C5A880]" /> 30%+ Pure Oil Weight
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Truck className="w-3.5 h-3.5 text-[#C5A880]" /> Complimentary COD Nationwide
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" /> Free 2ml Tester Vial Included
              </span>
            </div>
          </div>
        </section>

        {/* 2. FILTER & SORT TOOLBAR */}
        <section className="sticky top-16 sm:top-20 z-30 bg-[#FBFBF9]/95 backdrop-blur-md border-b border-zinc-200 py-3.5 sm:py-4 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
            
            {/* Scent Family Filter Tabs (Desktop & Tablet) */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {SCENT_FAMILIES.map(family => {
                const isActive = selectedFamily === family;
                return (
                  <button
                    key={family}
                    onClick={() => setSelectedFamily(family)}
                    className={`px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap shrink-0 border ${
                      isActive
                        ? "bg-zinc-950 text-white border-zinc-950 shadow-xs"
                        : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-950 hover:text-zinc-950"
                    }`}
                  >
                    {family}
                  </button>
                );
              })}
            </div>

            {/* Right Controls: Search, Sort Dropdown & Reset */}
            <div className="flex items-center gap-2 sm:gap-3 justify-between md:justify-end">
              {/* Live Search */}
              <div className="relative flex-1 md:w-56 lg:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes, oud, rose..."
                  className="w-full bg-white border border-zinc-200 pl-8 pr-3 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-950"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-white border border-zinc-200 pl-3 pr-7 py-1.5 text-xs font-medium text-zinc-800 focus:outline-none focus:border-zinc-950 cursor-pointer"
                >
                  <option value="featured">Featured Flacons</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="longevity">Longevity (20h+)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Reset Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors border border-zinc-200 shrink-0"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </section>

        {/* 3. PRODUCT GRID SHOWCASE */}
        <section className="py-10 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
          {/* Header Summary Strip */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200 text-xs text-zinc-500 font-light">
            <p>
              Displaying <strong className="font-semibold text-zinc-900">{filteredProducts.length}</strong> master flacons {selectedFamily !== "All Fragrances" && `in ${selectedFamily}`}
            </p>
            <span className="hidden sm:inline text-[11px] font-mono tracking-wider uppercase text-[#8C7355]">
              Macerated 90 Days • 50ml Flacons
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white border border-zinc-200 p-8 max-w-lg mx-auto">
              <Search className="w-10 h-10 text-zinc-300 mx-auto mb-4" strokeWidth={1} />
              <h3 className="font-serif text-xl font-light text-zinc-950 mb-2">No matching flacons found</h3>
              <p className="text-xs text-zinc-500 mb-6">
                Try clearing your search query or selecting another scent family to see all formulations.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-zinc-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlist.includes(product.id);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="group bg-white border border-zinc-200 flex flex-col justify-between hover:border-zinc-950 transition-all shadow-xs overflow-hidden"
                  >
                    <div>
                      {/* Product Flacon Presentation Image */}
                      <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden border-b border-zinc-200">
                        <Link href={`/perfumes/${product.slug}`} className="block w-full h-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.image}
                            alt={`${product.name} Extrait de Parfum`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        </Link>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
                          {product.badge && (
                            <span className="bg-zinc-950 text-white px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase shadow-sm">
                              {product.badge}
                            </span>
                          )}
                          {typeof product.stock === "number" && product.stock <= (product.lowStockAlert || 5) && (
                            <span className="bg-amber-600/95 text-white px-2 py-0.5 text-[8.5px] font-bold tracking-wider uppercase shadow-sm flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-300 animate-ping" />
                              Only {product.stock} Left
                            </span>
                          )}
                        </div>

                        {/* Wishlist Heart Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleWishlist(e, product.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-zinc-200 flex items-center justify-center transition-all hover:scale-110 shadow-sm z-10"
                          title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 transition-colors ${
                              isWishlisted ? "fill-rose-500 text-rose-500" : "text-zinc-500 hover:text-zinc-950"
                            }`}
                          />
                        </button>

                        {/* Quick View Button */}
                        <button
                          type="button"
                          onClick={() => setQuickViewProduct(product)}
                          className="absolute bottom-3 right-3 p-2 bg-white/95 backdrop-blur-md hover:bg-zinc-950 hover:text-white transition-all border border-zinc-200 shadow-sm text-zinc-700 rounded-sm z-10 opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                          title="Quick View Scent Pyramid"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Card Information */}
                      <div className="p-4 sm:p-6">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8C7355]">
                            {product.category}
                          </span>
                          <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                            {product.volume}
                          </span>
                        </div>

                        <Link href={`/perfumes/${product.slug}`} className="block">
                          <h3 className="font-serif text-xl sm:text-2xl font-light tracking-tight text-zinc-950 hover:text-[#8C7355] transition-colors mb-2">
                            {product.name}
                          </h3>
                        </Link>

                        <p className="text-xs text-zinc-500 font-light leading-relaxed mb-4 line-clamp-2">
                          {product.notes}
                        </p>

                        {/* Concentration & Longevity Pill Bar */}
                        <div className="flex items-center gap-2 mb-3 text-[10px] font-mono text-zinc-600 bg-zinc-50 border border-zinc-100 p-2">
                          <span className="flex items-center gap-1 font-semibold text-zinc-900">
                            <Droplets className="w-3 h-3 text-[#C5A880]" /> {product.concentration.split(" ")[0]}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-400" /> {product.longevity}
                          </span>
                        </div>

                        {/* Low Stock Alert Notice */}
                        {typeof product.stock === "number" && product.stock <= (product.lowStockAlert || 5) && (
                          <div className="flex items-center gap-1.5 text-[10px] text-amber-900 font-semibold mb-3 bg-amber-50 border border-amber-200 px-2.5 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                            <span>Reserve Alert: Only {product.stock} flacons left in batch</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer: Price & CTAs */}
                    <div className="p-4 sm:p-6 pt-0 border-t border-zinc-100 mt-auto">
                      <div className="flex items-baseline justify-between mb-4 pt-3">
                        <span className="font-serif text-lg sm:text-xl font-normal text-zinc-950">
                          {product.price}
                        </span>
                        <span className="text-[10px] tracking-wider uppercase text-emerald-800 font-bold">
                          Free COD Delivery
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="w-full py-2.5 sm:py-3 bg-zinc-950 text-white text-[11px] font-bold tracking-[0.16em] uppercase hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3 h-3" /> Add To Bag
                        </button>
                        <Link
                          href={`/perfumes/${product.slug}`}
                          className="w-full py-2.5 sm:py-3 border border-zinc-300 text-zinc-800 text-[11px] font-bold tracking-[0.16em] uppercase hover:border-zinc-950 hover:text-zinc-950 transition-colors flex items-center justify-center gap-1 text-center"
                        >
                          View Flacon <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* 4. DISCOVERY COFFRET PROMO BANNER */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 bg-zinc-950 text-white border-t border-zinc-800">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="px-3 py-1 bg-white/10 text-[#C5A880] text-[10px] font-bold tracking-[0.25em] uppercase inline-block mb-4 border border-white/10">
                Sample Before Committing
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light tracking-tight mb-4 leading-tight">
                The Complete 6-Fragrance <br />
                <span className="italic font-normal text-[#F3E7D3]">Discovery Coffret</span>
              </h2>
              <p className="text-zinc-400 font-light text-xs sm:text-sm leading-relaxed mb-6 max-w-xl">
                Unsure which extrait suits your personal skin chemistry? Receive all 6 signature creations in 5ml glass atomizers. 
                Delivered with an official <strong>100% redeemable PKR 3,500 voucher</strong> valid on your first 50ml flacon.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mb-6 text-xs">
                <div className="p-3 bg-white/5 border border-white/10">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Set Volume</p>
                  <p className="font-serif text-lg text-white font-normal">6 x 5ml (30ml Total)</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/10">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Investment</p>
                  <p className="font-serif text-lg text-[#C5A880] font-normal">PKR 3,500 (100% Back)</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => addToCart(DISCOVERY_SET_ITEM)}
                  className="px-6 py-3.5 bg-white text-zinc-950 text-xs font-bold tracking-[0.2em] uppercase hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                >
                  Order Discovery Set • PKR 3,500 <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <Link
                  href="/discovery"
                  className="px-6 py-3.5 border border-white/30 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-zinc-950 transition-colors text-center"
                >
                  Coffret Details
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-square sm:aspect-[4/3] overflow-hidden border border-zinc-800 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/discovery-box.jpg"
                alt="Aura Discovery Coffret Set"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

      </main>

      {/* QUICK VIEW MODAL */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-2xl bg-white border border-zinc-200 shadow-2xl overflow-hidden flex flex-col sm:flex-row"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-3 right-3 z-20 p-1.5 bg-white/90 rounded-full hover:bg-zinc-950 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="sm:w-1/2 aspect-square sm:aspect-auto bg-zinc-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="sm:w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C7355] block mb-1">
                    {quickViewProduct.category}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-zinc-950 mb-2">
                    {quickViewProduct.name}
                  </h3>
                  <p className="font-serif text-lg font-normal text-zinc-900 mb-4">
                    {quickViewProduct.price} • {quickViewProduct.volume}
                  </p>
                  
                  <div className="space-y-2 text-xs mb-6 text-zinc-600">
                    <p><strong>Top:</strong> {quickViewProduct.topNotes}</p>
                    <p><strong>Heart:</strong> {quickViewProduct.heartNotes}</p>
                    <p><strong>Base:</strong> {quickViewProduct.baseNotes}</p>
                    <p className="pt-2 text-[11px] text-zinc-500 font-light leading-relaxed">
                      {quickViewProduct.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="w-full py-3 bg-zinc-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add To Shopping Bag
                  </button>
                  <Link
                    href={`/perfumes/${quickViewProduct.slug}`}
                    className="block w-full py-2.5 border border-zinc-200 text-zinc-800 text-xs font-bold tracking-widest uppercase hover:border-zinc-950 hover:text-zinc-950 transition-colors text-center"
                  >
                    Full Perfume Details
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Floating Concierge */}
      <WhatsAppConcierge />

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
