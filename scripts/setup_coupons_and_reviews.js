require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Connecting via Prisma Client to Supabase...");

  console.log("Creating Coupon table if not exists...");
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Coupon" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "code" TEXT NOT NULL UNIQUE,
      "discountType" TEXT NOT NULL DEFAULT 'PERCENT',
      "discountValue" DECIMAL(10,2) NOT NULL,
      "minOrderAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
      "maxUses" INTEGER,
      "usedCount" INTEGER NOT NULL DEFAULT 0,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "expiresAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✅ Coupon table ready!");

  console.log("Creating Review table if not exists...");
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Review" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "productId" TEXT NOT NULL,
      "customerName" TEXT NOT NULL,
      "customerCity" TEXT,
      "rating" INTEGER NOT NULL DEFAULT 5,
      "comment" TEXT NOT NULL,
      "longevity" TEXT DEFAULT '18+ Hours',
      "sillage" TEXT DEFAULT 'Strong & Radiating',
      "isVerified" BOOLEAN NOT NULL DEFAULT true,
      "status" TEXT NOT NULL DEFAULT 'APPROVED',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);
  console.log("✅ Review table ready!");

  console.log("Adding extra perfume management columns to Product if not exists...");
  await prisma.$executeRawUnsafe(`
    DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Product' AND column_name='batchNumber') THEN
        ALTER TABLE "Product" ADD COLUMN "batchNumber" TEXT DEFAULT 'BATCH-2026/01';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Product' AND column_name='maturation') THEN
        ALTER TABLE "Product" ADD COLUMN "maturation" TEXT DEFAULT '6 Months Cold Matured';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Product' AND column_name='lowStockAlert') THEN
        ALTER TABLE "Product" ADD COLUMN "lowStockAlert" INTEGER DEFAULT 5;
      END IF;
    END $$;
  `);
  console.log("✅ Product table updated with batchNumber, maturation, lowStockAlert!");

  console.log("Adding coupon tracking columns to Order if not exists...");
  await prisma.$executeRawUnsafe(`
    DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Order' AND column_name='couponCode') THEN
        ALTER TABLE "Order" ADD COLUMN "couponCode" TEXT;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Order' AND column_name='discountAmount') THEN
        ALTER TABLE "Order" ADD COLUMN "discountAmount" DECIMAL(10,2) DEFAULT 0;
      END IF;
    END $$;
  `);
  console.log("✅ Order table updated with couponCode & discountAmount!");

  console.log("\n🎉 ALL DATABASE TABLES & COLUMNS SUCCESSFULLY CREATED IN SUPABASE!");
}

main()
  .catch((e) => {
    console.error("Migration error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
