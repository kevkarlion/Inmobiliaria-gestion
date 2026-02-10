import React, { ReactNode } from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen pt-12 lg:pt-36">
      <Navbar />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}
