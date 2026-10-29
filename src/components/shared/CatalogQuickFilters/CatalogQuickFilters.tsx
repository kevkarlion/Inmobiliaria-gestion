import Link from "next/link";

/**
 * Barra de filtros rápidos (chips) del catálogo de ventas.
 * Pensada para mobile: desplazamiento horizontal con snap.
 */

export interface QuickFilterChip {
  label: string;
  type?: string;
  city?: string;
}

export const QUICK_FILTER_CHIPS: QuickFilterChip[] = [
  { label: "General Roca", city: "general-roca" },
  { label: "Casas", type: "casa" },
  { label: "Terrenos", type: "terreno" },
  { label: "Departamentos en Pozo", type: "departamento-en-pozo" },
  { label: "Las Grutas", city: "las-grutas" },
];

export function buildQuickFilterHref(chip: QuickFilterChip): string {
  const params = new URLSearchParams();
  if (chip.type) params.set("tipo", chip.type);
  if (chip.city) params.set("ubicacion", chip.city);

  const query = params.toString();
  return query ? `/venta-de-propiedades?${query}` : "/venta-de-propiedades";
}

interface Props {
  activeType?: string;
  activeCity?: string;
}

export default function CatalogQuickFilters({ activeType, activeCity }: Props) {
  return (
    <div className="-mx-4 px-4">
      <div
        className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        aria-label="Filtros rápidos"
      >
        {QUICK_FILTER_CHIPS.map((chip) => {
          const isActive =
            (chip.type !== undefined && chip.type === activeType) ||
            (chip.city !== undefined && chip.city === activeCity);

          return (
            <Link
              key={chip.label}
              href={buildQuickFilterHref(chip)}
              scroll={false}
              className={`shrink-0 snap-start px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition-colors ${
                isActive
                  ? "bg-gold-sand text-oxford border-gold-sand shadow"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-gold-sand hover:text-gold-sand"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {chip.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
