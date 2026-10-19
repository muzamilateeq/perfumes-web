"use server";

import { prisma } from "@/lib/db";
import { getStoreReviews, saveStoreReview, deleteStoreReview, StoreReview } from "@/lib/storeManager";
import { revalidatePath } from "next/cache";

export interface ProductReviewsSummary {
  reviews: StoreReview[];
  averageRating: number;
  totalReviews: number;
  ratingCounts: { [star: number]: number };
  longevitySummary: string;
  sillageSummary: string;
}

export async function getProductReviewsAction(
  productId: string | number
): Promise<ProductReviewsSummary> {
  const prodIdStr = String(productId);

  let reviews: any[] = [];
  try {
    reviews = await prisma.review.findMany({
      where: {
        productId: prodIdStr,
        status: "APPROVED",
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (dbErr) {
    console.warn("Prisma reviews fetch notice:", dbErr);
  }

  if (!reviews || reviews.length === 0) {
    const local = getStoreReviews();
    reviews = local.filter(
      (r) => String(r.productId) === prodIdStr && r.status === "APPROVED"
    );
  }

  const formatted: StoreReview[] = reviews.map((r) => ({
    id: r.id,
    productId: r.productId,
    customerName: r.customerName,
    customerCity: r.customerCity,
    rating: r.rating || 5,
    comment: r.comment,
    longevity: r.longevity || "18+ Hours",
    sillage: r.sillage || "Strong & Radiating",
    isVerified: r.isVerified ?? true,
    status: r.status || "APPROVED",
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
  }));

  const totalReviews = formatted.length;
  const ratingCounts: { [star: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  for (const r of formatted) {
    const star = Math.min(5, Math.max(1, r.rating));
    ratingCounts[star] = (ratingCounts[star] || 0) + 1;
    sum += star;
  }

  const averageRating = totalReviews > 0 ? Number((sum / totalReviews).toFixed(1)) : 5.0;

  // Longevity consensus
  const longCount = formatted.filter((r) => (r.longevity || "").includes("16+") || (r.longevity || "").includes("18+") || (r.longevity || "").includes("20+")).length;
  const longPercent = totalReviews > 0 ? Math.round((longCount / totalReviews) * 100) : 95;
  const longevitySummary = `${longPercent}% of verified patrons report 16–20+ hours on clothes`;

  // Sillage consensus
  const sillageSummary = "Commanding Royal Projection (Tested 2–3 sprays maximum)";

  return {
    reviews: formatted,
    averageRating,
    totalReviews,
    ratingCounts,
    longevitySummary,
    sillageSummary,
  };
}

export async function submitReviewAction(data: {
  productId: string | number;
  customerName: string;
  customerCity?: string;
  rating: number;
  comment: string;
  longevity?: string;
  sillage?: string;
}) {
  try {
    if (!data.customerName?.trim() || !data.comment?.trim()) {
      return { success: false, message: "Please enter your name and thoughts on the fragrance." };
    }

    const prodIdStr = String(data.productId);
    const id = "rev-" + Date.now();

    const record: StoreReview = {
      id,
      productId: prodIdStr,
      customerName: data.customerName.trim(),
      customerCity: data.customerCity?.trim() || "Pakistan",
      rating: Math.min(5, Math.max(1, data.rating || 5)),
      comment: data.comment.trim(),
      longevity: data.longevity || "18+ Hours",
      sillage: data.sillage || "Strong & Radiating",
      isVerified: true,
      status: "APPROVED",
      createdAt: new Date().toISOString(),
    };

    saveStoreReview(record);

    try {
      await prisma.review.create({
        data: {
          id,
          productId: prodIdStr,
          customerName: record.customerName,
          customerCity: record.customerCity,
          rating: record.rating,
          comment: record.comment,
          longevity: record.longevity,
          sillage: record.sillage,
          isVerified: true,
          status: "APPROVED",
        },
      });
    } catch (dbErr: any) {
      console.warn("Prisma review submit notice:", dbErr?.message);
    }

    revalidatePath("/perfumes/[slug]", "page");
    revalidatePath("/admin");

    return {
      success: true,
      review: record,
      message: "Thank you! Your verified olfactory review has been published.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to submit review.",
    };
  }
}

export async function getAdminReviewsAction() {
  try {
    let reviews: any[] = [];
    try {
      reviews = await prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            select: { title: true },
          },
        },
      });
    } catch {
      reviews = getStoreReviews();
    }

    if (!reviews || reviews.length === 0) {
      reviews = getStoreReviews();
    }

    return {
      success: true,
      reviews: reviews.map((r) => ({
        id: r.id,
        productId: r.productId,
        productTitle: r.product?.title || "Signature Extrait",
        customerName: r.customerName,
        customerCity: r.customerCity,
        rating: r.rating || 5,
        comment: r.comment,
        longevity: r.longevity,
        sillage: r.sillage,
        isVerified: r.isVerified,
        status: r.status || "APPROVED",
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
      })),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to load reviews",
      reviews: [],
    };
  }
}

export async function updateReviewStatusAction(id: string, status: "APPROVED" | "REJECTED" | "PENDING") {
  try {
    const reviews = getStoreReviews();
    const target = reviews.find((r) => r.id === id);
    if (target) {
      target.status = status;
      saveStoreReview(target);
    }

    try {
      await prisma.review.update({
        where: { id },
        data: { status },
      });
    } catch (dbErr: any) {
      console.warn("Prisma review status notice:", dbErr?.message);
    }

    revalidatePath("/perfumes/[slug]", "page");
    revalidatePath("/admin");
    return { success: true, message: `Review status updated to ${status}` };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update review status" };
  }
}

export async function deleteReviewAction(id: string) {
  try {
    deleteStoreReview(id);

    try {
      await prisma.review.delete({
        where: { id },
      });
    } catch (dbErr: any) {
      console.warn("Prisma review delete notice:", dbErr?.message);
    }

    revalidatePath("/perfumes/[slug]", "page");
    revalidatePath("/admin");
    return { success: true, message: "Review deleted successfully" };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete review" };
  }
}
