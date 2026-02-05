// app/page.tsx  (SIN "use client")
import Hero from "@/components/home/Hero/Hero";

import ContainerCardsMain from "@/components/ContainerCardsMain/ContainerCardsMain";

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-white font-montserrat">
      <Hero />
      <ContainerCardsMain />
  
    </main>
  );
}
