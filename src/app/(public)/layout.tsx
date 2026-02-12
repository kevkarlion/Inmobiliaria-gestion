// layout.tsx
import "@/app/globals.css";
import { PropertyProvider } from "@/context/PropertyContext";
import { Montserrat, Lora, Inter } from "next/font/google";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton/WhatsAppButton";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["700"],
});
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "600"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${lora.variable} ${inter.variable}`}
    >
      <body className="bg-oxford overflow-x-hidden">
        <PropertyProvider>
          <Navbar />
          
          {/* Nada raro acá */}
          <main className="flex flex-col">
            {children}
          </main>

          <Footer />
          <WhatsAppButton />
        </PropertyProvider>
      </body>
    </html>
  );
}
