// layout.tsx (nested layout - no html/body tags, those are in root layout)
import { Suspense } from "react";
import "@/app/globals.css";
import { SITE_URL } from "@/lib/config";
import { PropertyProvider } from "@/context/PropertyContext";
import { Montserrat, Lora, Inter } from "next/font/google";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton/WhatsAppButton";
import { PropertyService } from "@/server/services/property.service";
import { Toaster } from "sonner";
import { PublicBackground } from "@/components/shared/PublicBackground/PublicBackground";
import BlogScrollRestoration from "@/components/shared/BlogScrollRestoration";

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
  metadataBase: new URL(SITE_URL),
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
  alternates: {
    canonical: SITE_URL,
    languages: {
      'es': SITE_URL,
      'en': `${SITE_URL}/en`,
    },
  },
  openGraph: {
    title: "Riquelme Propiedades | Inmobiliaria en General Roca",
    description:
      "Encontrá casas, departamentos, terrenos y loteos en venta y alquiler en General Roca, Río Negro.",
    url: SITE_URL,
    siteName: "Riquelme Propiedades",
    locale: "es_AR",
    alternateLocale: "en_US",
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


export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let menuStructure = null;
  try {
    menuStructure = await PropertyService.getMenuStructure();
  } catch {
    // Si falla la DB (ej. build sin DB), el Navbar usa fallback a links simples
  }

  return (
    <div className={`${montserrat.variable} ${lora.variable} ${inter.variable} min-h-screen`}>
      <PublicBackground />
      <PropertyProvider>
        <Navbar menuStructure={menuStructure} />
        <Suspense fallback={null}>
          <BlogScrollRestoration />
        </Suspense>

        <main className="flex flex-col min-h-screen w-full md:bg-white">
          {children}
        </main>

        <Footer />
        <WhatsAppButton />
        <Toaster 
          position="bottom-right" 
          richColors 
          toastOptions={{
            style: {
              background: '#fff',
              border: '1px solid #e2e8f0',
            },
          }}
        />
      </PropertyProvider>
    </div>
  );
}
