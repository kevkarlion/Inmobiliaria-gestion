// app/page.tsx  (SIN "use client")
import Hero from "@/components/home/Hero/Hero";

import ContainerCardsMain from "@/components/ContainerCardsMain/ContainerCardsMain";
import AboutPreview from "@/components/home/AboutPreview/AboutPreview";

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-white font-montserrat">
      <Hero />
      <ContainerCardsMain />
    <AboutPreview />
    </main>
  );
}
