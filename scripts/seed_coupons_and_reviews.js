require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const DATA_DIR = path.join(__dirname, "..", "data");
const COUPONS_FILE = path.join(DATA_DIR, "coupons.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

const SEED_COUPONS = [
  {
    id: "cpn-welcome10",
    code: "WELCOME10",
    discountType: "PERCENT",
    discountValue: 10,
    minOrderAmount: 0,
    maxUses: 500,
    usedCount: 14,
    isActive: true,
  },
  {
    id: "cpn-aura1000",
    code: "AURA1000",
    discountType: "FIXED",
    discountValue: 1000,
    minOrderAmount: 6000,
    maxUses: 200,
    usedCount: 28,
    isActive: true,
  },
  {
    id: "cpn-royalvip",
    code: "ROYALVIP",
    discountType: "PERCENT",
    discountValue: 15,
    minOrderAmount: 10000,
    maxUses: 100,
    usedCount: 7,
    isActive: true,
  },
  {
    id: "cpn-eid2026",
    code: "EID2026",
    discountType: "FIXED",
    discountValue: 1500,
    minOrderAmount: 8000,
    maxUses: 150,
    usedCount: 0,
    isActive: true,
  }
];

const SEED_REVIEWS = [
  {
    id: "rev-oud-1",
    productId: "1", // Oud Royale
    customerName: "Hamza Tariq",
    customerCity: "DHA Phase 6, Karachi",
    rating: 5,
    comment: "This is easily the most regal Cambodian oud creation I have smelled in Pakistan. It is dark, opulent, and not screechy at all. Applied at 7 PM for a wedding, and I could still smell it on my sherwani the next morning. 10/10 masterwork.",
    longevity: "20+ Hours",
    sillage: "Commanding & Royal",
    isVerified: true,
    status: "APPROVED",
    createdAt: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
  },
  {
    id: "rev-oud-2",
    productId: "1", // Oud Royale
    customerName: "Shahmeer Khan",
    customerCity: "Clifton, Karachi",
    rating: 5,
    comment: "The bourbon vanilla and ambergris base note gives it an unbelievable smooth creaminess. Everyone at office asked what I was wearing. Truly high-concentration Extrait.",
    longevity: "18+ Hours",
    sillage: "Heavy & Room-Filling",
    isVerified: true,
    status: "APPROVED",
    createdAt: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
  },
  {
    id: "rev-rose-1",
    productId: "2", // Velvet Rose
    customerName: "Dr. Ayesha Farooq",
    customerCity: "Gulberg Heights, Lahore",
    rating: 5,
    comment: "A dark, moody May Rose far removed from ordinary sugary florals. The pink pepper opening is crisp, and the patchouli drydown feels like velvet. My absolute signature for evenings.",
    longevity: "16+ Hours",
    sillage: "Intimate & Elegant",
    isVerified: true,
    status: "APPROVED",
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
  },
  {
    id: "rev-rose-2",
    productId: "2", // Velvet Rose
    customerName: "Zainab Malik",
    customerCity: "Cantt, Lahore",
    rating: 5,
    comment: "Packaging with wax seal and luxury box felt like receiving a gift from Paris. The trial tester policy made it completely risk-free.",
    longevity: "16+ Hours",
    sillage: "Moderate to Strong",
    isVerified: true,
    status: "APPROVED",
    createdAt: new Date(Date.now() - 3600000 * 24 * 9).toISOString(),
  },
  {
    id: "rev-citrus-1",
    productId: "3", // Midnight Citrus
    customerName: "Bilal Zubair",
    customerCity: "Sector F-7, Islamabad",
    rating: 5,
    comment: "Most citrus perfumes vanish after 3 hours—this one stays on for over 12 hours easily! The Italian neroli and Haitian vetiver give it immense depth. Perfect for daytime meetings.",
    longevity: "14+ Hours",
    sillage: "Crisp & Radiating",
    isVerified: true,
    status: "APPROVED",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: "rev-amber-1",
    productId: "4", // Amber Nobile
    customerName: "Usman Raza",
    customerCity: "Bahria Town, Rawalpindi",
    rating: 5,
    comment: "Rich golden benzoin, roasted tonka bean, and labdanum. It wraps around you like a cashmere coat. One of the warmest gourmands in my 40+ perfume collection.",
    longevity: "18+ Hours",
    sillage: "Enveloping & Warm",
    isVerified: true,
    status: "APPROVED",
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
  {
    id: "rev-discovery-1",
    productId: "99", // Discovery Coffret
    customerName: "Omar Sheikh",
    customerCity: "DHA Phase 5, Karachi",
    rating: 5,
    comment: "The best PKR 3,500 I have ever spent on perfumes. Getting 6 x 5ml glass atomizers lets you test all scents for weeks. Plus the coupon code inside gives you the money back on your full bottle!",
    longevity: "Full Set Tested",
    sillage: "Outstanding Portfolio",
    isVerified: true,
    status: "APPROVED",
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  }
];

async function main() {
  console.log("=== SEEDING COUPONS & VERIFIED REVIEWS ===");

  // 1. Save Local JSON files
  fs.writeFileSync(COUPONS_FILE, JSON.stringify(SEED_COUPONS, null, 2), "utf-8");
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(SEED_REVIEWS, null, 2), "utf-8");
  console.log("✅ Saved coupons.json and reviews.json locally");

  // 2. Sync to Supabase
  console.log("\nSyncing Coupons to Supabase...");
  for (const c of SEED_COUPONS) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {
        discountType: c.discountType,
        discountValue: c.discountValue,
        minOrderAmount: c.minOrderAmount,
        maxUses: c.maxUses,
        usedCount: c.usedCount,
        isActive: c.isActive,
      },
      create: {
        id: c.id,
        code: c.code,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minOrderAmount: c.minOrderAmount,
        maxUses: c.maxUses,
        usedCount: c.usedCount,
        isActive: c.isActive,
      },
    });
    console.log(`✅ Coupon Synced: ${c.code} (${c.discountType === "PERCENT" ? c.discountValue + "%" : "PKR " + c.discountValue})`);
  }

  console.log("\nSyncing Reviews to Supabase...");
  for (const r of SEED_REVIEWS) {
    await prisma.review.upsert({
      where: { id: r.id },
      update: {
        customerName: r.customerName,
        customerCity: r.customerCity,
        rating: r.rating,
        comment: r.comment,
        longevity: r.longevity,
        sillage: r.sillage,
        isVerified: r.isVerified,
        status: r.status,
      },
      create: {
        id: r.id,
        productId: r.productId,
        customerName: r.customerName,
        customerCity: r.customerCity,
        rating: r.rating,
        comment: r.comment,
        longevity: r.longevity,
        sillage: r.sillage,
        isVerified: r.isVerified,
        status: r.status,
        createdAt: new Date(r.createdAt),
      },
    });
    console.log(`✅ Review Synced: [${r.productId}] ${r.customerName} - ${r.rating}★ (${r.longevity})`);
  }

  // 3. Update products with stock & batch details
  console.log("\nUpdating Products with Stock, Batch, and Maturation...");
  const rawProducts = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
  
  const updatedProducts = rawProducts.map((p, idx) => ({
    ...p,
    // Set realistic inventory: Oud Royale has 4 left to trigger urgency alert!
    stock: p.slug === "oud-royale" ? 4 : (p.stock || 24 + idx * 5),
    lowStockAlert: 5,
    batchNumber: p.batchNumber || `AUR-B26/0${idx + 1}`,
    maturation: p.maturation || (p.slug === "oud-royale" ? "20-Year Aged Agarwood • 6-Month Matured" : "6 Months Cold Matured Extrait"),
  }));

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(updatedProducts, null, 2), "utf-8");

  for (const p of updatedProducts) {
    await prisma.product.update({
      where: { id: String(p.id) },
      data: {
        stock: p.stock,
        lowStockAlert: p.lowStockAlert,
        batchNumber: p.batchNumber,
        maturation: p.maturation,
      },
    }).catch(e => console.warn(`Product update notice for ${p.id}:`, e.message));
    console.log(`✅ Product Stock & Batch Updated: ${p.name} (Stock: ${p.stock}, Batch: ${p.batchNumber})`);
  }

  const [couponCount, reviewCount] = await Promise.all([
    prisma.coupon.count(),
    prisma.review.count(),
  ]);

  console.log("\n=== SEED SUMMARY ===");
  console.log({
    couponsInSupabase: couponCount,
    reviewsInSupabase: reviewCount,
  });
  console.log("🎉 SEED COMPLETED SUCCESSFULLY!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
