import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPerfumeBySlug, getAllPerfumes, PERFUMES_DATA } from "@/lib/perfumes";
import PerfumeDetailClient from "./PerfumeDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PERFUMES_DATA.map((perfume) => ({
    slug: perfume.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const perfume = getPerfumeBySlug(slug);

  if (!perfume) {
    return {
      title: "Flacon Not Found | Aura Haute Parfumerie",
      description: "The requested extrait de parfum flacon could not be located in our private collection.",
    };
  }

  return {
    title: `${perfume.name} — Extrait de Parfum (30%+ Oil) | Aura`,
    description: `${perfume.name}: ${perfume.description} Features top notes of ${perfume.topNotes}. Free Express Cash on Delivery in Pakistan with complimentary 2ml trial vial.`,
    openGraph: {
      title: `${perfume.name} | Aura Haute Parfumerie`,
      description: perfume.description,
      images: [
        {
          url: perfume.image,
          width: 800,
          height: 1000,
          alt: `${perfume.name} Flacon`,
        },
      ],
    },
  };
}

export default async function PerfumeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const perfume = getPerfumeBySlug(slug);

  if (!perfume) {
    notFound();
  }

  const allPerfumes = getAllPerfumes();
  const relatedPerfumes = allPerfumes.filter((p) => p.slug !== perfume.slug).slice(0, 3);

  return (
    <PerfumeDetailClient 
      perfume={perfume} 
      relatedPerfumes={relatedPerfumes} 
    />
  );
}
