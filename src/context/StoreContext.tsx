"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PerfumeItem, PERFUMES_DATA, DISCOVERY_SET_ITEM } from "@/lib/perfumes";
import { StoreSettings, DEFAULT_STORE_SETTINGS } from "@/lib/storeTypes";

export interface CartItem {
  product: PerfumeItem;
  quantity: number;
}

interface StoreContextType {
  // Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Wishlist
  wishlist: number[];
  wishlistItems: PerfumeItem[];
  wishlistCount: number;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: PerfumeItem, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  clearCart: () => void;
  includeGiftBox: boolean;
  setIncludeGiftBox: (val: boolean) => void;

  // Fast Checkout Modal
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "aura_perfumes_wishlist_v1";
const CART_STORAGE_KEY = "aura_perfumes_cart_v1";
const SETTINGS_STORAGE_KEY = "aura_perfumes_settings_v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [includeGiftBox, setIncludeGiftBox] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(savedSettings) }));
      }

      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }

      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Failed to load store data from localStorage", e);
    }
  }, []);

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save settings", e);
      }
      return updated;
    });
  };

  // Persist Wishlist
  const saveWishlist = (items: number[]) => {
    setWishlist(items);
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save wishlist", e);
    }
  };

  // Persist Cart
  const saveCart = (items: CartItem[]) => {
    setCart(items);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  };

  // Wishlist Functions
  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const isInWishlist = (productId: number) => wishlist.includes(productId);

  const clearWishlist = () => {
    saveWishlist([]);
  };

  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);

  // All catalog items including discovery set
  const allKnownProducts: PerfumeItem[] = [...PERFUMES_DATA, DISCOVERY_SET_ITEM];
  const wishlistItems = wishlist
    .map((id) => allKnownProducts.find((p) => p.id === id))
    .filter(Boolean) as PerfumeItem[];

  // Cart Functions
  const addToCart = (product: PerfumeItem, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...prev, { product, quantity }];
      }
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearCart = () => {
    saveCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.product.priceNum * item.quantity,
    0
  );

  return (
    <StoreContext.Provider
      value={{
        settings,
        updateSettings,

        wishlist,
        wishlistItems,
        wishlistCount: wishlist.length,
        isWishlistOpen,
        openWishlist,
        closeWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,

        cart,
        cartCount,
        cartTotal,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        includeGiftBox,
        setIncludeGiftBox,

        isCheckoutOpen,
        openCheckout,
        closeCheckout,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
