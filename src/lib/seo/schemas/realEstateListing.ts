import { SITE_URL } from "@/lib/config";
import { SEO_CONFIG } from "@/lib/seo/config";

interface PropertyImage {
  id?: string;
  url: string;
}

interface PropertyInput {
  title: string;
  slug: string;
  description?: string;
  images: PropertyImage[];
  imagesDesktop?: string[];
  price: {
    amount: number;
    currency: string;
  };
  address: {
    street: string;
    number: string;
    city: { name: string } | null;
    province: { name: string } | null;
  };
  location: {
    lat: number;
    lng: number;
  };
  features: {
    totalM2: number;
    bedrooms: number;
    bathrooms: number;
  };
  createdAt?: string;
}

function extractImageUrls(property: PropertyInput): string[] {
  if (property.images.length > 0) {
    return property.images.map((img) => (typeof img === "string" ? img : img.url));
  }
  if (property.imagesDesktop && property.imagesDesktop.length > 0) {
    return property.imagesDesktop;
  }
  return [];
}

export function buildRealEstateListingSchema(
  property: PropertyInput
): Record<string, unknown> {
  const result: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    url: `${SITE_URL}/propiedad/${property.slug}`,
    datePosted: property.createdAt,
  };

  const images = extractImageUrls(property);
  if (images.length > 0) {
    result.image = images;
  }

  if (property.description) {
    result.description = property.description;
  }

  result.offers = {
    "@type": "Offer",
    price: property.price.amount,
    priceCurrency: property.price.currency,
    availability: "https://schema.org/InStock",
  };

  result.address = {
    "@type": "PostalAddress",
    streetAddress: `${property.address.street} ${property.address.number}`.trim(),
    addressLocality: property.address.city?.name || "",
    addressRegion: property.address.province?.name || "",
  };

  if (property.location.lat !== 0 || property.location.lng !== 0) {
    result.geo = {
      "@type": "GeoCoordinates",
      latitude: property.location.lat,
      longitude: property.location.lng,
    };
  }

  if (property.features.totalM2 > 0) {
    result.floorSize = {
      "@type": "QuantitativeValue",
      value: property.features.totalM2,
      unitCode: "MTK",
    };
  }

  result.numberOfRooms = property.features.bedrooms;
  result.numberOfBathroomsTotal = property.features.bathrooms;

  return result;
}
