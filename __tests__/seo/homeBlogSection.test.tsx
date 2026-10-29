// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <div role="img" aria-label={alt} />,
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/server/services/blog-post.service", () => ({
  BlogPostService: {
    findAll: vi.fn(async () => ({
      items: [
        {
          _id: "1",
          title: "Zonificación y Código Urbano",
          slug: "zonificacion-codigo-urbano",
          excerpt: "Qué se puede construir en cada barrio.",
          content: "contenido",
          category: "comunidad",
          tags: [],
          featuredImage: "/img-1.jpg",
          author: "Riquelme Propiedades",
          publishedAt: new Date("2026-03-01").toISOString(),
          readingTime: 4,
        },
        {
          _id: "2",
          title: "Trámites e Impuestos 2026",
          slug: "tramites-e-impuestos-2026",
          excerpt: "Actualización impositiva.",
          content: "contenido",
          category: "normativa",
          tags: [],
          featuredImage: "/img-2.jpg",
          author: "Riquelme Propiedades",
          publishedAt: new Date("2026-02-01").toISOString(),
          readingTime: 5,
        },
        {
          _id: "3",
          title: "Escrituración paso a paso",
          slug: "escrituracion-paso-a-paso",
          excerpt: "Cómo escriturar.",
          content: "contenido",
          category: "guias",
          tags: [],
          featuredImage: "/img-3.jpg",
          author: "Riquelme Propiedades",
          publishedAt: new Date("2026-01-01").toISOString(),
          readingTime: 6,
        },
      ],
      meta: { total: 3, page: 1, limit: 3, pages: 1 },
    })),
  },
}));

import HomeBlogSection from "@/components/home/HomeBlogSection/HomeBlogSection";

describe("HomeBlogSection", () => {
  it("renders the blog section heading", async () => {
    const { container } = render(await HomeBlogSection());

    const headings = Array.from(container.querySelectorAll("h2")).map(
      (h2) => h2.textContent
    );

    expect(headings).toContain("Novedades y Guías Inmobiliarias del Alto Valle");
  });

  it("links the three featured guides", async () => {
    const { container } = render(await HomeBlogSection());

    const hrefs = Array.from(container.querySelectorAll("a")).map((a) =>
      a.getAttribute("href")
    );

    expect(hrefs).toContain("/novedades/comunidad");
    expect(hrefs).toContain("/novedades/normativa");
    expect(hrefs).toContain("/novedades/guias");
  });

  it("renders the three latest posts", async () => {
    const { container } = render(await HomeBlogSection());

    const hrefs = Array.from(container.querySelectorAll("a")).map((a) =>
      a.getAttribute("href")
    );

    expect(hrefs).toContain("/novedades/zonificacion-codigo-urbano");
    expect(hrefs).toContain("/novedades/tramites-e-impuestos-2026");
    expect(hrefs).toContain("/novedades/escrituracion-paso-a-paso");
  });
});
