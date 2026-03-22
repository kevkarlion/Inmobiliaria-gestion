"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BLOG_CATEGORIES } from "@/lib/blogCategories";

interface CategorySidebarProps {
  total?: number;
  activeCategory?: string;
}

export function CategorySidebar({ total, activeCategory }: CategorySidebarProps) {
  const router = useRouter();

  const navigateToCategory = (slug: string) => {
    // Cambia solo los searchParams — misma página, sin transición de ruta
    router.replace(`/novedades?categoria=${slug}`);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-gold-sand/40 to-transparent" />
      <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
        Explorar
      </h3>
      <p className="mb-4 text-sm font-semibold text-neutral-900">Categorías</p>

      <div className="space-y-1.5">
        <Link
          href="/novedades"
          className="group flex items-center justify-between rounded-xl border border-[#e6b255]/20 bg-[#e6b255]/5 px-3 py-2.5 text-sm font-medium text-[#e6b255] transition-all hover:bg-[#e6b255]/10 hover:border-[#e6b255]/30"
        >
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e6b255]/70" />
            Todas las novedades
          </span>
          {total !== undefined && (
            <span className="rounded-full border border-[#e6b255]/20 bg-[#e6b255]/10 px-2 py-0.5 text-[11px] font-semibold text-[#e6b255]">
              {total}
            </span>
          )}
        </Link>

        {BLOG_CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => navigateToCategory(cat.slug)}
            className={`group flex items-center justify-between w-full rounded-xl border px-3 py-2.5 text-sm transition-all ${
              cat.slug === activeCategory
                ? "border-[#e6b255]/20 bg-[#e6b255]/5 text-[#e6b255] font-medium"
                : "border-transparent text-neutral-600 hover:border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  cat.slug === activeCategory ? "bg-[#e6b255]/70" : "bg-neutral-300 group-hover:bg-neutral-400"
                }`}
              />
              {cat.label}
            </span>
            <span
              className={`text-xs transition-transform ${
                cat.slug === activeCategory
                  ? "text-[#e6b255]/70"
                  : "text-neutral-400 group-hover:translate-x-0.5"
              }`}
            >
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
