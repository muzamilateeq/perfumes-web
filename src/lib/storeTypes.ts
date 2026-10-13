export interface StoreSettings {
  storeName: string;
  whatsappNumber: string;
  supportPhone: string;
  announcementTicker: string;
  tickerActive: boolean;
  freeShippingEnabled: boolean;
  discoveryPrice: number;
  codEnabled: boolean;
  mobileWalletsEnabled: boolean;
  bankTransferEnabled: boolean;
  curatorNote: string;

  // Dynamic Story Section
  storyTitle: string;
  storySubtitle: string;
  storyDescription: string;
  storyPoint1Title: string;
  storyPoint1Text: string;
  storyPoint2Title: string;
  storyPoint2Text: string;
  storyPoint3Title: string;
  storyPoint3Text: string;
  storyProcessBadge: string;
  storyProcessText: string;

  // Dynamic Trial Guarantee Section
  trialGuaranteeTitle: string;
  trialGuaranteeSubtitle: string;
  trialGuaranteeDescription: string;
  trialGuaranteeBadge: string;
  trialGuaranteeBullet1: string;
  trialGuaranteeBullet2: string;

  // Dynamic Details & Policies Section
  deliveryTimeNotice: string;
  codPolicyNotice: string;
  founderQuote: string;
  founderAuthor: string;
}

export interface StoreOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  paymentMethod: string;
  notes?: string;
  total: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  items: {
    productId?: number | string;
    name: string;
    price: number;
    quantity: number;
  }[];
  createdAt: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "Aura Haute Parfumerie",
  whatsappNumber: "03098541632",
  supportPhone: "+92 309 8541632",
  announcementTicker: "COMPLIMENTARY EXPRESS DELIVERY NATIONWIDE • CASH ON DELIVERY (COD) • 100% EXTRAIT DE PARFUM (30%+ OIL) • FREE TESTER VIAL INCLUDED",
  tickerActive: true,
  freeShippingEnabled: true,
  discoveryPrice: 3500,
  codEnabled: true,
  mobileWalletsEnabled: true,
  bankTransferEnabled: true,
  curatorNote: "Artisanal Haute Parfumerie engineered for enduring distinction. Formulated in Grasse, France; hand-finished in Karachi, Pakistan.",

  // Dynamic Story Section
  storyTitle: "Why Aura Stands Apart From Mass Retailers.",
  storySubtitle: "The Standards",
  storyDescription: "Commercial perfumes flood the market with watered-down 12% Eau de Parfum designed to vanish within three hours so you spray more. At Aura, we formulate strictly at Extrait de Parfum (30%+ concentration) — an uncompromising tier of perfumery reserved for true connoisseurs.",
  storyPoint1Title: "Authentic Grasse Absolutes",
  storyPoint1Text: "We source natural botanical concentrates from historical family distilleries in Southern France.",
  storyPoint2Title: "Aged Assamese & Cambodian Ouds",
  storyPoint2Text: "No synthetic burning rubber odor. Only pure, sweet, aged natural agarwood resin.",
  storyPoint3Title: "Try First Guarantee",
  storyPoint3Text: "Every bottle comes with a matching free tester vial. Test the vial first; if you dislike it, return the sealed bottle for a 100% refund.",
  storyProcessBadge: "Cold Maceration Process",
  storyProcessText: "Each batch is preserved in chilled stainless drums for 90 days to eliminate sharp alcohol odors.",

  // Dynamic Trial Guarantee Section
  trialGuaranteeTitle: "Test on Your Skin for 24 Hours with Zero Risk",
  trialGuaranteeSubtitle: "Unrivaled Luxury Experience",
  trialGuaranteeDescription: "Haute Parfumerie is personal. That is why every flacon is shipped alongside a complimentary 2ml sample vial outside the sealed cellophane box. Enjoy the fragrance at home before breaking the seal.",
  trialGuaranteeBadge: "The 100% Risk-Free 2ml Trial Vial Promise",
  trialGuaranteeBullet1: "100% Full Refund if Unopened",
  trialGuaranteeBullet2: "Free Nationwide Courier Return Pickup",

  // Dynamic Details & Policies Section
  deliveryTimeNotice: "Karachi deliveries in 24-48 hours. Lahore, Islamabad, Rawalpindi & nationwide within 2-3 business days.",
  codPolicyNotice: "Cash on Delivery available nationwide. Pay the courier rider at your doorstep with complimentary doorstep inspection.",
  founderQuote: "“A scent should linger like an indelible memory, not vanish with the wind.”",
  founderAuthor: "Muzammil Ateeq — Founder & Formulation Director"
};
