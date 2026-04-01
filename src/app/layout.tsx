import type { Metadata, Viewport } from "next";
import { Montserrat, Lora, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Analytics from "@/components/shared/Analytics";

const GA_ID = "G-V2PZYEK8YQ";

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

export const metadata: Metadata = {
  title: "Riquelme Propiedades",
  description: "Inmobiliaria - Venta y Alquiler de Propiedades",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
      suppressHydrationWarning
    >
      <body className="antialiased overflow-x-hidden max-w-full">
        
        {/* 🔥 Tracker de navegación */}
        <Analytics />

        {children}

        {/* 🔥 Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}