"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BLOG_CATEGORIES } from "@/lib/blogCategories";

interface CategoryPillsProps {
  activeCategory?: string;
}

export function CategoryPills({ activeCategory }: CategoryPillsProps) {
  const isAllActive = !activeCategory;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Get current active label
  const activeLabel = isAllActive
    ? "Todas"
    : BLOG_CATEGORIES.find((c) => c.slug === activeCategory)?.label || "Todas";

  const navigateToCategory = (slug: string) => {
    // Cambia solo los searchParams — misma página, sin transición de ruta
    router.replace(`/novedades?categoria=${slug}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Desktop: Pills horizontales */}
      <div className="hidden sm:flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
      <Link
        href="/novedades"
        onClick={() => window.scrollTo({ top: 0 })}
        className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            isAllActive
              ? "bg-[#e6b255] text-white shadow-sm"
              : "border border-neutral-200 text-neutral-600 hover:border-[#e6b255] hover:text-[#e6b255] hover:bg-[#e6b255]/5"
          }`}
        >
          Todas
        </Link>

        {BLOG_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => navigateToCategory(cat.slug)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#e6b255] text-white shadow-sm"
                  : "border border-neutral-200 text-neutral-600 hover:border-[#e6b255] hover:text-[#e6b255] hover:bg-[#e6b255]/5"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Mobile: Dropdown select */}
      <div ref={dropdownRef} className="sm:hidden relative py-3">
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 hover:border-[#e6b255] transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#e6b255]" />
            {activeLabel}
          </span>
          <svg
            className={`w-4 h-4 text-neutral-500 transition-transform ${isMobileOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isMobileOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 overflow-hidden">
            <Link
              href="/novedades"
              onClick={() => {
                setIsMobileOpen(false);
                window.scrollTo({ top: 0 });
              }}
              className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                isAllActive
                  ? "bg-[#e6b255]/10 text-[#e6b255] font-semibold"
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
              Todas
            </Link>

            {BLOG_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => {
                    setIsMobileOpen(false);
                    navigateToCategory(cat.slug);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-[#e6b255]/10 text-[#e6b255] font-semibold"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-[#e6b255]" : "bg-neutral-300"}`} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
