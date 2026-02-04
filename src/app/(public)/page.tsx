// app/page.tsx  (SIN "use client")
import Hero from "@/components/home/Hero/Hero";
import OportunityHome from "@/components/shared/OportunityHome/OportunityHome";
import SalesHome from "@/components/shared/SalesHome/SalesHome";
import AlquilerHome from "@/components/shared/AlquilerHome/AlquilerHome";

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-white font-montserrat">
      <Hero />
      <OportunityHome />
      <SalesHome />
      <AlquilerHome />
    </main>
  );
}
