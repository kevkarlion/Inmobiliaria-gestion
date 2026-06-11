import { describe, it, expect } from "vitest";
import {
  SEO_CONFIG,
  buildOrganizationSchema,
  buildRealEstateListingSchema,
  buildBreadcrumbListSchema,
  buildItemListSchema,
  buildCollectionPageSchema,
  buildBreadcrumbItems,
  generateAltText,
  JsonLd,
} from "@/lib/seo";

describe("seo barrel exports", () => {
  it("exports SEO_CONFIG", () => {
    expect(SEO_CONFIG).toBeDefined();
    expect(SEO_CONFIG.siteName).toBe("Riquelme Propiedades");
  });

  it("exports buildOrganizationSchema", () => {
    expect(typeof buildOrganizationSchema).toBe("function");
  });

  it("exports buildRealEstateListingSchema", () => {
    expect(typeof buildRealEstateListingSchema).toBe("function");
  });

  it("exports buildBreadcrumbListSchema", () => {
    expect(typeof buildBreadcrumbListSchema).toBe("function");
  });

  it("exports buildItemListSchema", () => {
    expect(typeof buildItemListSchema).toBe("function");
  });

  it("exports buildCollectionPageSchema", () => {
    expect(typeof buildCollectionPageSchema).toBe("function");
  });

  it("exports buildBreadcrumbItems", () => {
    expect(typeof buildBreadcrumbItems).toBe("function");
  });

  it("exports generateAltText", () => {
    expect(typeof generateAltText).toBe("function");
  });

  it("exports JsonLd", () => {
    expect(JsonLd).toBeDefined();
    expect(typeof JsonLd).toBe("function");
  });
});
