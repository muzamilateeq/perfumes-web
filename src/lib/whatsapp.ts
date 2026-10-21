/**
 * Professional WhatsApp Message & Order Dispatch Utility
 * Aura Haute Parfumerie
 */

export const WHATSAPP_CONFIG = {
  // Official WhatsApp business number for Aura Fragrances (0309 8541632)
  phoneNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923098541632",
  displayNumber: "+92 309 8541632",
  businessName: "Aura Fragrances",
  advisorTitle: "Fragrance Concierge",
  workingHours: "10:00 AM — 11:00 PM PKT",
};

export interface CartItemLike {
  product: {
    id: number;
    name: string;
    price: string;
    priceNum: number;
    volume?: string;
    category?: string;
    concentration?: string;
  };
  quantity: number;
}

export interface CustomerOrderData {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  paymentMethod?: string;
  notes?: string;
}

/**
 * Creates a clean wa.me URL encoded with message
 */
export function buildWhatsAppUrl(message: string, customPhone?: string): string {
  const phone = (customPhone || WHATSAPP_CONFIG.phoneNumber).replace(/[^0-9]/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Formats a luxury cart invoice for WhatsApp dispatch
 */
export function generateCartWhatsAppMessage(
  cart: CartItemLike[],
  totalAmount: number,
  customerData?: CustomerOrderData
): string {
  const lines: string[] = [];

  lines.push("✨ *NEW ORDER INQUIRY — AURA FRAGRANCES* ✨");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━");

  if (customerData?.name) {
    lines.push(`👤 *Client:* ${customerData.name}`);
  }
  if (customerData?.city) {
    lines.push(`🏙️ *City:* ${customerData.city}`);
  }
  if (customerData?.phone) {
    lines.push(`📱 *Contact:* ${customerData.phone}`);
  }
  if (customerData?.address) {
    lines.push(`📍 *Address:* ${customerData.address}`);
  }
  if (customerData?.paymentMethod) {
    lines.push(`💳 *Payment Mode:* ${customerData.paymentMethod === "COD" ? "Cash on Delivery" : "Bank Transfer"}`);
  }

  if (customerData?.name || customerData?.city) {
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━");
  }

  lines.push("🛍️ *SELECTED FLACONS:*");
  cart.forEach((item, index) => {
    const itemTotal = (item.product.priceNum * item.quantity).toLocaleString();
    lines.push(
      `${index + 1}. *${item.product.name}* (x${item.quantity})` +
      (item.product.volume ? ` [${item.product.volume}]` : "") +
      ` — PKR ${itemTotal}`
    );
  });

  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push(`🚚 *Express Delivery:* FREE Nationwide`);
  lines.push(`🎁 *Complimentary Tester:* 2ml Matching Trial Vial`);
  lines.push(`💰 *TOTAL PAYABLE:* *PKR ${totalAmount.toLocaleString()}*`);
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━");

  if (customerData?.notes) {
    lines.push(`📝 *Note:* ${customerData.notes}`);
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━");
  }

  lines.push("Hello! Please confirm my order and share delivery dispatch tracking.");

  return lines.join("\n");
}

export function generateProductWhatsAppMessage(
  product: {
    name: string;
    price: string;
    category: string;
    volume: string;
    concentration: string;
    notes: string;
  },
  options?: { quantity?: number; notes?: string }
): string {
  const lines = [
    "✨ *FLACON ORDER INQUIRY — AURA FRAGRANCES* ✨",
    "━━━━━━━━━━━━━━━━━━━━━━━━━",
    `👑 *Creation:* *${product.name}*` + (options?.quantity && options.quantity > 1 ? ` (x${options.quantity})` : ""),
    `📂 *Family:* ${product.category}`,
    `💎 *Profile:* ${product.concentration}`,
    `📦 *Size:* ${product.volume}`,
    `💵 *Price:* *${product.price}*`,
    `🌿 *Notes:* ${product.notes}`,
    "━━━━━━━━━━━━━━━━━━━━━━━━━",
    "🚚 *Delivery:* Express Courier Delivery Nationwide (COD)",
    "🎁 *Vial:* Free 2ml Tester Included",
  ];

  if (options?.notes) {
    lines.push(`📝 *Note:* ${options.notes}`);
  }

  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("Hello! I would like to order this flacon. Please let me know how soon it can be delivered to my city.");

  return lines.join("\n");
}

/**
 * Formats official order confirmation message with order ID
 */
export function generateConfirmedOrderWhatsAppMessage(
  orderId: string,
  customerData: CustomerOrderData,
  cart: CartItemLike[],
  totalAmount: number
): string {
  const lines = [
    "✅ *OFFICIAL ORDER CONFIRMATION — AURA FRAGRANCES* ✅",
    "━━━━━━━━━━━━━━━━━━━━━━━━━",
    `📋 *Order Reference:* *#${orderId}*`,
    `👤 *Client Name:* ${customerData.name || "Customer"}`,
    `📱 *Mobile / WhatsApp:* ${customerData.phone || "N/A"}`,
    `🏙️ *Destination City:* ${customerData.city || "Pakistan"}`,
    `📍 *Shipping Address:* ${customerData.address || "N/A"}`,
    `💳 *Payment:* ${customerData.paymentMethod === "BANK" ? "Direct Bank Transfer" : "Cash on Delivery (COD)"}`,
    "━━━━━━━━━━━━━━━━━━━━━━━━━",
    "🛍️ *ORDER SUMMARY:*",
  ];

  cart.forEach((item, index) => {
    lines.push(
      `${index + 1}. *${item.product.name}* x${item.quantity} — PKR ${(item.product.priceNum * item.quantity).toLocaleString()}`
    );
  });

  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push(`💰 *Total Payable at Doorstep:* *PKR ${totalAmount.toLocaleString()}*`);
  lines.push(`📦 *Dispatched with:* 2ml Matching Tester Vial`);
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("Hello! I have submitted this order on your website. Please verify and confirm dispatch.");

  return lines.join("\n");
}

/**
 * Formats fragrance consultation inquiry message
 */
export function generateConsultationWhatsAppMessage(topic?: string): string {
  const lines = [
    "🕊️ *BESPOKE SCENT CONSULTATION — AURA FRAGRANCES* 🕊️",
    "━━━━━━━━━━━━━━━━━━━━━━━━━",
    "Hello Aura Concierge,",
    topic 
      ? `I would like personalized advice regarding: *${topic}*.`
      : "I need assistance selecting the ideal Extrait de Parfum for my preference.",
    "",
    "Please recommend the best olfactory creation for me.",
    "━━━━━━━━━━━━━━━━━━━━━━━━━"
  ];

  return lines.join("\n");
}

/**
 * Formats order tracking inquiry message
 */
export function generateOrderTrackingWhatsAppMessage(orderRef?: string): string {
  const lines = [
    "📦 *ORDER STATUS & TRACKING INQUIRY* 📦",
    "━━━━━━━━━━━━━━━━━━━━━━━━━",
    "Hello Aura Team,",
    orderRef 
      ? `I would like to track my order: *#${orderRef}*.`
      : "I would like to track my recent order dispatch status.",
    "",
    "Could you please share my courier tracking number?",
    "━━━━━━━━━━━━━━━━━━━━━━━━━"
  ];

  return lines.join("\n");
}
