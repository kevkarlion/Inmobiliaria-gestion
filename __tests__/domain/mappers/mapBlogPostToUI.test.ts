import { describe, it, expect } from "vitest";
import { mapBlogPostToUI, calculateReadingTime } from "@/domain/mappers/mapBlogPostToUI";

describe("calculateReadingTime", () => {
  it("devuelve 1 para contenido vacío", () => {
    expect(calculateReadingTime("")).toBe(1);
  });

  it("devuelve 1 para contenido sin palabras", () => {
    expect(calculateReadingTime("<p></p><div></div>")).toBe(1);
  });

  it("calcula reading time basado en palabras (200 palabras = 1 min)", () => {
    const text = Array.from({ length: 200 }, () => "palabra").join(" ");
    expect(calculateReadingTime(text)).toBe(1);
  });

  it("calcula reading time para contenido largo", () => {
    const text = Array.from({ length: 600 }, () => "palabra").join(" ");
    expect(calculateReadingTime(text)).toBe(3);
  });

  it("ignora etiquetas HTML para contar palabras", () => {
    const html = "<h1>Titulo</h1><p>Esto es un parrafo con varias palabras aqui.</p>";
    const result = calculateReadingTime(html);
    expect(result).toBe(1);
  });

  it("redondea hacia arriba correctamente", () => {
    const text = Array.from({ length: 201 }, () => "palabra").join(" ");
    expect(calculateReadingTime(text)).toBe(2);
  });
});

describe("mapBlogPostToUI", () => {
  const basePost = {
    _id: { toString: () => "507f1f77bcf86cd799439011" },
    title: "El mercado inmobiliario en 2026",
    slug: "mercado-inmobiliario-2026",
    excerpt: "Análisis del mercado inmobiliario local.",
    content: "<p>Contenido del artículo.</p>",
    category: "mercado-inmobiliario",
    tags: ["inmuebles", "mercado"],
    featuredImage: "https://example.com/image.jpg",
    author: "Riquelme Propiedades",
    status: "published",
    publishedAt: new Date("2026-03-15T10:00:00Z"),
    readingTime: 3,
    seoTitle: "SEO Title Override",
    seoDescription: "SEO Description Override",
    createdAt: new Date("2026-03-14T09:00:00Z"),
    updatedAt: new Date("2026-03-15T10:00:00Z"),
  };

  it("mapea campos básicos correctamente", () => {
    const result = mapBlogPostToUI(basePost);
    expect(result.id).toBe("507f1f77bcf86cd799439011");
    expect(result.title).toBe("El mercado inmobiliario en 2026");
    expect(result.slug).toBe("mercado-inmobiliario-2026");
    expect(result.excerpt).toBe("Análisis del mercado inmobiliario local.");
  });

  it("resuelve categoryLabel correctamente", () => {
    const result = mapBlogPostToUI(basePost);
    expect(result.categoryLabel).toBe("Mercado Inmobiliario");
    expect(result.categorySlug).toBe("mercado-inmobiliario");
  });

  it("formatea fecha a ISO y larga", () => {
    const result = mapBlogPostToUI(basePost);
    expect(result.publishedAt).toBe("2026-03-15T10:00:00.000Z");
    expect(result.publishedAtFormatted).toBe("15 de marzo de 2026");
  });

  it("calcula readingTime si no viene en el post", () => {
    const post = { ...basePost, readingTime: undefined };
    const result = mapBlogPostToUI(post);
    // "<p>Contenido del artículo.</p>" → ~4 palabras → 1 min
    expect(result.readingTime).toBe(1);
  });

  it("usa fallback para author vacío y default para featuredImage vacío", () => {
    const post = { ...basePost, featuredImage: "", author: "" };
    const result = mapBlogPostToUI(post);
    expect(result.featuredImage).toBe("");
    // Author vacío usa fallback a "Riquelme Propiedades"
    expect(result.author).toBe("Riquelme Propiedades");
  });

  it("devuelve valores por defecto para campos faltantes", () => {
    const minimal = { _id: { toString: () => "123" } };
    const result = mapBlogPostToUI(minimal);
    expect(result.id).toBe("123");
    expect(result.title).toBe("Sin título");
    expect(result.slug).toBe("");
    expect(result.tags).toEqual([]);
    expect(result.publishedAt).toBe("");
    expect(result.readingTime).toBe(1);
  });

  it("maneja post sin publishedAt usando createdAt", () => {
    const post = { ...basePost, publishedAt: null, createdAt: new Date("2026-03-14T09:00:00Z") };
    const result = mapBlogPostToUI(post);
    expect(result.publishedAt).toBe("2026-03-14T09:00:00.000Z");
    expect(result.publishedAtFormatted).toBe("14 de marzo de 2026");
  });

  it("pasa los campos SEO opcionales", () => {
    const result = mapBlogPostToUI(basePost);
    expect(result.seoTitle).toBe("SEO Title Override");
    expect(result.seoDescription).toBe("SEO Description Override");
  });
});
