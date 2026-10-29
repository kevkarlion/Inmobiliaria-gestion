import Hero from "@/components/home/Hero/Hero";
import ContainerCardsMain from "@/components/ContainerCardsMain/ContainerCardsMain";
import AboutPreview from "@/components/home/AboutPreview/AboutPreview";
import HomeBlogSection from "@/components/home/HomeBlogSection/HomeBlogSection";
import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/config";
import { JsonLd } from "@/lib/seo/jsonLd";
import { buildRealEstateAgentSchema } from "@/lib/seo/schemas/realEstateAgent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Riquelme Propiedades | Inmobiliaria en General Roca",
  description:
    "Venta, alquiler y tasaciones en General Roca y el Alto Valle. Casas, departamentos y terrenos en Río Negro. Asesorate hoy con Riquelme Propiedades.",
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
};

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-white-bg">
      <JsonLd type="RealEstateAgent" data={buildRealEstateAgentSchema()} />

      <Hero />
      <div className="bg-white relative z-10">
        <ContainerCardsMain />
        <AboutPreview />
        <HomeBlogSection />
      </div>
    </main>
  );
}
