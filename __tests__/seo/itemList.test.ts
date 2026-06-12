/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { buildItemListSchema } from "@/lib/seo/schemas/itemList";
import { SEO_CONFIG } from "@/lib/seo/config";

type JsonLdResult = Record<string, any>;

describe("buildItemListSchema", () => {
  it("returns ItemList with @type", () => {
    const result: JsonLdResult = buildItemListSchema([]);
    expect(result["@type"]).toBe("ItemList");
  });

  it("returns empty itemListElement for empty properties", () => {
    const result: JsonLdResult = buildItemListSchema([]);
    expect(result.itemListElement).toEqual([]);
  });

  it("returns numberOfItems 0 for empty properties", () => {
    const result: JsonLdResult = buildItemListSchema([]);
    expect(result.numberOfItems).toBe(0);
  });

  it("builds itemListElement with correct positions", () => {
    const properties = [
      { slug: "casa-moderna", title: "Casa Moderna" },
      { slug: "departamento-centro", title: "Departamento Centro" },
    ];
    const result: JsonLdResult = buildItemListSchema(properties);
    expect(result.itemListElement).toHaveLength(2);
    expect(result.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      url: `${SEO_CONFIG.siteUrl}/propiedad/casa-moderna`,
      name: "Casa Moderna",
    });
    expect(result.itemListElement[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      url: `${SEO_CONFIG.siteUrl}/propiedad/departamento-centro`,
      name: "Departamento Centro",
    });
  });

  it("uses startPosition when provided", () => {
    const properties = [
      { slug: "casa-moderna", title: "Casa Moderna" },
    ];
    const result: JsonLdResult = buildItemListSchema(properties, 10);
    expect(result.itemListElement[0].position).toBe(10);
  });

  it("returns numberOfItems matching property count", () => {
    const properties = [
      { slug: "a", title: "A" },
      { slug: "b", title: "B" },
      { slug: "c", title: "C" },
    ];
    const result: JsonLdResult = buildItemListSchema(properties);
    expect(result.numberOfItems).toBe(3);
  });
});
