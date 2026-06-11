import { describe, it, expect } from "vitest";
import { SEO_CONFIG } from "@/lib/seo/config";

describe("SEO_CONFIG", () => {
  it("has siteName set to the brand name", () => {
    expect(SEO_CONFIG.siteName).toBe("Riquelme Propiedades");
  });

  it("has siteUrl from env or default", () => {
    expect(SEO_CONFIG.siteUrl).toBeTruthy();
    expect(SEO_CONFIG.siteUrl).toContain("https://");
  });

  it("has logo path", () => {
    expect(SEO_CONFIG.logo).toBeTruthy();
  });

  it("has address with all required fields", () => {
    expect(SEO_CONFIG.address.street).toBeTruthy();
    expect(SEO_CONFIG.address.locality).toBeTruthy();
    expect(SEO_CONFIG.address.region).toBeTruthy();
    expect(SEO_CONFIG.address.country).toBeTruthy();
    expect(SEO_CONFIG.address.postalCode).toBeTruthy();
  });

  it("has phone", () => {
    expect(SEO_CONFIG.phone).toBeTruthy();
  });

  it("has email", () => {
    expect(SEO_CONFIG.email).toBeTruthy();
  });

  it("has social with facebook and instagram", () => {
    expect(SEO_CONFIG.social.facebook).toBeTruthy();
    expect(SEO_CONFIG.social.instagram).toBeTruthy();
  });

  it("has openingHours", () => {
    expect(SEO_CONFIG.openingHours).toBeTruthy();
  });

  it("has priceRange", () => {
    expect(SEO_CONFIG.priceRange).toBeTruthy();
  });
});
