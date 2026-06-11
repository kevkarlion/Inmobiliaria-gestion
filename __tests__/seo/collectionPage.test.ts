import { describe, it, expect } from "vitest";
import { buildCollectionPageSchema } from "@/lib/seo/schemas/collectionPage";
import { buildItemListSchema } from "@/lib/seo/schemas/itemList";

describe("buildCollectionPageSchema", () => {
  it("returns CollectionPage with @type", () => {
    const result = buildCollectionPageSchema("https://riquelmeprop.com/propiedades", {});
    expect(result["@type"]).toBe("CollectionPage");
  });

  it("includes url", () => {
    const result = buildCollectionPageSchema("https://riquelmeprop.com/propiedades", {});
    expect(result.url).toBe("https://riquelmeprop.com/propiedades");
  });

  it("wraps itemList as mainEntity", () => {
    const itemList = buildItemListSchema([
      { slug: "casa-moderna", title: "Casa Moderna" },
    ]);
    const result = buildCollectionPageSchema(
      "https://riquelmeprop.com/propiedades",
      itemList
    );
    expect(result.mainEntity).toEqual(itemList);
  });

  it("works with empty itemList", () => {
    const itemList = buildItemListSchema([]);
    const result = buildCollectionPageSchema(
      "https://riquelmeprop.com/propiedades",
      itemList
    );
    expect(result.mainEntity).toEqual(itemList);
    expect((result.mainEntity as Record<string, unknown>).numberOfItems).toBe(0);
  });
});
