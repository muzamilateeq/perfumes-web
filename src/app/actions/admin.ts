"use server";

import { 
  getStoreProducts, 
  saveStoreProduct, 
  deleteStoreProduct,
  getStoreSettings, 
  saveStoreSettings, 
  getStoreOrders, 
  updateStoreOrderStatus,
  StoreSettings,
  StoreOrder
} from "@/lib/storeManager";
import { PerfumeItem } from "@/lib/perfumes";
import { revalidatePath } from "next/cache";

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

    const updatedProduct: PerfumeItem = {
      ...product,
      priceNum,
      price: priceFormatted,
      slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    };

    const res = saveStoreProduct(updatedProduct);
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/perfumes");
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

export async function deleteProductAction(id: number) {
  try {
    const success = deleteStoreProduct(id);
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
