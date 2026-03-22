import Link from "next/link";
import { BlogPostUI } from "@/domain/types/BlogPostUI.types";
import { CategoryBadge } from "@/components/shared/CategoryBadge/CategoryBadge";
import { SafeImage } from "@/components/shared/SafeImage/SafeImage";
import { Clock, Calendar } from "lucide-react";

interface Props {
  post: BlogPostUI;
  featured?: boolean;
  priority?: boolean;
}

export function BlogPostCard({ post, featured = false, priority = false }: Props) {
  if (featured) {
    return (
      <Link href={`/novedades/${post.slug}`} className="group block">
        <article className="relative overflow-hidden rounded-2xl bg-neutral-50 border border-neutral-200 hover:shadow-xl hover:border-primary/30 transition-all duration-300">
          {/* Featured image full-bleed */}
          <div className="relative aspect-[21/9] overflow-hidden">
            <SafeImage
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              fallbackText={post.title}
              darkPlaceholder
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Content over image */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <CategoryBadge slug={post.category} size="md" asLink={false} />
              <h2 className="text-xl md:text-3xl font-bold text-white mt-3 mb-2 leading-tight group-hover:text-gold-sand transition-colors line-clamp-2">
                {post.title}
              </h2>
              <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-4 max-w-3xl">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 text-white/60 text-xs md:text-sm">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {post.publishedAtFormatted}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} />
                  {post.readingTime} min de lectura
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Regular card
  return (
    <Link href={`/novedades/${post.slug}`} className="group block h-full">
      <article className="relative h-full flex flex-col overflow-hidden rounded-xl bg-white border border-neutral-200 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 shrink-0">
          <SafeImage
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            fallbackText={post.title}
          />
          {/* Category badge overlay */}
          <div className="absolute top-3 left-3">
            <CategoryBadge slug={post.category} asLink={false} />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          <h3 className="font-bold text-neutral-900 text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100">
            <time className="text-xs text-neutral-400 flex items-center gap-1">
              <Calendar size={11} />
              {post.publishedAtFormatted}
            </time>
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <Clock size={11} />
              {post.readingTime} min
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
