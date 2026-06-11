import { describe, it, expect } from "vitest";
import { generateAltText } from "@/lib/seo/image";

describe("generateAltText", () => {
  it("generates alt text with title, operation type, and location", () => {
    const result = generateAltText({
      title: "Casa Moderna",
      operationType: "venta",
      barrioName: "Centro",
      cityName: "General Roca",
    });
    expect(result).toBe("Casa Moderna en venta en Centro, General Roca");
  });

  it("includes image number suffix when index is provided", () => {
    const result = generateAltText({
      title: "Casa Moderna",
      operationType: "venta",
      barrioName: "Centro",
      cityName: "General Roca",
    }, 2);
    expect(result).toBe("Casa Moderna en venta en Centro, General Roca — Imagen 2");
  });

  it("omits image number suffix for index 0", () => {
    const result = generateAltText({
      title: "Departamento",
      operationType: "alquiler",
      barrioName: "Norte",
      cityName: "General Roca",
    }, 0);
    expect(result).toBe("Departamento en alquiler en Norte, General Roca");
  });

  it("omits location when no barrio or city provided", () => {
    const result = generateAltText({
      title: "Terreno",
      operationType: "venta",
    });
    expect(result).toBe("Terreno en venta");
  });

  it("uses barrioName only when cityName is empty", () => {
    const result = generateAltText({
      title: "Local",
      operationType: "alquiler",
      barrioName: "Centro",
    });
    expect(result).toBe("Local en alquiler en Centro");
  });

  it("handles undefined operationType", () => {
    const result = generateAltText({
      title: "Casa",
      barrioName: "Centro",
    });
    expect(result).toBe("Casa en Centro");
  });
});
