import { Metadata } from "next";
import SignatureScentClient from "./SignatureScentClient";
import { PERFUMES_DATA } from "@/lib/perfumes";
import { getAdminDataAction } from "@/app/actions/admin";

export const metadata: Metadata = {
  title: "Signature Scent Matcher | Aura Haute Parfumerie",
  description: "Sign your name or monogram and let our AI Olfactory Scribe decipher your calligraphic strokes to reveal your bespoke soulmate flacon.",
  openGraph: {
    title: "Signature Scent Matcher • Aura Haute Parfumerie",
    description: "Discover the extrait de parfum aligned with your personal signature and calligraphic aura.",
  },
};

export default async function SignatureScentPage() {
  let products = PERFUMES_DATA;
  try {
    const adminData = await getAdminDataAction();
    if (adminData?.success && adminData.products && adminData.products.length > 0) {
      products = adminData.products;
    }
  } catch {
    // Fallback to static PERFUMES_DATA
  }

  return <SignatureScentClient initialProducts={products} />;
}
