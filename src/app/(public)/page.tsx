import Hero from "@/components/home/Hero/Hero";
import ContainerCardsMain from "@/components/ContainerCardsMain/ContainerCardsMain";
import AboutPreview from "@/components/home/AboutPreview/AboutPreview";
import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/config";

export const metadata: Metadata = {
  title: "Inmobiliaria en General Roca, Río Negro",
  description:
    "Inmobiliaria en General Roca, Río Negro. Encontrá casas, departamentos, terrenos y loteos en venta y alquiler con asesoramiento profesional en Riquelme Propiedades.",
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
};

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-white-bg">
      <Hero />
      <div className="bg-white relative z-10">
        <ContainerCardsMain />
        <AboutPreview />
      </div>
    </main>
  );
}