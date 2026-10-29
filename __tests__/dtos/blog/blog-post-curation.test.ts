import { describe, expect, it } from "vitest";
import { CreateBlogPostDTO } from "@/dtos/blog/create-blog-post.dto";
import { UpdateBlogPostDTO } from "@/dtos/blog/update-blog-post.dto";
import { QueryBlogPostDTO } from "@/dtos/blog/query-blog-post.dto";

const basePayload = {
  title: "Zonificación y código urbano",
  excerpt: "Qué tenés que saber antes de comprar o construir.",
  content: "<p>Contenido del artículo</p>",
  category: "normativa",
};

describe("CreateBlogPostDTO (curaduría de la home)", () => {
  it("desactiva el flag de home por defecto", () => {
    const dto = new CreateBlogPostDTO(basePayload);
    expect(dto.featuredOnHome).toBe(false);
    expect(dto.homeOrder).toBe(0);
  });

  it("acepta el flag y el orden cuando vienen del admin", () => {
    const dto = new CreateBlogPostDTO({
      ...basePayload,
      featuredOnHome: true,
      homeOrder: 2,
    });

    expect(dto.featuredOnHome).toBe(true);
    expect(dto.homeOrder).toBe(2);
  });

  it("normaliza un orden inválido a 0", () => {
    const dto = new CreateBlogPostDTO({
      ...basePayload,
      homeOrder: "abc",
    });

    expect(dto.homeOrder).toBe(0);
  });
});

describe("UpdateBlogPostDTO (curaduría de la home)", () => {
  it("deja el flag sin tocar cuando no viene en el payload", () => {
    const dto = new UpdateBlogPostDTO({ title: "Nuevo título" });
    expect(dto.featuredOnHome).toBeUndefined();
    expect(dto.homeOrder).toBeUndefined();
  });

  it("permite activar y desactivar el flag", () => {
    expect(new UpdateBlogPostDTO({ featuredOnHome: true }).featuredOnHome).toBe(
      true
    );
    expect(
      new UpdateBlogPostDTO({ featuredOnHome: false }).featuredOnHome
    ).toBe(false);
  });

  it("acepta el orden de la home", () => {
    expect(new UpdateBlogPostDTO({ homeOrder: 5 }).homeOrder).toBe(5);
  });
});

describe("QueryBlogPostDTO (filtro de la home)", () => {
  it("filtra solo los destacados en la home", () => {
    expect(new QueryBlogPostDTO({ featuredOnHome: true }).featuredOnHome).toBe(
      true
    );
    expect(
      new QueryBlogPostDTO({ featuredOnHome: "true" }).featuredOnHome
    ).toBe(true);
  });

  it("deja el filtro sin aplicar cuando no viene", () => {
    expect(new QueryBlogPostDTO({}).featuredOnHome).toBeUndefined();
  });
});
