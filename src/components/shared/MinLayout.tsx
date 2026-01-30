import React, { ReactNode } from "react";
import Navbar from "@/components/shared/Navbar/Narbar";
import Footer from "@/components/shared/Footer/Footer";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}
