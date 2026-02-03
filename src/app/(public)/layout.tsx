import "@/app/globals.css";
import { Montserrat, Lora, Inter } from "next/font/google";
import MainLayout from "@/components/shared/MinLayout";

// Configuramos las fuentes
const montserrat = Montserrat({ 
  subsets: ["latin"], 
  variable: "--font-montserrat",
  weight: ["700"] 
});

const lora = Lora({ 
  subsets: ["latin"], 
  variable: "--font-lora",
  weight: ["400", "600"] 
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  weight: ["400", "600"] 
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${lora.variable} ${inter.variable}`}>
      <body className="antialiased">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}