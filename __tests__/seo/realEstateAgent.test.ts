/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest";
import { buildRealEstateAgentSchema } from "@/lib/seo/schemas/realEstateAgent";
import { SEO_CONFIG } from "@/lib/seo/config";

type Schema = Record<string, any>;

describe("buildRealEstateAgentSchema", () => {
  const schema: Schema = buildRealEstateAgentSchema();

  it("declares a RealEstateAgent entity", () => {
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("RealEstateAgent");
  });

  it("identifies the agency with name, url and @id", () => {
    expect(schema.name).toBe("Riquelme Propiedades");
    expect(schema.url).toBe(SEO_CONFIG.siteUrl);
    expect(schema["@id"]).toBe(`${SEO_CONFIG.siteUrl}/#organization`);
  });

  it("exposes an absolute image url", () => {
    expect(schema.image.startsWith("http")).toBe(true);
    expect(schema.image).toContain("/logo");
  });

  it("exposes the contact channels", () => {
    expect(schema.telephone).toBe("+5492984582082");
    expect(schema.email).toBe("info@riquelmeprop.com");
    expect(schema.priceRange).toBe("$$");
  });

  it("declares the local address and geo coordinates", () => {
    expect(schema.address["@type"]).toBe("PostalAddress");
    expect(schema.address.addressLocality).toBe("General Roca");
    expect(schema.address.addressRegion).toBe("Río Negro");
    expect(schema.address.addressCountry).toBe("AR");

    expect(schema.geo["@type"]).toBe("GeoCoordinates");
    expect(schema.geo.latitude).toBe("-39.0298");
    expect(schema.geo.longitude).toBe("-67.5792");
  });

  it("lists the hyperlocal areas served", () => {
    expect(schema.areaServed).toEqual([
      "General Roca",
      "Alto Valle",
      "Las Grutas",
      "San Carlos de Bariloche",
      "Sierra Grande",
    ]);
  });

  it("links the social profiles", () => {
    expect(schema.sameAs).toContain(SEO_CONFIG.social.instagram);
    expect(schema.sameAs).toContain(SEO_CONFIG.social.facebook);
  });
});
