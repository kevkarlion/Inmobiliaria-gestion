import Hero from "@/components/home/Hero/Hero";
import ContainerCardsMain from "@/components/ContainerCardsMain/ContainerCardsMain";
import AboutPreview from "@/components/home/AboutPreview/AboutPreview";

export default async function HomePage() {
  return (
    // Quitamos bg-white de aquí para que el Hero pueda ver el fondo del layout
    <main className="min-h-screen">
      
      {/* El Hero es transparente por dentro */}
      <Hero />

      {/* A partir de aquí, las secciones "tapan" el fondo del layout con su propio color */}
      <div className="bg-white relative z-10">
        <ContainerCardsMain />
        <AboutPreview />
      </div>
      
    </main>
  );
}