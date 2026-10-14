const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();
const ORDERS_FILE = path.join(__dirname, "..", "data", "orders.json");

async function main() {
  console.log("Reading orders from:", ORDERS_FILE);
  if (!fs.existsSync(ORDERS_FILE)) {
    console.log("No orders file found.");
    return;
  }

  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));
  console.log(`Found ${orders.length} orders to sync to Supabase...`);

  let synced = 0;
  for (const o of orders) {
    try {
      // Check if already in Supabase
      const existing = await prisma.order.findUnique({
        where: { orderNumber: o.orderNumber }
      });

      if (!existing) {
        await prisma.order.create({
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
          }
        });
        console.log(`✅ Synced to Supabase: ${o.orderNumber} (${o.customerName})`);
        synced++;
      } else {
        console.log(`ℹ️ Already in Supabase: ${o.orderNumber}`);
      }
    } catch (err) {
      console.error(`❌ Failed to sync ${o.orderNumber}:`, err.message);
    }
  }

  console.log(`\n🎉 Completed! Successfully synced ${synced} orders to Supabase database!`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Sync error:", e);
  prisma.$disconnect();
});
