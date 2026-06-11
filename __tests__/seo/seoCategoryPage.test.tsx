// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";

const mockProperties = [
  {
    id: "p1",
    slug: "casa-moderna",
    title: "Casa Moderna",
    operationType: "venta",
    typeSlug: "casa",
    typeName: "Casa",
    barrioName: "Centro",
    zoneName: "Centro",
    cityName: "General Roca",
    provinceName: "Río Negro",
    amount: 150000,
    currency: "USD",
    priceOption: "amount",
    bedrooms: 3,
    bathrooms: 2,
    totalM2: 200,
    coveredM2: 150,
    rooms: 5,
    garage: true,
    garageType: "cochera",
    width: 10,
    length: 20,
    age: 5,
    services: ["agua", "luz", "gas"],
    featured: true,
    opportunity: false,
    premium: false,
    reserved: false,
    reservedIsMale: false,
    sold: false,
    soldIsMale: false,
    status: "active",
    tags: ["centro"],
    images: ["https://res.cloudinary.com/demo/image/upload/v1/img1.jpg"],
    description: "Hermosa casa moderna",
    contactPhone: "+5492984000000",
    mapsUrl: "",
    externalMapsUrl: "",
    lat: -39.0333,
    lng: -67.5833,
    street: "Mitre",
    number: "123",
    zipCode: "8332",
  },
];

const mockSeoCategory = {
  slug: "casas-en-venta",
  title: "Casas en venta en General Roca",
  description: "Encontrá casas en venta en General Roca.",
  canonical: "https://riquelmeprop.com/casas-en-venta",
  operationType: "venta",
  propertyTypeSlug: "casa",
  citySlug: "general-roca",
};

vi.mock("@/lib/seoCategories", () => ({
  SEO_CATEGORIES: [],
  getSeoCategoryBySlug: vi.fn((slug: string) => {
    if (slug === "casas-en-venta") return mockSeoCategory;
    return null;
  }),
}));

vi.mock("@/lib/seoUrls", () => ({
  parseSeoListingSlug: vi.fn(() => null),
}));

vi.mock("@/server/services/property.service", () => ({
  PropertyService: {
    getSeoListingNames: vi.fn(async () => null),
  },
}));

vi.mock("@/components/server/data-access/get-ui-properties", () => ({
  getUiProperties: vi.fn(async () => mockProperties),
}));

vi.mock("@/components/shared/SearchTypePage/SearchTypePage", () => ({
  default: ({ properties, filterParam }: { properties: any[]; filterParam: string }) =>
    <div data-testid="search-type-page">{filterParam}: {properties.length} properties</div>,
}));

import * as seoCategories from "@/lib/seoCategories";
import * as seoUrls from "@/lib/seoUrls";
import * as dataAccess from "@/components/server/data-access/get-ui-properties";
import SeoCategoryPage, { generateMetadata } from "@/app/(public)/[seoCategory]/page";

describe("SEO Category Page JSON-LD", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders ItemList schema with properties", async () => {
    const params = Promise.resolve({ seoCategory: "casas-en-venta" });
    const { container } = render(await SeoCategoryPage({ params }));

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBeGreaterThanOrEqual(1);

    let foundItemList = false;
    scripts.forEach((script) => {
      const parsed = JSON.parse(script.innerHTML);
      if (parsed["@type"] === "ItemList") {
        foundItemList = true;
        expect(parsed.numberOfItems).toBe(1);
        expect(parsed.itemListElement).toHaveLength(1);
        expect(parsed.itemListElement[0].name).toBe("Casa Moderna");
      }
    });
    expect(foundItemList).toBe(true);
  });

  it("renders CollectionPage schema", async () => {
    const params = Promise.resolve({ seoCategory: "casas-en-venta" });
    const { container } = render(await SeoCategoryPage({ params }));

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    let foundCollection = false;
    scripts.forEach((script) => {
      const parsed = JSON.parse(script.innerHTML);
      if (parsed["@type"] === "CollectionPage") {
        foundCollection = true;
        expect(parsed.mainEntity).toBeDefined();
        expect(parsed.mainEntity["@type"]).toBe("ItemList");
      }
    });
    expect(foundCollection).toBe(true);
  });

  it("renders BreadcrumbList schema", async () => {
    const params = Promise.resolve({ seoCategory: "casas-en-venta" });
    const { container } = render(await SeoCategoryPage({ params }));

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    let foundBreadcrumb = false;
    scripts.forEach((script) => {
      const parsed = JSON.parse(script.innerHTML);
      if (parsed["@type"] === "BreadcrumbList") {
        foundBreadcrumb = true;
        expect(parsed.itemListElement).toHaveLength(2);
        expect(parsed.itemListElement[0].name).toBe("Inicio");
        expect(parsed.itemListElement[1].name).toBe("Casas en venta en General Roca");
        expect(parsed.itemListElement[1].item).toBeFalsy();
      }
    });
    expect(foundBreadcrumb).toBe(true);
  });

  it("handles parsed seo category with dynamic properties", async () => {
    vi.mocked(seoCategories.getSeoCategoryBySlug).mockReturnValue(null as any);
    vi.mocked(seoUrls.parseSeoListingSlug).mockReturnValue({
      operation: "venta",
      typeSlug: "casa",
      citySlug: "general-roca",
    });

    const mockNames = {
      typeName: "Casa",
      cityName: "General Roca",
    };
    const PropertyService = await import("@/server/services/property.service");
    vi.mocked(PropertyService.PropertyService.getSeoListingNames).mockResolvedValue(mockNames as any);

    const params = Promise.resolve({ seoCategory: "casas-en-venta-general-roca" });
    const { container } = render(await SeoCategoryPage({ params }));

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBeGreaterThanOrEqual(2);
  });

  it("has og:site_name in parsed route generateMetadata", async () => {
    vi.mocked(seoCategories.getSeoCategoryBySlug).mockReturnValue(null as any);
    vi.mocked(seoUrls.parseSeoListingSlug).mockReturnValue({
      operation: "venta",
      typeSlug: "casa",
      citySlug: "general-roca",
    });

    const PropertyService = await import("@/server/services/property.service");
    vi.mocked(PropertyService.PropertyService.getSeoListingNames).mockResolvedValue({
      typeName: "Casa",
      cityName: "General Roca",
    } as any);

    const metadata = await generateMetadata({
      params: Promise.resolve({ seoCategory: "casas-en-venta-general-roca" }),
    });

    expect(metadata.openGraph?.siteName).toBe("Riquelme Propiedades");
    expect(metadata.twitter?.card).toBe("summary_large_image");
  });

  it("returns twitter metadata in generateMetadata", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ seoCategory: "casas-en-venta" }),
    });

    expect(metadata.twitter?.card).toBe("summary_large_image");
  });
});
