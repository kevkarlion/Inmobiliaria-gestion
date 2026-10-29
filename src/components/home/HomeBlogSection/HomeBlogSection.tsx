import Link from "next/link";
import { BlogPostService } from "@/server/services/blog-post.service";
import { mapBlogPostToUI } from "@/domain/mappers/mapBlogPostToUI";
import { QueryBlogPostDTO } from "@/dtos/blog/query-blog-post.dto";
import { BlogPostCard } from "@/components/shared/BlogPostCard/BlogPostCard";

/**
 * Sección "Novedades y Guías" de la home.
 *
 * Muestra únicamente los artículos seleccionados desde /admin/novedades
 * (flag `featuredOnHome`), ordenados por la curaduría del admin
 * (`homeOrder`) y enlazados a su slug real. La cantidad es libre: se
 * muestran todos los seleccionados. Si todavía no hay artículos
 * seleccionados, cae a los 3 más recientes para no dejar la home vacía.
 */
export default async function HomeBlogSection() {
  const curated = await BlogPostService.findHomeFeatured();

  const items =
    curated.length > 0
      ? curated
      : (
          await BlogPostService.findAll(
            new QueryBlogPostDTO({ page: 1, limit: 3 })
          )
        ).items;

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

        {/* Artículos seleccionados (enlazados por slug) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
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
