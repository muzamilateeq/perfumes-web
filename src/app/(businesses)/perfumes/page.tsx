import type { Metadata } from "next";
import { getStoreProducts } from "@/lib/storeManager";
import PerfumesCatalogClient from "./PerfumesCatalogClient";

export const metadata: Metadata = {
  title: "The Artisanal Flacon Collection — Aura Haute Parfumerie",
  description:
    "Explore our complete permanent collection of 6 artisanal Extrait de Parfum flacons. Formulated at 30%+ pure fragrance oil weight with raw botanicals from Grasse, France.",
  openGraph: {
    title: "The Artisanal Flacon Collection — Aura Haute Parfumerie",
    description:
      "Explore our complete permanent collection of 6 artisanal Extrait de Parfum flacons. Formulated at 30%+ pure oil weight.",
    images: ["/banners/oud-royale.png"],
  },
};

export default function PerfumesPage() {
  const products = getStoreProducts();

  return <PerfumesCatalogClient initialProducts={products} />;
}
