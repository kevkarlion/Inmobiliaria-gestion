import { describe, it, expect } from "vitest";
import { buildBreadcrumbListSchema } from "@/lib/seo/schemas/breadcrumbList";

describe("buildBreadcrumbListSchema", () => {
  it("returns BreadcrumbList with correct @type", () => {
    const items = [
      { name: "Inicio", item: "https://riquelmeprop.com/" },
    ];
    const result = buildBreadcrumbListSchema(items);
    expect(result["@type"]).toBe("BreadcrumbList");
  });

  it("includes itemListElement with correct positions", () => {
    const items = [
      { name: "Inicio", item: "https://riquelmeprop.com/" },
      { name: "Propiedades", item: "https://riquelmeprop.com/propiedades" },
      { name: "Casa Moderna", item: "https://riquelmeprop.com/propiedad/casa-moderna" },
    ];
    const result = buildBreadcrumbListSchema(items);
    expect(result.itemListElement).toHaveLength(3);
    expect(result.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: "https://riquelmeprop.com/",
    });
    expect(result.itemListElement[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "Propiedades",
      item: "https://riquelmeprop.com/propiedades",
    });
    expect(result.itemListElement[2]).toEqual({
      "@type": "ListItem",
      position: 3,
      name: "Casa Moderna",
      item: "https://riquelmeprop.com/propiedad/casa-moderna",
    });
  });

  it("works with empty items array", () => {
    const result = buildBreadcrumbListSchema([]);
    expect(result.itemListElement).toEqual([]);
  });

  it("omits item property when item string is empty (current page)", () => {
    const items = [
      { name: "Inicio", item: "https://riquelmeprop.com/" },
      { name: "Propiedades", item: "" },
    ];
    const result = buildBreadcrumbListSchema(items);
    expect(result.itemListElement[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "Propiedades",
    });
    expect(result.itemListElement[1]).not.toHaveProperty("item");
  });
});
