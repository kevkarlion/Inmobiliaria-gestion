import Link from "next/link";
import { BLOG_CATEGORIES } from "@/lib/blogCategories";

interface CategoryBadgeProps {
  slug: string;
  asLink?: boolean;
  size?: "sm" | "md";
}

const CATEGORY_COLORS: Record<string, string> = {
  "mercado-inmobiliario":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  inversiones:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  guias: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  normativa:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  comunidad:
    "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
};

export function CategoryBadge({ slug, asLink = true, size = "sm" }: CategoryBadgeProps) {
  const colorClass =
    CATEGORY_COLORS[slug] ||
    "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
  const label =
    BLOG_CATEGORIES.find((c) => c.slug === slug)?.label || slug;
  const sizeClass = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1";

  const badge = (
    <span
      className={`inline-block font-semibold rounded-full ${colorClass} ${sizeClass}`}
    >
      {label}
    </span>
  );

  if (!asLink) return badge;

  return (
    <Link href={`/novedades/${slug}`} className="hover:opacity-80 transition-opacity">
      {badge}
    </Link>
  );
}
