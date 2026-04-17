import Hero from "@/components/home/Hero/Hero";
import ContainerCardsMain from "@/components/ContainerCardsMain/ContainerCardsMain";
import AboutPreview from "@/components/home/AboutPreview/AboutPreview";
import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Inmobiliaria Riquelme | Casas, Departamentos y Terrenos en Venta en General Roca",
  description:
    "Encontrá tu próximo hogar en General Roca. Casas, departamentos y terrenos en venta con asesoramiento profesional. ¡ Tasación gratis !",
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