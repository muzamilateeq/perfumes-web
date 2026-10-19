"use server";

import { 
  getStoreProducts, 
  saveStoreProduct, 
  deleteStoreProduct,
  getStoreSettings, 
  saveStoreSettings, 
  getStoreOrders, 
  updateStoreOrderStatus,
  updateStoreProductStock,
  StoreSettings,
  StoreOrder
} from "@/lib/storeManager";
import { PerfumeItem } from "@/lib/perfumes";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const ADMIN_SESSION_COOKIE = "aura_admin_session";
const SESSION_TOKEN = "aura_auth_verified_session_token_2026";

export async function loginAdminAction(formData: { email: string; password: string }) {
  try {
    const { email, password } = formData;
    const cleanEmail = (email || "").trim().toLowerCase();
    const envEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase().replace(/^["']|["']$/g, "");
    
    // Valid authorized admin emails
    const validEmails = [
      "muzamilateeq423@gmail.com",
      envEmail
    ].filter(Boolean);

    // Clean and normalize passwords
    const cleanInputPass = (password || "").trim();
    const envPass = (process.env.ADMIN_PASSWORD || "").trim().replace(/^["']|["']$/g, "");

    // Valid authorized admin passwords (supports both Muzamil@aura and Muzamil@001%$)
    const validPasswords = [
      "Muzamil@aura",
      "Muzamil@001%$",
      envPass
    ].filter(Boolean);

    const isEmailValid = validEmails.includes(cleanEmail);
    const isPasswordValid = 
      validPasswords.includes(password) || 
      validPasswords.includes(cleanInputPass);

    if (isEmailValid && isPasswordValid) {
      const cookieStore = await cookies();
      cookieStore.set(ADMIN_SESSION_COOKIE, SESSION_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      revalidatePath("/admin");
      return { success: true };
    }

    return {
      success: false,
      error: "Invalid email or password. Please verify your credentials.",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "An error occurred during authentication",
    };
  }
}

export async function logoutAdminAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_SESSION_COOKIE);
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    return session?.value === SESSION_TOKEN;
  } catch {
    return false;
  }
}

export async function getAdminDataAction() {
  try {
    const products = getStoreProducts();
    const settings = getStoreSettings();
    const orders = getStoreOrders();

    return {
      success: true,
      products,
      settings,
      orders,
    };
  } catch (error: any) {
    console.error("Admin data fetch error:", error);
    return {
      success: false,
      error: error?.message || "Failed to load admin data",
      products: [],
      settings: null,
      orders: [],
    };
  }
}

export async function saveProductAction(product: PerfumeItem) {
  try {
    // Format numeric price
    const priceNum = typeof product.priceNum === "number" ? product.priceNum : parseInt(String(product.priceNum).replace(/[^0-9]/g, "")) || 0;
    const priceFormatted = product.price.startsWith("PKR") ? product.price : `PKR ${priceNum.toLocaleString()}`;

    const chosenImage = (product.image || product.bannerImage || "/banners/oud-royale.png").trim();
    const rawImages = Array.isArray(product.images) && product.images.length > 0
      ? product.images.filter(Boolean)
      : [chosenImage];
    const primaryImg = rawImages[0] || chosenImage;

    const updatedProduct: PerfumeItem = {
      ...product,
      image: primaryImg,
      bannerImage: primaryImg,
      images: rawImages,
      priceNum,
      price: priceFormatted,
      stock: product.stock !== undefined ? product.stock : 50,
      batchNumber: product.batchNumber || "AUR-B26/01",
      maturation: product.maturation || "6 Months Cold Matured Extrait",
      lowStockAlert: product.lowStockAlert !== undefined ? product.lowStockAlert : 5,
      slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    };

    const res = saveStoreProduct(updatedProduct);

    // Also sync to Supabase Database
    try {
      await prisma.product.upsert({
        where: { id: String(res.product.id) },
        update: {
          title: res.product.name,
          description: res.product.description || res.product.story || "",
          price: priceNum,
          stock: updatedProduct.stock,
          batchNumber: updatedProduct.batchNumber,
          maturation: updatedProduct.maturation,
          lowStockAlert: updatedProduct.lowStockAlert,
          images: rawImages,
        },
        create: {
          id: String(res.product.id),
          title: res.product.name,
          description: res.product.description || res.product.story || "",
          price: priceNum,
          stock: updatedProduct.stock,
          batchNumber: updatedProduct.batchNumber,
          maturation: updatedProduct.maturation,
          lowStockAlert: updatedProduct.lowStockAlert,
          images: rawImages,
          businessId: "biz-aura",
        },
      });
    } catch (dbErr: any) {
      console.warn("Prisma product sync notice:", dbErr?.message);
    }

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/perfumes");
    revalidatePath("/perfumes/[slug]", "page");
    revalidatePath(`/perfumes/${updatedProduct.slug}`);

    return {
      success: true,
      product: res.product,
      message: "Product updated successfully!",
    };
  } catch (error: any) {
    console.error("Error saving product:", error);
    return {
      success: false,
      error: error?.message || "Failed to save product",
    };
  }
}

export async function updateProductStockAction(id: number, newStock: number) {
  try {
    updateStoreProductStock(id, newStock);

    try {
      await prisma.product.update({
        where: { id: String(id) },
        data: { stock: Math.max(0, newStock) },
      });
    } catch (e: any) {
      console.warn("Prisma stock update notice:", e?.message);
    }

    revalidatePath("/admin");
    revalidatePath("/perfumes");
    revalidatePath("/perfumes/[slug]", "page");
    return { success: true, newStock, message: `Stock updated to ${newStock} units` };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update stock" };
  }
}

export async function deleteProductAction(id: number) {
  try {
    const success = deleteStoreProduct(id);

    // Also delete from Supabase Database
    try {
      await prisma.product.delete({
        where: { id: String(id) },
      });
    } catch (dbErr: any) {
      console.warn("Prisma product delete notice:", dbErr?.message);
    }

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/perfumes");
    return {
      success,
      message: success ? "Product deleted successfully" : "Failed to delete product",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to delete product",
    };
  }
}

export async function saveSettingsAction(settings: Partial<StoreSettings>) {
  try {
    const updated = saveStoreSettings(settings);
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/discovery");
    revalidatePath("/about");
    revalidatePath("/perfumes/[slug]", "page");

    return {
      success: true,
      settings: updated,
      message: "Store settings saved successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to save settings",
    };
  }
}

export async function updateOrderStatusAction(orderNumber: string, status: StoreOrder["status"]) {
  try {
    const res = updateStoreOrderStatus(orderNumber, status);

    // Also sync updated status to Supabase Database
    try {
      const mappedStatus = status === "CONFIRMED" ? "PAID" : status;
      await prisma.order.update({
        where: { orderNumber },
        data: {
          status: mappedStatus as any,
        },
      });
    } catch (dbErr: any) {
      console.warn("Prisma order status update notice:", dbErr?.message);
    }

    revalidatePath("/admin");
    revalidatePath("/track-order");

    return {
      success: res.success,
      order: res.order,
      message: res.success ? `Order status updated to ${status}` : "Order not found",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to update order status",
    };
  }
}
