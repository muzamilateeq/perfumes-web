export interface PerfumeItem {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: string;
  priceNum: number;
  image: string;
  notes: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  concentration: string;
  volume: string;
  description: string;
  badge?: string;
  sillage: string;
  longevity: string;
  bestOccasion: string;
  season: string;
  gender: string;
  story: string;
}

export const PERFUMES_DATA: PerfumeItem[] = [
  {
    id: 1,
    slug: "oud-royale",
    name: "Oud Royale",
    category: "Woody & Oud",
    price: "PKR 12,500",
    priceNum: 12500,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1200",
    notes: "Cambodian Agarwood, Amber, Bourbon Vanilla",
    topNotes: "Calabrian Bergamot, Black Cardamom",
    heartNotes: "20-Year Aged Cambodian Oud, Nutmeg",
    baseNotes: "White Ambergris, Smoked Birch, Bourbon Vanilla",
    concentration: "Extrait de Parfum (32% Oil)",
    volume: "50ml / 1.7 FL. OZ.",
    description: "A commanding opening of regal citrus and warm spice melting into aged dark oud and rich golden amber.",
    badge: "Best Seller",
    sillage: "Commanding & Royal",
    longevity: "20+ Hours",
    bestOccasion: "Evenings, Weddings & Black Tie",
    season: "Autumn / Winter / Formal Evenings",
    gender: "Unisex — Regal Presence",
    story: "Distilled from rare Cambodian agarwood matured for two decades. Oud Royale represents unhurried luxury—a tribute to Eastern heritage reimagined with French haute perfumerie precision."
  },
  {
    id: 2,
    slug: "velvet-rose",
    name: "Velvet Rose",
    category: "Floral & Rose",
    price: "PKR 8,200",
    priceNum: 8200,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=1200",
    notes: "French May Rose, Damask Rose, Indonesian Patchouli",
    topNotes: "Pink Pepper, Frozen Blackcurrant",
    heartNotes: "French May Rose Absolute, Bulgarian Damask",
    baseNotes: "Velvet White Musk, Aged Earthy Patchouli",
    concentration: "Extrait de Parfum (30% Oil)",
    volume: "50ml / 1.7 FL. OZ.",
    description: "Nocturnal, intoxicating rose absolute balanced by sparkling pink peppercorns and velvety patchouli.",
    badge: "Trending",
    sillage: "Intimate & Elegant",
    longevity: "16+ Hours",
    bestOccasion: "Romantic Dinners & Special Occasions",
    season: "All Year / Spring Evenings",
    gender: "Unisex — Sensual & Romantic",
    story: "Over five thousand French rose petals cold-extracted to produce a single flacon. Velvet Rose is dark, moody, and magnetic—far removed from ordinary sugary florals."
  },
  {
    id: 3,
    slug: "midnight-citrus",
    name: "Midnight Citrus",
    category: "Fresh & Citrus",
    price: "PKR 6,800",
    priceNum: 6800,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1200",
    notes: "Calabrian Bergamot, Italian Neroli, Haitian Vetiver",
    topNotes: "Zesty Sicilian Mandarin, Crushed Garden Mint",
    heartNotes: "Italian Petitgrain, Sunlit Neroli",
    baseNotes: "Smoky Haitian Vetiver, Virginian Cedarwood",
    concentration: "Extrait de Parfum (28% Oil)",
    volume: "50ml / 1.7 FL. OZ.",
    description: "Electric burst of Mediterranean citrus grounded by deep smoky roots. Crisp, refreshing, and high-projection.",
    badge: "Signature Fresh",
    sillage: "Crisp & Radiating",
    longevity: "14+ Hours",
    bestOccasion: "Daily Signature, Executive Office & Summer",
    season: "Spring / Summer / Hot Climates",
    gender: "Unisex — Crisp & Invigorating",
    story: "Unlike mass-market colognes that fade within an hour, Midnight Citrus blends sun-drenched Italian bergamot with high-oil Haitian vetiver, guaranteeing true 14-hour skin longevity."
  },
  {
    id: 4,
    slug: "santal-supreme",
    name: "Santal Supreme",
    category: "Woody & Oud",
    price: "PKR 15,000",
    priceNum: 15000,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1200",
    notes: "Australian Sandalwood, Tuscan Leather, Florentine Iris",
    topNotes: "Green Cardamom, Violet Leaves",
    heartNotes: "Egyptian Papyrus, Iris Butter, Cedar",
    baseNotes: "Creamy Sandalwood, Soft Tuscan Suede, Cashmeran",
    concentration: "Extrait de Parfum (35% Oil)",
    volume: "50ml / 1.7 FL. OZ.",
    description: "Creamy Australian sandalwood infused with tactile soft suede and powdered Tuscan iris. The epitome of quiet luxury.",
    badge: "Private Reserve",
    sillage: "Sophisticated & Enveloping",
    longevity: "24+ Hours",
    bestOccasion: "All Seasons & Executive Boardrooms",
    season: "Versatile Signature Year-Round",
    gender: "Unisex — Quiet Luxury Standard",
    story: "The crown jewel of the house. Formulated with 35% pure fragrance oil weight. The drydown leaves an addictive sillage of soft Italian glove leather and buttery sandalwood."
  },
  {
    id: 5,
    slug: "vanilla-whisper",
    name: "Vanilla Whisper",
    category: "Warm Gourmand",
    price: "PKR 7,500",
    priceNum: 7500,
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1200",
    notes: "Bourbon Vanilla Absolute, Roasted Tonka, Cocoa Pod",
    topNotes: "Creamy Almond Milk, Heliotrope Blossom",
    heartNotes: "Roasted Venezuelan Tonka, Raw Cocoa",
    baseNotes: "Organic Bourbon Vanilla Pod, Golden Amberwood",
    concentration: "Extrait de Parfum (30% Oil)",
    volume: "50ml / 1.7 FL. OZ.",
    description: "Warm, caramelized tonka draped over organic Madagascar vanilla bean. Sensual, comforting, and long-lasting.",
    badge: "Winter Favorite",
    sillage: "Warm & Addictive",
    longevity: "18+ Hours",
    bestOccasion: "Cozy Evenings & Autumn/Winter",
    season: "Autumn / Winter / Chilly Nights",
    gender: "Unisex — Intimate & Comforting",
    story: "An elevated gourmand devoid of artificial sweetness. Real bourbon vanilla beans macerated in cold alcohol drums, creating a smoky, caramelized veil that warms to your skin."
  },
  {
    id: 6,
    slug: "aqua-celestia",
    name: "Aqua Celestia",
    category: "Fresh & Citrus",
    price: "PKR 9,000",
    priceNum: 9000,
    image: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=1200",
    notes: "Marine Sea Salt, Kaffir Lime, Blue Sage, Driftwood",
    topNotes: "Kaffir Lime Zest, Oceanic Saline Mist",
    heartNotes: "French Gardenia, Coastal Blue Sage",
    baseNotes: "Sun-Bleached Driftwood, Pure Ambroxan",
    concentration: "Extrait de Parfum (28% Oil)",
    volume: "50ml / 1.7 FL. OZ.",
    description: "A bracing plunge into crystalline ocean spray infused with French florals and warm sun-drenched driftwood.",
    badge: "High Summer",
    sillage: "Vibrant & Airy",
    longevity: "15+ Hours",
    bestOccasion: "High Summer, Beach & Tropical Days",
    season: "Spring / Summer / Beach Vacations",
    gender: "Unisex — Aquatic Cleanliness",
    story: "Capturing the salty breeze of Mediterranean cliffs at dawn. Marine mist harmonized with sun-bleached cedarwood, formulating a cooling sanctuary from tropical heat."
  }
];

export function getPerfumeBySlug(slug: string): PerfumeItem | undefined {
  return PERFUMES_DATA.find((p) => p.slug === slug || p.id.toString() === slug);
}

export function getAllPerfumes(): PerfumeItem[] {
  return PERFUMES_DATA;
}

export const DISCOVERY_SET_ITEM: PerfumeItem = {
  id: 99,
  slug: "discovery-set",
  name: "Discovery Coffret (6 x 5ml)",
  category: "Sample Set",
  price: "PKR 3,500",
  priceNum: 3500,
  image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=1200",
  notes: "All 6 Signature Extrait Formulations",
  topNotes: "Curated Set",
  heartNotes: "Artisanal Selection",
  baseNotes: "Full Spectrum",
  concentration: "Extrait de Parfum (30% Oil)",
  volume: "30ml Total (6 x 5ml)",
  description: "Full set of 6 signature fragrances in 5ml atomizer vials. Includes 100% redeemable voucher credit.",
  badge: "Bestseller Set",
  sillage: "Complete Spectrum",
  longevity: "18+ Hours Each",
  bestOccasion: "Sampling & Travel",
  season: "All Year",
  gender: "Unisex — The Complete Wardrobe",
  story: "Engineered for clients who wish to live with our creations on skin before committing to a full 50ml flacon. Includes 100% voucher credit towards any full bottle."
};

