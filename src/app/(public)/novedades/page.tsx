import { BlogPostService } from "@/server/services/blog-post.service";
import { mapBlogPostToUI } from "@/domain/mappers/mapBlogPostToUI";
import { QueryBlogPostDTO } from "@/dtos/blog/query-blog-post.dto";
import { BlogPostCard } from "@/components/shared/BlogPostCard/BlogPostCard";
import { CategorySidebar } from "@/components/shared/CategorySidebar/CategorySidebar";
import { CategoryPills } from "@/components/shared/CategoryPills/CategoryPills";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/config";
import { getCategoryMeta } from "@/lib/blogCategories";

export const metadata: Metadata = {
  title: "Novedades Inmobiliarias | Riquelme Propiedades",
  description:
    "Novedades, guías y análisis del mercado inmobiliario en General Roca y Río Negro. Información actualizada sobre inversiones, normativas y tendencias.",
  alternates: {
    canonical: getCanonicalUrl("/novedades"),
  },
  openGraph: {
    title: "Novedades Inmobiliarias | Riquelme Propiedades",
    description:
      "Novedades, guías y análisis del mercado inmobiliario en General Roca y Río Negro.",
    url: "/novedades",
    type: "website",
  },
};

const POSTS_PER_PAGE = 9;

interface Props {
  searchParams: Promise<{ categoria?: string; pagina?: string }>;
}

export default async function NovedadesPage({ searchParams }: Props) {
  const { categoria, pagina } = await searchParams;
  const category = categoria || undefined;
  const page = pagina ? parseInt(pagina, 10) : 1;

  // ── Si hay categoría activa ──────────────────────────────
  if (category) {
    const meta = getCategoryMeta(category);
    if (!meta) return null;

    const { items } = await BlogPostService.findAll(
      new QueryBlogPostDTO({ category, page, limit: POSTS_PER_PAGE })
    );
    const postsUI = items.map(mapBlogPostToUI);

    return (
      <div className="min-h-screen bg-white">
        {/* ── Category header ── */}
        <section className="pt-16 sm:pt-20 bg-neutral-50">
          <div className="max-w-6xl mx-auto px-4 py-10 sm:pb-12 sm:pt-24">
            <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-4">
              <Link href="/novedades" className="hover:text-primary transition-colors">Inicio</Link>
              <span>/</span>
              <Link href="/novedades" className="hover:text-primary transition-colors">Novedades</Link>
              <span>/</span>
              <span className="text-neutral-600">{meta.label}</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-montserrat mb-3 text-neutral-900">{meta.label}</h1>
            <p className="text-neutral-600 text-base max-w-xl">{meta.description}</p>
          </div>
        </section>

        {/* ── Category pills ── */}
        <div id="category-pills" className="sticky top-16 lg:top-[120px] z-10 bg-white border-b border-neutral-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4">
            <CategoryPills activeCategory={category} />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* ── Main ── */}
            <div className="flex-1 min-w-0">
              {postsUI.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {postsUI.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">📭</div>
                  <p className="text-lg text-neutral-500">No hay publicaciones en {meta.label} todavía.</p>
                  <Link href="/novedades" className="text-sm text-primary hover:underline mt-2 inline-block">
                    Ver todas las novedades
                  </Link>
                </div>
              )}

              {items.length === POSTS_PER_PAGE && (
                <div className="text-center mt-8">
                  <Link
                    href={`/novedades?categoria=${category}&pagina=${page + 1}`}
                    scroll={false}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-colors"
                  >
                    Ver más en {meta.label}
                  </Link>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <aside className="lg:w-72 shrink-0">
              <div className="lg:sticky lg:top-40 space-y-4">
                <CategorySidebar activeCategory={category} />
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  // ── Vista principal: todas las novedades ───────────────
  const { items, meta } = await BlogPostService.findAll(
    new QueryBlogPostDTO({ page, limit: POSTS_PER_PAGE })
  );

  const [featured, ...rest] = items;
  const featuredUI = featured ? mapBlogPostToUI(featured) : null;
  const postsUI = rest.map(mapBlogPostToUI);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero con imagen de fondo ── */}
      <section className="relative overflow-hidden pt-20 sm:pt-24 md:pt-28 pb-2 sm:pb-4">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001d3d]/80 via-[#001d3d]/60 to-[#001d3d]/90" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e6b255] via-[#d4a045] to-[#e6b255]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 md:py-16 text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative w-20 h-8 sm:w-28 sm:h-10">
              <Image
                src="/logo-blanco.webp"
                alt="Riquelme Propiedades"
                fill
                className="object-contain object-center brightness-150"
              />
            </div>
          </div>

          <p className="font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] mb-2 sm:mb-3 text-[#e6b255]">
            Blog inmobiliario
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 sm:mb-4 uppercase tracking-tight text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
            Novedades<br className="hidden sm:block" /> Inmobiliarias
          </h1>
          <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-white/80">
            Análisis del mercado, guías prácticas y noticias para tomar las mejores decisiones inmobiliarias en General Roca y Río Negro.
          </p>

          <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6">
            <div className="w-8 h-px bg-[#e6b255]" />
            <div className="w-2 h-2 rounded-full bg-[#e6b255]" />
            <div className="w-8 h-px bg-[#e6b255]" />
          </div>
        </div>
      </section>

      {/* ── Category pills ── */}
      <div id="category-pills" className="sticky top-16 lg:top-[120px] z-10 bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <CategoryPills />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            {featuredUI && (
              <div className="mb-8 sm:mb-10">
                <BlogPostCard post={featuredUI} featured priority />
              </div>
            )}

            {postsUI.length > 0 && (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-wider">
                    Últimas publicaciones
                  </h2>
                  <div className="flex-1 h-px bg-neutral-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {postsUI.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              </>
            )}

            {meta.pages > 1 && (
              <div className="flex justify-center items-center mt-10 gap-2">
                {/* Previous arrow */}
                {page > 1 && (
                  <Link
                    href={page === 2 ? "/novedades" : `/novedades?pagina=${page - 1}`}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-gold-sand/10 hover:border-gold-sand hover:text-gold-sand transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 18-6-6 6-6"/>
                    </svg>
                  </Link>
                )}

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(meta.pages, 7) }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={p === 1 ? "/novedades" : `/novedades?pagina=${p}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-gold-sand border-gold-sand text-oxford"
                          : "border-neutral-200 text-neutral-700 hover:bg-gold-sand/10 hover:border-gold-sand hover:text-gold-sand"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>

                {/* Next arrow */}
                {page < meta.pages && (
                  <Link
                    href={`/novedades?pagina=${page + 1}`}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-gold-sand/10 hover:border-gold-sand hover:text-gold-sand transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-40 space-y-6">
              {/* Branding widget */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#001d3d] to-[#002b5c] p-6 shadow-lg">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e6b255] via-[#d4a045] to-[#e6b255]" />

                <div className="mb-4">
                  <div className="relative w-32 h-12">
                    <Image
                      src="/logo-blanco.webp"
                      alt="Riquelme Propiedades"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e6b255] mb-1">
                    Tu inmobiliaria de confianza
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-white/50">
                    General Roca · Río Negro
                  </p>
                </div>

                <p className="text-sm text-white/80 leading-relaxed mb-5">
                  Asesoría personalizada para comprar, vender o alquilar tu próxima propiedad en el Alto Valle de Río Negro.
                </p>

                <Link
                  href="/contacto"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#e6b255] text-[#001d3d] text-xs font-bold uppercase tracking-wider hover:bg-[#d4a045] transition-colors"
                >
                  Contactanos
                </Link>

                <a
                  href="https://wa.me/5492984582082?text=Hola!%20Me%20contacto%20desde%20la%20web."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 mt-2 rounded-xl border border-white/30 text-white/80 text-xs font-medium hover:bg-white/10 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>

              <CategorySidebar total={meta.total} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
