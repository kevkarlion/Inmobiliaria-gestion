import { describe, it, expect } from "vitest";
import { buildBreadcrumbItems } from "@/lib/seo/breadcrumbs";

describe("buildBreadcrumbItems", () => {
  it("returns items for a simple path with labels", () => {
    const result = buildBreadcrumbItems(
      "/propiedades",
      ["Inicio", "Propiedades"],
      "https://riquelmeprop.com"
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: "Inicio", item: "https://riquelmeprop.com/" });
    expect(result[1]).toEqual({ name: "Propiedades", item: "" });
  });

  it("builds correct URLs for nested path", () => {
    const result = buildBreadcrumbItems(
      "/propiedades/en-venta",
      ["Inicio", "Propiedades", "En Venta"],
      "https://riquelmeprop.com"
    );
    expect(result).toHaveLength(3);
    expect(result[0].item).toBe("https://riquelmeprop.com/");
    expect(result[1].item).toBe("https://riquelmeprop.com/propiedades");
    expect(result[2].item).toBe("");
  });

  it("works with detail page path", () => {
    const result = buildBreadcrumbItems(
      "/propiedad/casa-moderna",
      ["Inicio", "Propiedades", "Casa Moderna"],
      "https://riquelmeprop.com"
    );
    expect(result).toHaveLength(3);
    expect(result[1].item).toBe("https://riquelmeprop.com/propiedades");
    expect(result[2].item).toBe("");
  });

  it("uses default baseUrl from config when not provided", () => {
    const result = buildBreadcrumbItems(
      "/propiedades",
      ["Inicio", "Propiedades"]
    );
    expect(result[0].item).toContain("https://");
    expect(result[0].item).toMatch(/\/$/);
  });

  it("last item is always current page (empty item)", () => {
    const result = buildBreadcrumbItems(
      "/propiedades/en-venta/casas",
      ["Inicio", "Propiedades", "En Venta", "Casas"],
      "https://riquelmeprop.com"
    );
    const last = result[result.length - 1];
    expect(last.item).toBe("");
  });
});
