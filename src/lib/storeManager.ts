import fs from "fs";
import path from "path";
import { PERFUMES_DATA, DISCOVERY_SET_ITEM, PerfumeItem } from "./perfumes";

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

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
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
  curatorNote: "Artisanal Haute Parfumerie engineered for enduring distinction. Formulated in Grasse, France; hand-finished in Karachi, Pakistan."
};

// 1. PRODUCTS MANAGEMENT
export function getStoreProducts(): PerfumeItem[] {
  try {
    ensureDirectoryExists();
    if (!fs.existsSync(PRODUCTS_FILE)) {
      // Seed with initial PERFUMES_DATA
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(PERFUMES_DATA, null, 2), "utf-8");
      return PERFUMES_DATA;
    }
    const content = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : PERFUMES_DATA;
  } catch (error) {
    console.error("Error reading store products:", error);
    return PERFUMES_DATA;
  }
}

export function saveStoreProduct(product: PerfumeItem): { success: boolean; product: PerfumeItem } {
  try {
    ensureDirectoryExists();
    const products = getStoreProducts();
    const existingIndex = products.findIndex((p) => p.id === product.id || p.slug === product.slug);

    if (existingIndex >= 0) {
      products[existingIndex] = { ...products[existingIndex], ...product };
    } else {
      // Generate new ID and slug if not set
      if (!product.id) {
        product.id = Math.max(0, ...products.map((p) => p.id)) + 1;
      }
      if (!product.slug) {
        product.slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      }
      products.push(product);
    }

    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
    return { success: true, product };
  } catch (error) {
    console.error("Error saving store product:", error);
    throw new Error("Failed to save product");
  }
}

export function deleteStoreProduct(id: number): boolean {
  try {
    ensureDirectoryExists();
    const products = getStoreProducts();
    const filtered = products.filter((p) => p.id !== id);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error deleting store product:", error);
    return false;
  }
}

// 2. SETTINGS MANAGEMENT
export function getStoreSettings(): StoreSettings {
  try {
    ensureDirectoryExists();
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_STORE_SETTINGS, null, 2), "utf-8");
      return DEFAULT_STORE_SETTINGS;
    }
    const content = fs.readFileSync(SETTINGS_FILE, "utf-8");
    return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(content) };
  } catch (error) {
    console.error("Error reading store settings:", error);
    return DEFAULT_STORE_SETTINGS;
  }
}

export function saveStoreSettings(settings: Partial<StoreSettings>): StoreSettings {
  try {
    ensureDirectoryExists();
    const current = getStoreSettings();
    const updated = { ...current, ...settings };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return updated;
  } catch (error) {
    console.error("Error saving store settings:", error);
    throw new Error("Failed to save store settings");
  }
}

// 3. ORDERS MANAGEMENT
export function getStoreOrders(): StoreOrder[] {
  try {
    ensureDirectoryExists();
    if (!fs.existsSync(ORDERS_FILE)) {
      // Seed with sample initial luxury orders for administrative preview
      const initialOrders: StoreOrder[] = [
        {
          id: "ord-1",
          orderNumber: "AUR-928104",
          customerName: "Hamza Tariq",
          customerPhone: "03001234567",
          customerAddress: "House 42, Street 7, Phase 6, DHA",
          customerCity: "Karachi",
          paymentMethod: "COD",
          total: 12500,
          status: "CONFIRMED",
          items: [{ productId: 1, name: "Oud Royale (50ml Extrait)", price: 12500, quantity: 1 }],
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
        },
        {
          id: "ord-2",
          orderNumber: "AUR-651920",
          customerName: "Ayesha Farooq",
          customerPhone: "03218765432",
          customerAddress: "Apartment 4B, Gulberg Heights",
          customerCity: "Lahore",
          paymentMethod: "COD",
          notes: "Complimentary luxury gift box requested",
          total: 8200,
          status: "SHIPPED",
          items: [{ productId: 2, name: "Velvet Rose (50ml Extrait)", price: 8200, quantity: 1 }],
          createdAt: new Date(Date.now() - 3600000 * 22).toISOString()
        },
        {
          id: "ord-3",
          orderNumber: "AUR-410982",
          customerName: "Bilal Zubair",
          customerPhone: "03335551234",
          customerAddress: "Sector F-7/2, Street 18",
          customerCity: "Islamabad",
          paymentMethod: "BANK",
          total: 3500,
          status: "DELIVERED",
          items: [{ productId: 99, name: "Discovery Coffret (6 x 5ml)", price: 3500, quantity: 1 }],
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
        }
      ];
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(initialOrders, null, 2), "utf-8");
      return initialOrders;
    }
    const content = fs.readFileSync(ORDERS_FILE, "utf-8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading store orders:", error);
    return [];
  }
}

export function saveStoreOrder(order: StoreOrder): void {
  try {
    ensureDirectoryExists();
    const orders = getStoreOrders();
    const existingIndex = orders.findIndex((o) => o.orderNumber === order.orderNumber);
    if (existingIndex >= 0) {
      orders[existingIndex] = order;
    } else {
      orders.unshift(order);
    }
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving store order:", error);
  }
}

export function updateStoreOrderStatus(
  orderNumber: string,
  status: StoreOrder["status"]
): { success: boolean; order?: StoreOrder } {
  try {
    ensureDirectoryExists();
    const orders = getStoreOrders();
    const index = orders.findIndex((o) => o.orderNumber === orderNumber);
    if (index >= 0) {
      orders[index].status = status;
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
      return { success: true, order: orders[index] };
    }
    return { success: false };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false };
  }
}
