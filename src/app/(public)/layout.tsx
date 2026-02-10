import "@/app/globals.css";
import { PropertyProvider } from "@/context/PropertyContext";
import { Montserrat, Lora, Inter } from "next/font/google";
import ScrollWrapper from "@/components/shared/ScrollWrapper/ScrollWrapper";
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
      className={`${montserrat.variable} ${lora.variable} ${inter.variable} `}
    >
      <body className="">
        <PropertyProvider>
          <Navbar />
          <ScrollWrapper>
            <div className="flex flex-col min-h-dvh">
              
              <main className="flex-1">{children}</main>
              <Footer />
              <WhatsAppButton />
            </div>
          </ScrollWrapper>
        </PropertyProvider>
      </body>
    </html>
  );
}
