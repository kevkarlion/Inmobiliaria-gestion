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


// layout.tsx
export const metadata = {
  metadataBase: new URL("https://riquelmeprop.com.ar"), // tu dominio real
  title: {
    default: "Riquelme Propiedades | Inmobiliaria en General Roca",
    template: "%s | Riquelme Propiedades",
  },
  description:
    "Riquelme Propiedades es una inmobiliaria en General Roca, Río Negro. Venta y alquiler de casas, departamentos, terrenos y locales comerciales.",
  keywords: [
    "inmobiliaria general roca",
    "casas en venta general roca",
    "alquiler general roca",
    "terrenos en venta rio negro",
    "riquelme propiedades",
  ],
  authors: [{ name: "Riquelme Propiedades" }],
  creator: "Riquelme Propiedades",
  openGraph: {
    title: "Riquelme Propiedades | Inmobiliaria en General Roca",
    description:
      "Encontrá casas, departamentos y terrenos en venta y alquiler en General Roca, Río Negro.",
    url: "https://riquelmeprop.com",
    siteName: "Riquelme Propiedades",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/og-image.png", // 1200x630
        width: 1200,
        height: 630,
        alt: "Riquelme Propiedades",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Riquelme Propiedades",
    description:
      "Inmobiliaria en General Roca, Río Negro. Venta y alquiler de propiedades.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.png",          // 512x512
    shortcut: "/favicon.ico",   // clásico
    apple: "/apple-icon.png",   // 180x180
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};


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
