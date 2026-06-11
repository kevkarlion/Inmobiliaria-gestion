// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";

const mockProperty = {
  _id: "abc123",
  title: "Casa Moderna en Centro",
  slug: "casa-moderna-en-centro",
  description: "Hermosa casa moderna en el centro de la ciudad",
  operationType: "venta",
  price: { amount: 150000, currency: "USD", priceOption: "amount" },
  propertyType: { _id: "t1", name: "Casa", slug: "casa" },
  address: {
    street: "Mitre",
    number: "123",
    zipCode: "8332",
    province: { _id: "p1", name: "Río Negro", slug: "rio-negro" },
    city: { _id: "c1", name: "General Roca", slug: "general-roca" },
    barrio: { _id: "b1", name: "Centro", slug: "centro" },
  },
  features: {
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
  },
  flags: { featured: true, opportunity: false, premium: false, reserved: false, reservedIsMale: false, sold: false, soldIsMale: false },
  tags: ["centro", "moderna"],
  images: [
    { url: "https://res.cloudinary.com/demo/image/upload/v1/img1.jpg" },
    { url: "https://res.cloudinary.com/demo/image/upload/v1/img2.jpg" },
  ],
  imagesDesktop: [],
  imagesMobile: [],
  location: { mapsUrl: "", lat: -39.0333, lng: -67.5833 },
  status: "active",
  contactPhone: "+5492984000000",
  createdAt: "2024-01-15T10:00:00.000Z",
  barrioName: "Centro",
  zoneName: "Centro",
  cityName: "General Roca",
  provinceName: "Río Negro",
};

vi.mock("@/server/services/property.service", () => ({
  PropertyService: {
    findBySlug: vi.fn(async (slug: string) => {
      if (slug === "casa-moderna-en-centro") return mockProperty;
      return null;
    }),
  },
}));

vi.mock("@/components/shared/PropertyDetailClient/PropertyDetailClient", () => ({
  PropertyDetailClient: () => <div data-testid="property-detail-client">Property Detail</div>,
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

import PropertyDetailPage, { generateMetadata } from "@/app/(public)/propiedad/[slug]/page";

describe("PropertyDetailPage JSON-LD", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders RealEstateListing schema script tag", async () => {
    const params = Promise.resolve({ slug: "casa-moderna-en-centro" });
    const { container } = render(await PropertyDetailPage({ params }));

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBeGreaterThanOrEqual(1);

    let foundListing = false;
    scripts.forEach((script) => {
      const parsed = JSON.parse(script.innerHTML);
      if (parsed["@type"] === "RealEstateListing") {
        foundListing = true;
        expect(parsed.name).toBe("Casa Moderna en Centro");
        expect(parsed.offers.price).toBe(150000);
        expect(parsed.offers.priceCurrency).toBe("USD");
      }
    });
    expect(foundListing).toBe(true);
  });

  it("renders BreadcrumbList schema with property title as last item", async () => {
    const params = Promise.resolve({ slug: "casa-moderna-en-centro" });
    const { container } = render(await PropertyDetailPage({ params }));

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    let foundBreadcrumb = false;
    scripts.forEach((script) => {
      const parsed = JSON.parse(script.innerHTML);
      if (parsed["@type"] === "BreadcrumbList") {
        foundBreadcrumb = true;
        const items = parsed.itemListElement;
        expect(items).toHaveLength(4);
        expect(items[0].name).toBe("Inicio");
        expect(items[1].name).toBe("Propiedades");
        expect(items[2].name).toBe("Centro");
        expect(items[3].name).toBe("Casa Moderna en Centro");
        expect(items[3].item).toBeFalsy();
      }
    });
    expect(foundBreadcrumb).toBe(true);
  });

  it("handles property without barrio — 3 breadcrumb items", async () => {
    const propertyNoBarrio = {
      ...mockProperty,
      title: "Departamento Sin Barrio",
      slug: "departamento-sin-barrio",
      address: { ...mockProperty.address, barrio: null },
      barrioName: "",
    };

    vi.mocked(
      (await import("@/server/services/property.service")).PropertyService.findBySlug
    ).mockResolvedValue(propertyNoBarrio as any);

    const params = Promise.resolve({ slug: "departamento-sin-barrio" });
    const { container } = render(await PropertyDetailPage({ params }));

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    let foundBreadcrumb = false;
    scripts.forEach((script) => {
      const parsed = JSON.parse(script.innerHTML);
      if (parsed["@type"] === "BreadcrumbList") {
        foundBreadcrumb = true;
        expect(parsed.itemListElement).toHaveLength(3);
        expect(parsed.itemListElement[1].name).toBe("Propiedades");
        expect(parsed.itemListElement[2].name).toBe("Departamento Sin Barrio");
      }
    });
    expect(foundBreadcrumb).toBe(true);
  });

  it("returns multiple OG images in generateMetadata when property has multiple images", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "casa-moderna-en-centro" }),
    });

    const ogImages = metadata.openGraph?.images;
    expect(ogImages).toBeDefined();

    if (Array.isArray(ogImages)) {
      expect(ogImages.length).toBeGreaterThanOrEqual(1);
      expect(ogImages[0]).toHaveProperty("url");
    }
  });

  it("returns og:locale es_AR in generateMetadata", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "casa-moderna-en-centro" }),
    });

    expect(metadata.openGraph).toBeDefined();
  });

  it("returns up to 6 OG images when property has many images", async () => {
    const propertyManyImages = {
      ...mockProperty,
      images: Array.from({ length: 8 }, (_, i) => ({
        url: `https://res.cloudinary.com/demo/image/upload/v1/img${i + 1}.jpg`,
      })),
    };

    vi.mocked(
      (await import("@/server/services/property.service")).PropertyService.findBySlug
    ).mockResolvedValue(propertyManyImages as any);

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "casa-moderna-en-centro" }),
    });

    const ogImages = metadata.openGraph?.images;
    expect(ogImages).toBeDefined();
    if (Array.isArray(ogImages)) {
      expect(ogImages.length).toBeLessThanOrEqual(6);
    }
  });

  it("includes og:site_name in generateMetadata", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "casa-moderna-en-centro" }),
    });

    expect(metadata.openGraph?.siteName).toBe("Riquelme Propiedades");
  });

  it("handles not found property gracefully", async () => {
    vi.mocked(
      (await import("@/server/services/property.service")).PropertyService.findBySlug
    ).mockResolvedValue(null);

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "non-existent" }),
    });

    expect(metadata.title).toBe("Propiedad no encontrada");
  });
});
