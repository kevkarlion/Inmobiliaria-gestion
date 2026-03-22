import { describe, it, expect } from "vitest";
import { QueryBlogPostDTO } from "@/dtos/blog/query-blog-post.dto";

describe("QueryBlogPostDTO", () => {
  it("parsea page y limit correctamente", () => {
    const dto = new QueryBlogPostDTO({ page: "3", limit: "12" });
    expect(dto.page).toBe(3);
    expect(dto.limit).toBe(12);
    expect(dto.skip).toBe(24); // (3-1) * 12
  });

  it("usa defaults para page y limit", () => {
    const dto = new QueryBlogPostDTO({});
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(9);
    expect(dto.skip).toBe(0);
  });

  it("corrige page < 1 a 1", () => {
    const dto = new QueryBlogPostDTO({ page: "-1" });
    expect(dto.page).toBe(1);
  });

  it("corrige limit > 50 a 50", () => {
    const dto = new QueryBlogPostDTO({ limit: "100" });
    expect(dto.limit).toBe(50);
  });

  it("ignora status inválido", () => {
    const dto = new QueryBlogPostDTO({ status: "invalid" });
    expect(dto.status).toBeUndefined();
  });

  it("acepta status draft", () => {
    const dto = new QueryBlogPostDTO({ status: "draft" });
    expect(dto.status).toBe("draft");
  });

  it("acepta status published", () => {
    const dto = new QueryBlogPostDTO({ status: "published" });
    expect(dto.status).toBe("published");
  });

  it("ignora categoría inválida", () => {
    const dto = new QueryBlogPostDTO({ category: "invalida" });
    expect(dto.category).toBeUndefined();
  });

  it("acepta categoría válida", () => {
    const dto = new QueryBlogPostDTO({ category: "inversiones" });
    expect(dto.category).toBe("inversiones");
  });

  it("calcula skip correctamente", () => {
    const dto = new QueryBlogPostDTO({ page: "5", limit: "9" });
    expect(dto.skip).toBe(36); // (5-1) * 9
  });
});
