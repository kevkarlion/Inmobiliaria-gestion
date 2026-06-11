import { describe, it, expect } from "vitest";
import { buildRealEstateListingSchema } from "@/lib/seo/schemas/realEstateListing";
import { SEO_CONFIG } from "@/lib/seo/config";

const mockProperty = {
  id: "abc123",
  title: "Casa Moderna en Centro",
  slug: "casa-moderna-en-centro",
  contactPhone: "+5492984582082",
  price: {
    amount: 150000,
    currency: "USD",
    priceOption: "amount" as const,
  },
  propertyType: {
    id: "type1",
    name: "Casa",
    slug: "casa",
  },
  operationType: "venta",
  address: {
    street: "Mitre",
    number: "247",
    zipCode: "8332",
    province: { id: "p1", name: "Río Negro", slug: "rio-negro" },
    city: { id: "c1", name: "General Roca", slug: "general-roca" },
    barrio: { id: null, name: "Centro", slug: "centro" },
  },
  features: {
    bedrooms: 3,
    bathrooms: 2,
    totalM2: 200,
    coveredM2: 150,
    rooms: 5,
    garage: true,
    garageType: "cochera" as const,
    width: 10,
    length: 20,
    age: 5,
    services: ["agua", "luz", "gas"],
  },
  flags: {
    featured: true,
    opportunity: false,
    premium: false,
    reserved: false,
    reservedIsMale: false,
    sold: false,
    soldIsMale: false,
  },
  tags: ["centro", "casa"],
  images: [{ url: "https://example.com/img1.jpg" }, { url: "https://example.com/img2.jpg" }],
  imagesDesktop: [],
  imagesMobile: [],
  description: "Hermosa casa moderna en el centro de General Roca",
  status: "active",
  location: {
    mapsUrl: "https://maps.example.com",
    lat: -39.0332,
    lng: -67.5748,
  },
  createdAt: "2024-01-15T10:00:00.000Z",
};

describe("buildRealEstateListingSchema", () => {
  it("returns RealEstateListing @type", () => {
    const result = buildRealEstateListingSchema(mockProperty);
    expect(result["@type"]).toBe("RealEstateListing");
  });

  it("includes name from property title", () => {
    const result = buildRealEstateListingSchema(mockProperty);
    expect(result.name).toBe("Casa Moderna en Centro");
  });

  it("includes url as absolute property URL", () => {
    const result = buildRealEstateListingSchema(mockProperty);
    expect(result.url).toBe(`${SEO_CONFIG.siteUrl}/propiedad/casa-moderna-en-centro`);
  });

  it("includes description", () => {
    const result = buildRealEstateListingSchema(mockProperty);
    expect(result.description).toBe("Hermosa casa moderna en el centro de General Roca");
  });

  it("includes images as array of URLs", () => {
    const result = buildRealEstateListingSchema(mockProperty);
    expect(result.image).toEqual([
      "https://example.com/img1.jpg",
      "https://example.com/img2.jpg",
    ]);
  });

  it("includes offers with price and currency", () => {
    const result = buildRealEstateListingSchema(mockProperty);
    expect(result.offers).toEqual({
      "@type": "Offer",
      price: 150000,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    });
  });

  it("includes address with street, locality, region", () => {
    const result = buildRealEstateListingSchema(mockProperty);
    expect(result.address).toEqual({
      "@type": "PostalAddress",
      streetAddress: "Mitre 247",
      addressLocality: "General Roca",
      addressRegion: "Río Negro",
    });
  });

  it("includes geo coordinates", () => {
    const result = buildRealEstateListingSchema(mockProperty);
    expect(result.geo).toEqual({
      "@type": "GeoCoordinates",
      latitude: -39.0332,
      longitude: -67.5748,
    });
  });

  it("includes floorSize from totalM2", () => {
    const result = buildRealEstateListingSchema(mockProperty);
    expect(result.floorSize).toEqual({
      "@type": "QuantitativeValue",
      value: 200,
      unitCode: "MTK",
    });
  });

  it("includes numberOfRooms", () => {
    const result = buildRealEstateListingSchema(mockProperty);
    expect(result.numberOfRooms).toBe(3);
  });

  it("includes numberOfBathroomsTotal", () => {
    const result = buildRealEstateListingSchema(mockProperty);
    expect(result.numberOfBathroomsTotal).toBe(2);
  });

  it("includes datePosted from createdAt", () => {
    const result = buildRealEstateListingSchema(mockProperty);
    expect(result.datePosted).toBe("2024-01-15T10:00:00.000Z");
  });

  it("omits description when empty", () => {
    const result = buildRealEstateListingSchema({ ...mockProperty, description: "" });
    expect(result).not.toHaveProperty("description");
  });

  it("omits floorSize when totalM2 is 0", () => {
    const propertyNoArea = {
      ...mockProperty,
      features: { ...mockProperty.features, totalM2: 0 },
    };
    const result = buildRealEstateListingSchema(propertyNoArea);
    expect(result).not.toHaveProperty("floorSize");
  });

  it("omits geo when lat/lng are 0", () => {
    const propertyNoGeo = {
      ...mockProperty,
      location: { ...mockProperty.location, lat: 0, lng: 0 },
    };
    const result = buildRealEstateListingSchema(propertyNoGeo);
    expect(result).not.toHaveProperty("geo");
  });

  it("handles string[] image format", () => {
    const stringImagesProperty = {
      ...mockProperty,
      images: [] as { url: string }[],
      imagesDesktop: ["https://example.com/desk1.jpg"],
    };
    const result = buildRealEstateListingSchema(stringImagesProperty);
    expect(result.image).toEqual(["https://example.com/desk1.jpg"]);
  });
});
