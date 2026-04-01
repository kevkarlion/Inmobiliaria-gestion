/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MatchingScore {
  score: number;
  breakdown: {
    operationType: number;
    propertyType: number;
    location: number;
    price: number;
    features: number;
  };
}

export interface PropertyMatch {
  property: {
    id: string;
    title: string;
    slug: string;
    price: {
      amount: number;
      currency: string;
      priceOption: "amount" | "consult";
    };
    propertyType: {
      id: string;
      name: string;
      slug: string;
    };
    address: {
      province: string;
      city: string;
      barrio?: string;
    };
    images: {
      url: string;
    }[];
  };
  score: MatchingScore;
}

export interface ClientMatch {
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  score: MatchingScore;
}

export interface MatchingResultDTO {
  requirementId: string;
  matches: PropertyMatch[];
  totalMatches: number;
  matchDate: Date;
}

export interface ReverseMatchingResultDTO {
  propertyId: string;
  matches: ClientMatch[];
  totalMatches: number;
  matchDate: Date;
}

export function propertyMatchingResultDTO(requirement: any, properties: any[]): MatchingResultDTO {
  return {
    requirementId: requirement._id.toString(),
    matches: properties.map((property) => ({
      property: {
        id: property._id.toString(),
        title: property.title,
        slug: property.slug,
        price: {
          amount: property.price?.amount || 0,
          currency: property.price?.currency || "USD",
          priceOption: property.price?.priceOption || "amount",
        },
        propertyType: {
          id: property.propertyType?._id?.toString() || "",
          name: property.propertyType?.name || "",
          slug: property.propertyType?.slug || "",
        },
        address: {
          province: property.address?.province?.name || "",
          city: property.address?.city?.name || "",
          barrio: property.address?.barrio || undefined,
        },
        images: (property.images || []).slice(0, 1).map((img: any) => ({
          url: typeof img === "string" ? img : img.url,
        })),
      },
      score: property._matchScore || { score: 0, breakdown: { operationType: 0, propertyType: 0, location: 0, price: 0, features: 0 } },
    })),
    totalMatches: properties.length,
    matchDate: new Date(),
  };
}

export function clientMatchingResultDTO(property: any, clients: any[]): ReverseMatchingResultDTO {
  return {
    propertyId: property._id.toString(),
    matches: clients.map((client) => ({
      client: {
        id: client._id.toString(),
        name: client.name,
        email: client.email,
        phone: client.phone,
      },
      score: client._matchScore || { score: 0, breakdown: { operationType: 0, propertyType: 0, location: 0, price: 0, features: 0 } },
    })),
    totalMatches: clients.length,
    matchDate: new Date(),
  };
}
