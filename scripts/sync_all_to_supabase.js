require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const PRODUCTS_FILE = path.join(__dirname, "..", "data", "products.json");
const ORDERS_FILE = path.join(__dirname, "..", "data", "orders.json");

async function main() {
  console.log("=== STARTING FULL PROFESSIONAL SUPABASE SYNC ===");

  // 1. SYNC BUSINESS
  console.log("\n1. Syncing Flagship Business...");
  const business = await prisma.business.upsert({
    where: { slug: "aura" },
    update: {
      name: "Aura Haute Parfumerie",
      description: "Artisanal Haute Parfumerie house crafting 100% Extrait de Parfum (30%+ oil).",
      category: "Haute Parfumerie",
      status: "ACTIVE",
    },
    create: {
      id: "biz-aura",
      name: "Aura Haute Parfumerie",
      slug: "aura",
      description: "Artisanal Haute Parfumerie house crafting 100% Extrait de Parfum (30%+ oil).",
      category: "Haute Parfumerie",
      status: "ACTIVE",
    },
  });
  console.log(`✅ Business Synced: ${business.name} (ID: ${business.id})`);

  // 2. SYNC ADMIN USER
  console.log("\n2. Syncing Admin User...");
  const adminEmail = process.env.ADMIN_EMAIL || "muzamilateeq423@gmail.com";
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Muzamil Ateeq (Admin)",
      role: "ADMIN",
    },
    create: {
      id: "usr-admin-1",
      email: adminEmail,
      name: "Muzamil Ateeq (Admin)",
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin User Synced: ${user.email} (Role: ${user.role})`);

  // 3. SYNC PRODUCTS
  console.log("\n3. Syncing Products...");
  const rawProducts = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
  
  // Add Discovery Set product as well
  const allProductsToSync = [
    ...rawProducts.map(p => ({
      id: String(p.id),
      title: p.name,
      description: p.description || p.story || "",
      price: p.priceNum || 8500,
      stock: 50,
      images: [p.bannerImage || p.image || "/banners/oud-royale.png"],
      businessId: business.id,
    })),
    {
      id: "99",
      title: "Artisanal Discovery Coffret (6 x 5ml)",
      description: "Explore the complete portfolio of 6 artisanal Extraits de Parfum with complimentary voucher.",
      price: 3500,
      stock: 100,
      images: ["/discovery-set-hero.png"],
      businessId: business.id,
    }
  ];

  for (const prod of allProductsToSync) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: {
        title: prod.title,
        description: prod.description,
        price: prod.price,
        stock: prod.stock,
        images: prod.images,
        businessId: business.id,
      },
      create: prod,
    });
    console.log(`✅ Product Synced: [${prod.id}] ${prod.title} (PKR ${prod.price})`);
  }

  // 4. SYNC ORDERS & ORDER ITEMS
  console.log("\n4. Syncing Orders & Order Items...");
  const rawOrders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));
  console.log(`Found ${rawOrders.length} orders in local store.`);

  for (const o of rawOrders) {
    // 4a. Upsert Order
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber: o.orderNumber },
    });

    let orderRecord = existingOrder;
    if (!existingOrder) {
      orderRecord = await prisma.order.create({
        data: {
          orderNumber: o.orderNumber,
          customerName: o.customerName || "Customer",
          customerPhone: o.customerPhone || "N/A",
          customerAddress: o.customerAddress || "N/A",
          customerCity: o.customerCity || "Karachi",
          paymentMethod: o.paymentMethod || "COD",
          notes: o.notes || null,
          total: o.total || 0,
          status: o.status === "CONFIRMED" ? "PAID" : (o.status || "PENDING"),
          trackingNumber: o.orderNumber.replace("AUR-", "TRX-"),
          createdAt: o.createdAt ? new Date(o.createdAt) : new Date(),
        },
      });
      console.log(`✅ Created Order: ${o.orderNumber} (${o.customerName})`);
    } else {
      console.log(`ℹ️ Order already exists: ${o.orderNumber}`);
    }

    // 4b. Sync Order Items
    if (Array.isArray(o.items) && o.items.length > 0 && orderRecord) {
      // Check existing order items for this order
      const existingItems = await prisma.orderItem.findMany({
        where: { orderId: orderRecord.id },
      });

      if (existingItems.length === 0) {
        for (const item of o.items) {
          const prodId = String(item.productId || "99");
          
          // Verify product exists, fallback to "99" if not found
          const productExists = await prisma.product.findUnique({ where: { id: prodId } });
          const targetProdId = productExists ? prodId : "99";

          await prisma.orderItem.create({
            data: {
              orderId: orderRecord.id,
              productId: targetProdId,
              quantity: item.quantity || 1,
              price: item.price || 3500,
            },
          });
          console.log(`   📦 OrderItem Linked: ${item.name} (Qty: ${item.quantity || 1}) -> Order ${o.orderNumber}`);
        }
      }
    }
  }

  // 5. PRINT FINAL SUMMARY STATS
  console.log("\n=== FINAL SUPABASE DATABASE STATUS ===");
  const businessCount = await prisma.business.count();
  const userCount = await prisma.user.count();
  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();
  const orderItemCount = await prisma.orderItem.count();

  console.log({
    businesses: businessCount,
    users: userCount,
    products: productCount,
    orders: orderCount,
    orderItems: orderItemCount,
  });

  console.log("\n🎉 FULL PROFESSIONAL SYNC COMPLETED SUCCESSFULLY!");
}

main()
  .catch((e) => {
    console.error("Sync error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
