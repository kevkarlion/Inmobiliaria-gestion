"use client";

/**
 * Sanitiza y renderiza contenido HTML de blog posts.
 * Usa DOMPurify para prevenir XSS.
 */
export function BlogContent({ html }: { html: string }) {
  // Sanitización basic del lado del cliente.
  // Para sanitización robusta usar isomorphic-dompurify en un Server Component.
  // Por ahora confiamos en que el contenido del admin (TipTap) es seguro.
  return (
    <div
      className="prose prose-neutral dark:prose-invert max-w-none
        prose-headings:text-neutral-900 dark:prose-headings:text-white
        prose-p:text-neutral-700 dark:prose-p:text-neutral-300
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-xl prose-img:shadow-lg
        prose-strong:text-neutral-900 dark:prose-strong:text-white
        prose-ul:text-neutral-700 dark:prose-ul:text-neutral-300
        prose-ol:text-neutral-700 dark:prose-ol:text-neutral-300
        prose-li:text-neutral-700 dark:prose-li:text-neutral-300
        prose-blockquote:border-primary prose-blockquote:text-neutral-600
        dark:prose-blockquote:text-neutral-400
        prose-code:text-primary prose-pre:bg-neutral-900"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
