import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getUiProperties } from "@/components/server/data-access/get-ui-properties";

export type PropertyQuery = {
  operationType?: "venta" | "alquiler";
  propertyType?: string;
  province?: string;
  city?: string;
};

type RelatedCategory = {
  title: string;
  href: string;
  query: PropertyQuery;
};

type RelatedCategoriesProps = {
  categories: RelatedCategory[];
  title?: string;
  /** href de la categoría actual para excluirla de las cards relacionadas */
  currentHref?: string;
};

/**
 * Server component que muestra cards visuales de categorías relacionadas,
 * usando la imagen de una propiedad real de cada categoría como fondo.
 */
export default async function RelatedCategories({
  categories,
  title = "Otras categorías de propiedades",
  currentHref,
}: RelatedCategoriesProps) {
  const related = categories.filter((cat) => cat.href !== currentHref);

  if (related.length === 0) return null;

  const cards = await Promise.all(
    related.map(async (cat) => {
      let image: string | null = null;
      try {
        const items = await getUiProperties({ ...cat.query, limit: 1 });
        const firstImage =
          items[0]?.images?.[0] || items[0]?.imagesDesktop?.[0] || null;
        image = firstImage || null;
      } catch {
        image = null;
      }
      return { ...cat, image };
    })
  );

  return (
    <section className="max-w-6xl mx-auto px-4 py-14">
      <div className="flex items-end justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-montserrat font-black uppercase tracking-tight text-oxford italic">
          {title}
        </h2>
        <div className="h-px bg-black/10 flex-1 ml-6 mb-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group relative block rounded-3xl overflow-hidden aspect-[4/3] shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Imagen de fondo */}
            {cat.image ? (
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-oxford">
                <span className="text-5xl">🏠</span>
              </div>
            )}

            {/* Gradiente overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Contenido */}
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-white font-montserrat font-bold text-lg leading-tight">
                  {cat.title}
                </h3>
                <span className="w-9 h-9 shrink-0 rounded-full bg-gold-sand flex items-center justify-center text-oxford group-hover:bg-white transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}