//novedades/[...segments]/page.tsx
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BlogPostService } from "@/server/services/blog-post.service";
import { mapBlogPostToUI } from "@/domain/mappers/mapBlogPostToUI";
import { getCanonicalUrl } from "@/lib/config";
import { ShareButtons } from "@/components/shared/ShareButtons/ShareButtons";
import { CategoryBadge } from "@/components/shared/CategoryBadge/CategoryBadge";
import { SafeImage } from "@/components/shared/SafeImage/SafeImage";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { BLOG_CATEGORIES } from "@/lib/blogCategories";

interface Props {
  params: Promise<{ segments?: string[] }>;
}

// ─── Dynamic metadata ─────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segments } = await params;

  if (!segments || segments.length === 0) {
    return { title: "Novedades | Riquelme Propiedades" };
  }

  const slug = segments[0];

  // Si es categoría → la página redirige, no necesitamos metadata específica
  if (BLOG_CATEGORIES.some((c) => c.slug === slug)) {
    return { title: "Novedades | Riquelme Propiedades" };
  }

  // Post individual
  if (segments.length === 1) {
    try {
      const post = await BlogPostService.findBySlug(slug);
      const ui = mapBlogPostToUI(post);
      return {
        title: ui.seoTitle || ui.title,
        description: ui.seoDescription || ui.excerpt,
        alternates: { canonical: getCanonicalUrl(`/novedades/${slug}`) },
        openGraph: {
          title: ui.seoTitle || ui.title,
          description: ui.seoDescription || ui.excerpt,
          url: `/novedades/${slug}`,
          type: "article",
          publishedTime: ui.publishedAt,
          images: ui.featuredImage
            ? [{ url: ui.featuredImage, width: 1200, height: 630, alt: ui.title }]
            : [],
        },
      };
    } catch {
      return { title: "Post no encontrado" };
    }
  }

  return { title: "Novedades | Riquelme Propiedades" };
}

// ─── Default export — routing ───────────────────────────────────

export default async function NovedadesSegmentsPage({ params }: Props) {
  const { segments } = await params;

  if (!segments || segments.length === 0) {
    notFound();
  }

  const slug = segments[0];

  // Si es categoría → redirigir a URL con searchParams
  if (BLOG_CATEGORIES.some((c) => c.slug === slug)) {
    redirect(`/novedades?categoria=${slug}`);
  }

  // Post individual
  if (segments.length === 1) {
    return PostView(slug);
  }

  // Categoría con paginación → redirigir a URL con searchParams
  if (segments.length === 3 && segments[1] === "pagina") {
    const category = slug;
    const page = parseInt(segments[2], 10);
    if (isNaN(page) || page < 1) return notFound();
    if (!BLOG_CATEGORIES.some((c) => c.slug === category)) return notFound();
    redirect(`/novedades?categoria=${category}&pagina=${page}`);
  }

  notFound();
}

// ─── Post individual ───────────────────────────────────────────

async function PostView(slug: string) {
  let post;
  try {
    post = await BlogPostService.findBySlug(slug);
  } catch {
    return notFound();
  }

  const ui = mapBlogPostToUI(post);
  const canonicalUrl = getCanonicalUrl(`/novedades/${slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ui.title,
    description: ui.excerpt,
    image: ui.featuredImage,
    author: { "@type": "Organization", name: "Riquelme Propiedades" },
    publisher: {
      "@type": "Organization",
      name: "Riquelme Propiedades",
      logo: { "@type": "ImageObject", url: getCanonicalUrl("/og-image.png") },
    },
    datePublished: ui.publishedAt,
    dateModified: ui.updatedAt || ui.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-white">
        {/* ── Header full-bleed ── */}
        {/* 
          Navbar heights:
          - Mobile/LG below: 64px (h-16) 
          - Desktop LG+: top bar ~72px + nav 64px = ~136px total
          
          We use:
          - Mobile: pt-20 (80px from top) for back button
          - LG+: pt-24 (96px) for back button to clear top bar + nav
        */}
        <header className="relative mb-8 min-h-[63vh] sm:min-h-[60vh] lg:min-h-[85vh] xl:min-h-[85vh] 2xl:min-h-[85vh]">
          {/* Botón Volver debajo del navbar - siempre visible */}
          <div className="absolute top-16 lg:top-[154px] left-3 sm:left-4 z-30">
            <Link
              href="/novedades"
              scroll={false}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-black/50 backdrop-blur-sm text-white/90 text-xs sm:text-sm font-medium hover:bg-black/70 hover:text-white transition-all shadow-lg"
            >
              <ArrowLeft size={14} />
              Volver
            </Link>
          </div>

          {/* Imagen de fondo - cover total */}
          <div className="absolute inset-0 bg-neutral-800">
            <SafeImage
              src={ui.featuredImage}
              alt=""
              fill
              loading="eager"
              className="object-cover"
              fallbackText=""
              darkPlaceholder
            />
          </div>
          
          {/* Gradiente oscuro superpuesto - más suave para mejor legibilidad */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent" />

          {/* Contenido - alineado al fondo con flex, spacing dinámico según navbar */}
          {/* Navbar heights: mobile=64px, laptop/desktop=154px */}
          <div className="absolute inset-0 flex flex-col justify-start pb-6 sm:pb-8 lg:pb-12 pt-24 sm:pt-24 md:pt-24 lg:pt-[195px] xl:pt-[195px] 2xl:pt-[195px] px-4 sm:px-6 lg:px-8 z-10">
            <div className="max-w-4xl mx-auto w-full ">
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <CategoryBadge slug={ui.category} size="sm" />
                <span className="flex items-center gap-1 text-xs text-white/60">
                  <Clock size={11} />
                  {ui.readingTime} min de lectura
                </span>
              </div>
               
              {/* Título - responsive sizing */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-2xl xl:text-4xl font-bold font-montserrat text-white leading-tight mb-2 sm:mb-3 lg:mb-4 max-w-4xl drop-shadow-lg">
                {ui.title}
              </h1>
               
              {/* Excerpt - más legible */}
              <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed mb-3 sm:mb-4 lg:mb-5">
                {ui.excerpt}
              </p>
              
              {/* Author & date */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-white/50">
                <span className="flex items-center gap-1.5">
                  <User size={14} />
                  {ui.author}
                </span>
                {ui.publishedAtFormatted && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {ui.publishedAtFormatted}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ── Share + breadcrumb bar ── */}
        <div className="max-w-4xl mx-auto px-4 pb-6 border-b border-neutral-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3">
            <nav className="flex items-center gap-2 text-xs text-neutral-400">
              <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
              <span>/</span>
              <Link href="/novedades" scroll={false} className="hover:text-primary transition-colors">Novedades</Link>
              <span>/</span>
              <span className="text-neutral-600">{ui.categoryLabel}</span>
            </nav>
            <ShareButtons url={canonicalUrl} title={ui.title} />
          </div>
        </div>

        {/* ── Article body ── */}
        <div className="max-w-4xl mx-auto px-4 py-10 md:py-12">
          <div
            className="prose prose-slate prose-base md:prose-lg max-w-none
              prose-headings:font-montserrat prose-headings:font-bold
              prose-headings:text-neutral-900
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-neutral-700
              prose-p:leading-loose
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-2xl prose-img:shadow-lg prose-img:mx-auto prose-img:w-full
              prose-strong:text-neutral-900
              prose-ul:text-neutral-700
              prose-ol:text-neutral-700
              prose-li:text-neutral-700
              prose-blockquote:border-l-4 prose-blockquote:border-primary
              prose-blockquote:bg-primary/5 prose-blockquote:py-2
              prose-blockquote:px-4 prose-blockquote:rounded-r-lg
              prose-blockquote:text-neutral-600
              prose-blockquote:not-italic
              prose-code:text-primary prose-code:bg-primary/10
              prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-neutral-100 prose-pre:text-neutral-800 prose-pre:rounded-xl"
            dangerouslySetInnerHTML={{ __html: ui.content }}
          />

          {ui.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-neutral-200">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Etiquetas</h3>
              <div className="flex flex-wrap gap-2">
                {ui.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-neutral-100 text-neutral-600 px-3 py-1.5 rounded-full border border-neutral-200">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Branding bio ── */}
          <div className="mt-10 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#001d3d] to-[#002b5c] p-6 shadow-lg">
            {/* Línea dorada decorativa */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e6b255] via-[#d4a045] to-[#e6b255]" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Logo */}
              <div className="relative w-24 h-20 sm:w-32 sm:h-12 shrink-0 flex-shrink-0">
                <Image
                  src="/logo-blanco.webp"
                  alt="Riquelme Propiedades"
                  fill
                  className="object-contain object-center brightness-150"
                />
              </div>

              {/* Info */}
              <div className="text-center sm:text-left flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e6b255] mb-1">
                  {ui.author}
                </p>
                <p className="text-[11px] uppercase tracking-[0.15em] text-white/50 mb-3">
                  General Roca · Río Negro
                </p>
                <p className="text-sm text-white/80 leading-relaxed">
                  Asesoría personalizada para comprar, vender o alquilar tu próxima propiedad en el Alto Valle de Río Negro.
                </p>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Link
                    href="/contacto"
                    className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#e6b255] text-[#001d3d] text-xs font-bold uppercase tracking-wider hover:bg-[#d4a045] transition-colors"
                  >
                    Contactanos
                  </Link>
                  <a
                    href="https://wa.me/5492984582082?text=Hola!%20Me%20contacto%20desde%20la%20web."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-white/30 text-white/80 text-xs font-medium hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/novedades" scroll={false} className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium">
              <ArrowLeft size={14} />
              Volver a todas las novedades
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}


