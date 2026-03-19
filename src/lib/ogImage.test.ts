import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildOgImageUrl } from "./ogImage";

// Mock the config module
vi.mock("@/lib/config", () => ({
  SITE_URL: "https://riquelmeprop.com",
}));

describe("buildOgImageUrl", () => {
  describe("Cloudinary URL transformation", () => {
    it("should append transformation parameters to Cloudinary URLs", () => {
      const input = "https://res.cloudinary.com/demo/image/upload/sample.jpg";
      const result = buildOgImageUrl(input);
      
      expect(result).toBe(
        "https://res.cloudinary.com/demo/image/upload/sample.jpg?fl=progressive,f_jpg,q_auto:best,w_1200,h_630,c_fill"
      );
    });

    it("should append to existing query parameters", () => {
      const input = "https://res.cloudinary.com/demo/image/upload/sample.jpg?v1=123";
      const result = buildOgImageUrl(input);
      
      expect(result).toBe(
        "https://res.cloudinary.com/demo/image/upload/sample.jpg?v1=123&fl=progressive,f_jpg,q_auto:best,w_1200,h_630,c_fill"
      );
    });

    it("should handle Cloudinary URLs with different paths", () => {
      const input = "https://res.cloudinary.com/my-cloud/image/upload/v1/properties/abc123.jpg";
      const result = buildOgImageUrl(input);
      
      expect(result).toBe(
        "https://res.cloudinary.com/my-cloud/image/upload/v1/properties/abc123.jpg?fl=progressive,f_jpg,q_auto:best,w_1200,h_630,c_fill"
      );
    });
  });

  describe("null/undefined handling", () => {
    it("should return null for null input", () => {
      const result = buildOgImageUrl(null);
      expect(result).toBeNull();
    });

    it("should return null for undefined input", () => {
      const result = buildOgImageUrl(undefined);
      expect(result).toBeNull();
    });
  });

  describe("non-Cloudinary URL guard", () => {
    it("should return non-Cloudinary URLs unchanged", () => {
      const input = "https://example.com/images/property.jpg";
      const result = buildOgImageUrl(input);
      expect(result).toBe(input);
    });

    it("should return regular URLs without transformation", () => {
      const input = "https://images.unsplash.com/photo-123456";
      const result = buildOgImageUrl(input);
      expect(result).toBe(input);
    });
  });

  describe("URL normalization", () => {
    it("should prepend site URL to relative paths", () => {
      const input = "/uploads/properties/123.jpg";
      const result = buildOgImageUrl(input);
      expect(result).toBe("https://riquelmeprop.com/uploads/properties/123.jpg");
    });

    it("should prepend https:// to URLs without protocol", () => {
      const input = "images.example.com/pic.jpg";
      const result = buildOgImageUrl(input);
      expect(result).toBe("https://images.example.com/pic.jpg");
    });

    it("should handle relative paths with query params", () => {
      const input = "/images/property.jpg?v=2";
      const result = buildOgImageUrl(input);
      expect(result).toBe("https://riquelmeprop.com/images/property.jpg?v=2");
    });
  });

  describe("edge cases", () => {
    it("should handle empty string gracefully", () => {
      const result = buildOgImageUrl("");
      // Empty string is falsy, so returns null
      expect(result).toBeNull();
    });

    it("should handle Cloudinary relative URL", () => {
      const input = "/res.cloudinary.com/demo/image/upload/sample.jpg";
      const result = buildOgImageUrl(input);
      // After making absolute, it should still contain Cloudinary and get transformed
      expect(result).toContain("res.cloudinary.com");
    });
  });
});
