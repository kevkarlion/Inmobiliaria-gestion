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

const curatedPosts = [
  {
    _id: "1",
    title: "Zonificación y código urbano en el Alto Valle",
    slug: "zonificacion-y-codigo-urbano",
    excerpt: "Qué tenés que saber antes de comprar o construir.",
    content: "contenido",
    category: "normativa",
    tags: [],
    featuredImage: "/img-1.jpg",
    author: "Riquelme Propiedades",
    publishedAt: new Date("2026-03-08").toISOString(),
    readingTime: 6,
    featuredOnHome: true,
    homeOrder: 1,
  },
  {
    _id: "2",
    title: "Escritura de un inmueble en Río Negro",
    slug: "escritura-inmueble-rio-negro",
    excerpt: "Trámites, costos y plazos.",
    content: "contenido",
    category: "normativa",
    tags: [],
    featuredImage: "/img-2.jpg",
    author: "Riquelme Propiedades",
    publishedAt: new Date("2026-02-25").toISOString(),
    readingTime: 5,
    featuredOnHome: true,
    homeOrder: 2,
  },
];

const latestPosts = [
  {
    _id: "3",
    title: "Crédito hipotecario en Argentina 2026",
    slug: "credito-hipotecario-2026",
    excerpt: "Cómo comprar con crédito.",
    content: "contenido",
    category: "guias",
    tags: [],
    featuredImage: "/img-3.jpg",
    author: "Riquelme Propiedades",
    publishedAt: new Date("2026-03-23").toISOString(),
    readingTime: 4,
    featuredOnHome: false,
    homeOrder: 0,
  },
];

const findHomeFeatured = vi.fn(async () => curatedPosts);
const findAll = vi.fn(async () => ({ items: latestPosts, meta: { total: 1, page: 1, limit: 3, pages: 1 } }));

vi.mock("@/server/services/blog-post.service", () => ({
  BlogPostService: {
    findHomeFeatured: (...args: unknown[]) => findHomeFeatured(...(args as [])),
    findAll: (...args: unknown[]) => findAll(...(args as [])),
  },
}));

import HomeBlogSection from "@/components/home/HomeBlogSection/HomeBlogSection";

describe("HomeBlogSection (curaduría desde el admin)", () => {
  it("muestra solo los artículos seleccionados para la home", async () => {
    const { container } = render(await HomeBlogSection());

    const hrefs = Array.from(container.querySelectorAll("a")).map((a) =>
      a.getAttribute("href")
    );

    expect(hrefs).toContain("/novedades/zonificacion-y-codigo-urbano");
    expect(hrefs).toContain("/novedades/escritura-inmueble-rio-negro");
    expect(hrefs).not.toContain("/novedades/credito-hipotecario-2026");
  });

  it("no enlaza a páginas de categoría, solo a artículos por slug", async () => {
    const { container } = render(await HomeBlogSection());

    const hrefs = Array.from(container.querySelectorAll("a")).map((a) =>
      a.getAttribute("href")
    );

    expect(hrefs.filter((h) => h?.startsWith("/novedades/"))).toEqual([
      "/novedades/zonificacion-y-codigo-urbano",
      "/novedades/escritura-inmueble-rio-negro",
    ]);
  });

  it("consulta los artículos curados por el admin", async () => {
    await HomeBlogSection();

    expect(findHomeFeatured).toHaveBeenCalledWith(3);
  });

  it("cae a los más recientes cuando todavía no hay artículos seleccionados", async () => {
    findHomeFeatured.mockResolvedValueOnce([] as never);

    const { container } = render(await HomeBlogSection());

    const hrefs = Array.from(container.querySelectorAll("a")).map((a) =>
      a.getAttribute("href")
    );

    expect(hrefs).toContain("/novedades/credito-hipotecario-2026");
    expect(findAll).toHaveBeenCalled();
  });
});
