"use server";

import { prisma } from "@/lib/db";
import { saveStoreOrder, getStoreOrders, StoreOrder } from "@/lib/storeManager";

export interface OrderInput {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  paymentMethod: string;
  notes?: string;
  items: {
    productId?: number | string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
}

export async function createOrderAction(data: OrderInput) {
  const generatedOrderNumber = "AUR-" + Math.floor(100000 + Math.random() * 900000);

  // 1. Always record in Store Manager (Instant, reliable on-disk & admin accessible)
  const storeOrderRecord: StoreOrder = {
    id: "ord-" + Date.now(),
    orderNumber: generatedOrderNumber,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerAddress: data.customerAddress,
    customerCity: data.customerCity,
    paymentMethod: data.paymentMethod || "COD",
    notes: data.notes || undefined,
    total: data.total,
    status: "PENDING",
    items: data.items,
    createdAt: new Date().toISOString(),
  };
  saveStoreOrder(storeOrderRecord);

  // 2. Also save to Supabase Database with full line items linked to products
  try {
    const trackingCode = "TRX-" + generatedOrderNumber.replace(/\D/g, "") + "94";

    const orderItemsData = Array.isArray(data.items) && data.items.length > 0
      ? data.items.map((it) => ({
          productId: String(it.productId || "99"),
          quantity: it.quantity || 1,
          price: it.price || 0,
        }))
      : [];

    await prisma.order.create({
      data: {
        orderNumber: generatedOrderNumber,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        customerCity: data.customerCity,
        paymentMethod: data.paymentMethod || "COD",
        notes: data.notes || null,
        total: data.total,
        status: "PENDING",
        trackingNumber: trackingCode,
        ...(orderItemsData.length > 0
          ? {
              items: {
                create: orderItemsData,
              },
            }
          : {}),
      },
    });
  } catch (error: any) {
    console.warn("Prisma sync notice (order saved to storeManager):", error?.message);
  }

  return {
    success: true,
    orderNumber: generatedOrderNumber,
    message: "Order placed successfully!",
  };
}

export async function trackOrderAction(query: string) {
  const cleanQuery = query.trim().toUpperCase();
  if (!cleanQuery) return { success: false, message: "Please provide an order reference or phone number." };

  const rawDigits = query.replace(/\D/g, "");

  // 1. Check Store Manager
  const localOrders = getStoreOrders();
  const matchedLocal = localOrders.find((o) => {
    // Match by full Order Number (e.g. AUR-928104) or digits only (e.g. 928104)
    if (o.orderNumber.toUpperCase() === cleanQuery) return true;
    const orderDigits = o.orderNumber.replace(/\D/g, "");
    if (rawDigits.length >= 5 && orderDigits === rawDigits) return true;

    // Match by Phone Number (handles 03001234567, +923001234567, 0300 1234567)
    const oPhoneDigits = o.customerPhone.replace(/\D/g, "");
    if (rawDigits.length >= 7 && (oPhoneDigits.includes(rawDigits) || rawDigits.includes(oPhoneDigits))) {
      return true;
    }
    return o.customerPhone.includes(query.trim());
  });

  if (matchedLocal) {
    return {
      success: true,
      order: {
        orderNumber: matchedLocal.orderNumber,
        customerName: matchedLocal.customerName,
        customerPhone: matchedLocal.customerPhone,
        customerAddress: matchedLocal.customerAddress,
        customerCity: matchedLocal.customerCity,
        paymentMethod: matchedLocal.paymentMethod,
        total: matchedLocal.total,
        status: matchedLocal.status,
        items: matchedLocal.items || [],
        notes: matchedLocal.notes || null,
        trackingNumber: "TRX-" + matchedLocal.orderNumber.replace(/[^0-9]/g, "") + "94",
        createdAt: matchedLocal.createdAt,
      },
    };
  }

  // 2. Check Prisma Database
  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: { equals: query.trim(), mode: "insensitive" } },
          { customerPhone: { contains: query.trim() } },
        ],
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (order) {
      return {
        success: true,
        order: {
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerAddress: order.customerAddress,
          customerCity: order.customerCity,
          paymentMethod: order.paymentMethod,
          total: Number(order.total),
          status: order.status,
          items: (order.items || []).map((it) => ({
            productId: it.productId,
            name: it.product?.title || "Signature Extrait",
            price: Number(it.price),
            quantity: it.quantity,
          })),
          notes: order.notes || null,
          trackingNumber: order.trackingNumber || "TRX-" + Math.floor(10000000 + Math.random() * 90000000),
          createdAt: order.createdAt.toISOString(),
        },
      };
    }
  } catch (error: any) {
    console.error("Order tracking database notice:", error?.message);
  }

  return {
    success: false,
    message: "No order found matching your search. Please check your reference number or phone and try again.",
  };
}


