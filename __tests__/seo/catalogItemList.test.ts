/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest";
import { buildCatalogItemListSchema } from "@/lib/seo/schemas/itemList";
import { SEO_CONFIG } from "@/lib/seo/config";

type JsonLdResult = Record<string, any>;

describe("buildCatalogItemListSchema", () => {
  it("returns an ItemList", () => {
    const result: JsonLdResult = buildCatalogItemListSchema([]);
    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("ItemList");
    expect(result.numberOfItems).toBe(0);
  });

  it("nests a RealEstateListing inside every ListItem", () => {
    const result: JsonLdResult = buildCatalogItemListSchema([
      { slug: "casa-la-martina-general-roca", title: "Casa en Venta en La Martina" },
    ]);

    expect(result.itemListElement[0]["@type"]).toBe("ListItem");
    expect(result.itemListElement[0].position).toBe(1);
    expect(result.itemListElement[0].item).toEqual({
      "@type": "RealEstateListing",
      name: "Casa en Venta en La Martina",
      url: `${SEO_CONFIG.siteUrl}/propiedad/casa-la-martina-general-roca`,
    });
  });

  it("keeps the position order and the total count", () => {
    const result: JsonLdResult = buildCatalogItemListSchema([
      { slug: "a", title: "A" },
      { slug: "b", title: "B" },
      { slug: "c", title: "C" },
    ]);

    expect(result.numberOfItems).toBe(3);
    expect(result.itemListElement.map((i: JsonLdResult) => i.position)).toEqual([
      1, 2, 3,
    ]);
  });

  it("honours the start position", () => {
    const result: JsonLdResult = buildCatalogItemListSchema(
      [{ slug: "a", title: "A" }],
      10
    );

    expect(result.itemListElement[0].position).toBe(10);
  });
});
