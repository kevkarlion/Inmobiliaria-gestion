"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ScrollWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div
      ref={ref}
      id="app-scroll"
      className="h-screen overflow-y-auto overscroll-contain pt-12 md:pt-16"
    >
      {children}
    </div>
  );
}
