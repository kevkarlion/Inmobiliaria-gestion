import { describe, it, expect } from "vitest";
import { buildOrganizationSchema } from "@/lib/seo/schemas/organization";
import { SEO_CONFIG } from "@/lib/seo/config";

describe("buildOrganizationSchema", () => {
  it("returns Organization and LocalBusiness types", () => {
    const result = buildOrganizationSchema(SEO_CONFIG);
    expect(result["@type"]).toEqual(["Organization", "LocalBusiness"]);
  });

  it("includes name from config", () => {
    const result = buildOrganizationSchema(SEO_CONFIG);
    expect(result.name).toBe("Riquelme Propiedades");
  });

  it("includes absolute url from config", () => {
    const result = buildOrganizationSchema(SEO_CONFIG);
    expect(result.url).toBe(SEO_CONFIG.siteUrl);
  });

  it("includes logo as absolute url", () => {
    const result = buildOrganizationSchema(SEO_CONFIG);
    expect(result.logo).toBe(`${SEO_CONFIG.siteUrl}/og-image.png`);
  });

  it("includes address as PostalAddress", () => {
    const result = buildOrganizationSchema(SEO_CONFIG);
    expect(result.address).toEqual({
      "@type": "PostalAddress",
      streetAddress: "Mitre 247",
      addressLocality: "General Roca",
      addressRegion: "Río Negro",
      addressCountry: "AR",
      postalCode: "8332",
    });
  });

  it("includes contactPoint as ContactPoint", () => {
    const result = buildOrganizationSchema(SEO_CONFIG);
    expect(result.contactPoint).toEqual({
      "@type": "ContactPoint",
      telephone: "+5492984582082",
      contactType: "sales",
    });
  });

  it("includes sameAs with social URLs", () => {
    const result = buildOrganizationSchema(SEO_CONFIG);
    expect(result.sameAs).toEqual([
      "https://facebook.com/riquelmepropiedades",
      "https://instagram.com/riquelmepropiedades",
    ]);
  });

  it("omits logo when config has no logo", () => {
    const configWithoutLogo = { ...SEO_CONFIG, logo: "" };
    const result = buildOrganizationSchema(configWithoutLogo);
    expect(result).not.toHaveProperty("logo");
  });

  it("omits address fields that are empty", () => {
    const configWithoutStreet = {
      ...SEO_CONFIG,
      address: { ...SEO_CONFIG.address, street: "" },
    };
    const result = buildOrganizationSchema(configWithoutStreet);
    expect(result.address).not.toHaveProperty("streetAddress");
  });

  it("omits contactPoint when phone is empty", () => {
    const configWithoutPhone = { ...SEO_CONFIG, phone: "" };
    const result = buildOrganizationSchema(configWithoutPhone);
    expect(result).not.toHaveProperty("contactPoint");
  });

  it("omits sameAs when no social URLs exist", () => {
    const configWithoutSocial = {
      ...SEO_CONFIG,
      social: { facebook: "", instagram: "" },
    };
    const result = buildOrganizationSchema(configWithoutSocial);
    expect(result).not.toHaveProperty("sameAs");
  });
});
