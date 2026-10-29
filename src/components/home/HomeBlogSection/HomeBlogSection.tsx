import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { BlogPostService } from "@/server/services/blog-post.service";
import { mapBlogPostToUI } from "@/domain/mappers/mapBlogPostToUI";
import { QueryBlogPostDTO } from "@/dtos/blog/query-blog-post.dto";
import { BlogPostCard } from "@/components/shared/BlogPostCard/BlogPostCard";

/**
 * Guías principales del blog enlazadas desde la Home para repartir autoridad
 * hacia los contenidos de intención comercial del Alto Valle.
 */
const FEATURED_GUIDES: { title: string; description: string; href: string }[] = [
  {
    title: "Zonificación y Código Urbano",
    description:
      "Qué permite construir en cada barrio de General Roca, según la zonificación y el código urbano vigente.",
    href: "/novedades/comunidad",
  },
  {
    title: "Trámites e Impuestos 2026",
    description:
      "Actualización de impuestos, tasas y trámites de transferencia para vender o comprar en Río Negro.",
    href: "/novedades/normativa",
  },
  {
    title: "Escrituración",
    description:
      "Guía paso a paso de la escrituración: documentos, gastos, plazos y errores más comunes.",
    href: "/novedades/guias",
  },
];

export default async function HomeBlogSection() {
  const { items } = await BlogPostService.findAll(
    new QueryBlogPostDTO({ page: 1, limit: 3 })
  );

  const posts = items.map(mapBlogPostToUI);

  if (posts.length === 0) return null;

  return (
    <section className="w-full py-20 bg-white-bg border-t border-slate-100">
      <div className="max-w-350 mx-auto px-6">
        {/* Cabecera */}
        <div className="max-w-3xl mx-auto text-center mb-14 space-y-4">
          <h2 className="font-montserrat text-3xl md:text-4xl 2xl:text-5xl font-black text-slate-900 uppercase tracking-tighter">
            Novedades y Guías Inmobiliarias del Alto Valle
          </h2>

          <p className="font-lora text-slate-600 text-sm md:text-lg leading-relaxed italic">
            Análisis del mercado, normativa vigente y guías prácticas para tomar
            decisiones inmobiliarias informadas en General Roca y el Alto Valle.
          </p>

          <div className="flex justify-center items-center gap-3">
            <div className="w-2 h-2 rotate-45 border border-gold-sand bg-gold-sand/20" />
            <div className="w-16 h-px bg-gold-sand/40" />
            <div className="w-2 h-2 rotate-45 border border-gold-sand bg-gold-sand/20" />
          </div>
        </div>

        {/* Últimas publicaciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Guías principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {FEATURED_GUIDES.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="group flex flex-col gap-3 bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-xl hover:border-gold-sand/40 transition-all p-6"
            >
              <span className="flex items-center gap-2 text-gold-sand text-[10px] font-bold uppercase tracking-[0.2em]">
                <BookOpen size={14} />
                Guía
              </span>

              <h3 className="font-montserrat text-lg font-black text-oxford group-hover:text-gold-sand transition-colors">
                {guide.title}
              </h3>

              <p className="text-sm text-blue-gray leading-relaxed flex-1">
                {guide.description}
              </p>

              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-oxford group-hover:text-gold-sand transition-colors">
                Leer la guía
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </Link>
          ))}
        </div>

        <div className="flex justify-center">
          <Link href="/novedades" className="btn-cta bg-oxford">
            Ver todas las novedades
          </Link>
        </div>
      </div>
    </section>
  );
}
