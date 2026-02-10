import "@/app/globals.css";
import { PropertyProvider } from "@/context/PropertyContext";
import { Montserrat, Lora, Inter } from "next/font/google";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton/WhatsAppButton";
import Image from "next/image";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", weight: ["700"] });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", weight: ["400", "600"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "600"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${lora.variable} ${inter.variable}`}>
      <body className="antialiased overflow-x-hidden bg-black">
        {/* FONDO FIJO */}
        <div className="fixed inset-0 -z-20">
          <Image
            src="/hero-mobile.webp"
            fill
            sizes="100vw"
            className="object-cover lg:hidden"
            priority
            alt="hero background mobile"
          />
          <Image
            src="/bg-hero.webp"
            fill
            sizes="100vw"
            className="object-cover hidden lg:block"
            priority
            alt="hero background desktop"
          />
        </div>

        {/* ESTRUCTURA PRINCIPAL */}
        <PropertyProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            {children}
            <Footer />
            <WhatsAppButton />
          </div>
        </PropertyProvider>
      </body>
    </html>
  );
}