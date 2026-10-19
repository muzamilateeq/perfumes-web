"use server";

import { prisma } from "@/lib/db";
import { getStoreCoupons, saveStoreCoupon, deleteStoreCoupon, StoreCoupon } from "@/lib/storeManager";
import { revalidatePath } from "next/cache";

export interface CouponValidationResult {
  valid: boolean;
  code?: string;
  discountType?: "PERCENT" | "FIXED";
  discountValue?: number;
  discountAmount?: number;
  newTotal?: number;
  message: string;
}

export async function validateCouponAction(
  rawCode: string,
  orderTotal: number
): Promise<CouponValidationResult> {
  const code = (rawCode || "").trim().toUpperCase();

  if (!code) {
    return { valid: false, message: "Please enter a promo code." };
  }

  try {
    // 1. Try Supabase first
    let coupon: any = null;
    try {
      coupon = await prisma.coupon.findUnique({
        where: { code },
      });
    } catch (dbErr) {
      console.warn("Prisma coupon query notice:", dbErr);
    }

    // 2. Fallback to local store
    if (!coupon) {
      const localCoupons = getStoreCoupons();
      coupon = localCoupons.find((c) => c.code.toUpperCase() === code);
    }

    if (!coupon) {
      return {
        valid: false,
        message: `Promo code "${code}" is invalid or does not exist.`,
      };
    }

    if (!coupon.isActive) {
      return {
        valid: false,
        message: `Promo code "${code}" has been deactivated.`,
      };
    }

    // Check expiry
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return {
        valid: false,
        message: `Promo code "${code}" has expired.`,
      };
    }

    // Check max uses
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return {
        valid: false,
        message: `Promo code "${code}" has reached its maximum redemptions.`,
      };
    }

    const minAmount = Number(coupon.minOrderAmount || 0);
    if (orderTotal < minAmount) {
      return {
        valid: false,
        message: `This code requires a minimum order value of PKR ${minAmount.toLocaleString()}.`,
      };
    }

    const discountVal = Number(coupon.discountValue);
    const discountType = (coupon.discountType || "PERCENT") as "PERCENT" | "FIXED";

    let discountAmount = 0;
    if (discountType === "PERCENT") {
      discountAmount = Math.round((orderTotal * discountVal) / 100);
    } else {
      discountAmount = Math.min(discountVal, orderTotal);
    }

    const newTotal = Math.max(0, orderTotal - discountAmount);

    return {
      valid: true,
      code: coupon.code,
      discountType,
      discountValue: discountVal,
      discountAmount,
      newTotal,
      message: `🎉 Promo code "${coupon.code}" applied! You saved PKR ${discountAmount.toLocaleString()}.`,
    };
  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return {
      valid: false,
      message: "An error occurred while validating promo code.",
    };
  }
}

export async function getCouponsAction() {
  try {
    let coupons: any[] = [];
    try {
      coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch {
      coupons = getStoreCoupons();
    }

    if (!coupons || coupons.length === 0) {
      coupons = getStoreCoupons();
    }

    return {
      success: true,
      coupons: coupons.map((c) => ({
        id: c.id,
        code: c.code,
        discountType: c.discountType,
        discountValue: Number(c.discountValue),
        minOrderAmount: Number(c.minOrderAmount || 0),
        maxUses: c.maxUses,
        usedCount: c.usedCount || 0,
        isActive: c.isActive,
        expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString() : null,
      })),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to fetch coupons",
      coupons: [],
    };
  }
}

export async function createCouponAction(data: {
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  expiresAt?: string | null;
}) {
  try {
    const cleanCode = data.code.trim().toUpperCase();
    const id = "cpn-" + Date.now();

    const record: StoreCoupon = {
      id,
      code: cleanCode,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minOrderAmount: data.minOrderAmount || 0,
      maxUses: data.maxUses || null,
      usedCount: 0,
      isActive: true,
      expiresAt: data.expiresAt || null,
    };

    saveStoreCoupon(record);

    try {
      await prisma.coupon.upsert({
        where: { code: cleanCode },
        update: {
          discountType: data.discountType,
          discountValue: data.discountValue,
          minOrderAmount: data.minOrderAmount || 0,
          maxUses: data.maxUses || null,
          isActive: true,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        },
        create: {
          id,
          code: cleanCode,
          discountType: data.discountType,
          discountValue: data.discountValue,
          minOrderAmount: data.minOrderAmount || 0,
          maxUses: data.maxUses || null,
          usedCount: 0,
          isActive: true,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        },
      });
    } catch (e: any) {
      console.warn("Prisma coupon create notice:", e?.message);
    }

    revalidatePath("/admin");
    return { success: true, coupon: record, message: `Promo code ${cleanCode} created successfully!` };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to create coupon" };
  }
}

export async function deleteCouponAction(id: string) {
  try {
    deleteStoreCoupon(id);

    try {
      await prisma.coupon.delete({
        where: { id },
      });
    } catch (e: any) {
      console.warn("Prisma coupon delete notice:", e?.message);
    }

    revalidatePath("/admin");
    return { success: true, message: "Coupon deleted successfully" };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete coupon" };
  }
}

export async function toggleCouponStatusAction(id: string, isActive: boolean) {
  try {
    const coupons = getStoreCoupons();
    const target = coupons.find((c) => c.id === id);
    if (target) {
      target.isActive = isActive;
      saveStoreCoupon(target);
    }

    try {
      await prisma.coupon.update({
        where: { id },
        data: { isActive },
      });
    } catch (e: any) {
      console.warn("Prisma coupon toggle notice:", e?.message);
    }

    revalidatePath("/admin");
    return { success: true, message: `Coupon is now ${isActive ? "Active" : "Deactivated"}` };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update coupon status" };
  }
}
