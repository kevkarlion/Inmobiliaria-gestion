/* eslint-disable @typescript-eslint/no-explicit-any */
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
  {
    id: "p2",
    slug: "departamento-centro",
    title: "Departamento en Centro",
    operationType: "alquiler",
    typeSlug: "departamento",
    typeName: "Departamento",
    barrioName: "Centro",
    zoneName: "Centro",
    cityName: "General Roca",
    provinceName: "Río Negro",
    amount: 50000,
    currency: "ARS",
    priceOption: "amount",
    bedrooms: 2,
    bathrooms: 1,
    totalM2: 80,
    coveredM2: 70,
    rooms: 3,
    garage: false,
    garageType: "ninguno",
    width: 0,
    length: 0,
    age: 10,
    services: ["luz"],
    featured: false,
    opportunity: false,
    premium: false,
    reserved: false,
    reservedIsMale: false,
    sold: false,
    soldIsMale: false,
    status: "active",
    tags: [],
    images: [],
    description: "Departamento céntrico",
    contactPhone: "+5492984000000",
    mapsUrl: "",
    externalMapsUrl: "",
    lat: -39.0333,
    lng: -67.5833,
    street: "San Martín",
    number: "456",
    zipCode: "8332",
  },
];

vi.mock("@/components/server/data-access/get-ui-properties", () => ({
  getUiProperties: vi.fn(async () => mockProperties),
}));

vi.mock("@/components/shared/SearchTypePage/SearchTypePage", () => ({
  default: ({ properties, filterParam }: { properties: any[]; filterParam: string }) =>
    <div data-testid="search-type-page">{filterParam}: {properties.length} properties</div>,
}));

import * as dataAccess from "@/components/server/data-access/get-ui-properties";
import Page, { generateMetadata } from "@/app/(public)/propiedades/[filter]/page";

describe("Filter Listing Page JSON-LD", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders ItemList schema with properties", async () => {
    const params = Promise.resolve({ filter: "venta" });
    const { container } = render(await Page({ params }));

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBeGreaterThanOrEqual(1);

    let foundItemList = false;
    scripts.forEach((script) => {
      const parsed = JSON.parse(script.innerHTML);
      if (parsed["@type"] === "ItemList") {
        foundItemList = true;
        expect(parsed.numberOfItems).toBe(2);
        expect(parsed.itemListElement).toHaveLength(2);
        expect(parsed.itemListElement[0].name).toBe("Casa Moderna");
        expect(parsed.itemListElement[1].name).toBe("Departamento en Centro");
      }
    });
    expect(foundItemList).toBe(true);
  });

  it("renders CollectionPage schema", async () => {
    const params = Promise.resolve({ filter: "venta" });
    const { container } = render(await Page({ params }));

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

  it("renders BreadcrumbList schema with filter label", async () => {
    const params = Promise.resolve({ filter: "venta" });
    const { container } = render(await Page({ params }));

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    let foundBreadcrumb = false;
    scripts.forEach((script) => {
      const parsed = JSON.parse(script.innerHTML);
      if (parsed["@type"] === "BreadcrumbList") {
        foundBreadcrumb = true;
        expect(parsed.itemListElement).toHaveLength(3);
        expect(parsed.itemListElement[0].name).toBe("Inicio");
        expect(parsed.itemListElement[1].name).toBe("Propiedades");
        expect(parsed.itemListElement[2].name).toBe("En Venta");
      }
    });
    expect(foundBreadcrumb).toBe(true);
  });

  it("returns metadata with OG/Twitter in generateMetadata", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ filter: "venta" }),
    });

    expect(metadata.title).toBe("Propiedades en venta en General Roca");
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph?.siteName).toBe("Riquelme Propiedades");
    expect((metadata.twitter as any)?.card).toBe("summary_large_image");
  });

  it("handles oportunidad filter with correct breadcrumb label", async () => {
    const params = Promise.resolve({ filter: "oportunidad" });
    const { container } = render(await Page({ params }));

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    let foundBreadcrumb = false;
    scripts.forEach((script) => {
      const parsed = JSON.parse(script.innerHTML);
      if (parsed["@type"] === "BreadcrumbList") {
        foundBreadcrumb = true;
        expect(parsed.itemListElement[2].name).toBe("Oportunidades");
      }
    });
    expect(foundBreadcrumb).toBe(true);
  });

  it("handles alquiler filter with correct metadata", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ filter: "alquiler" }),
    });

    expect(metadata.title).toBe("Propiedades en alquiler en General Roca");
    expect(metadata.openGraph?.locale).toBe("es_AR");
  });

  it("handles unknown filter with fallback metadata", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ filter: "unknown" }),
    });

    expect(metadata.title).toBe("Propiedades en General Roca");
  });

  it("handles empty properties with numberOfItems 0", async () => {
    vi.mocked(dataAccess.getUiProperties).mockResolvedValue([]);

    const params = Promise.resolve({ filter: "venta" });
    const { container } = render(await Page({ params }));

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    let foundItemList = false;
    scripts.forEach((script) => {
      const parsed = JSON.parse(script.innerHTML);
      if (parsed["@type"] === "ItemList") {
        foundItemList = true;
        expect(parsed.numberOfItems).toBe(0);
        expect(parsed.itemListElement).toHaveLength(0);
      }
    });
    expect(foundItemList).toBe(true);
  });
});
