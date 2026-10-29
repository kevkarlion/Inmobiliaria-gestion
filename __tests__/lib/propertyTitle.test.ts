import { describe, expect, it } from "vitest";
import { buildPropertySeoTitle } from "@/lib/seo/propertyTitle";

describe("buildPropertySeoTitle", () => {
  it("builds the long tail title with barrio and locality", () => {
    expect(
      buildPropertySeoTitle({
        typeName: "Casa",
        barrioName: "210 Viviendas",
        cityName: "General Roca",
        operationType: "venta",
      })
    ).toBe("Casa en Venta en 210 Viviendas, General Roca");
  });

  it("builds the long tail title for terreno", () => {
    expect(
      buildPropertySeoTitle({
        typeName: "Terreno",
        barrioName: "Don Fernando",
        cityName: "General Roca",
        operationType: "venta",
      })
    ).toBe("Terreno en Venta en Don Fernando, General Roca");
  });

  it("falls back to the locality when there is no barrio", () => {
    expect(
      buildPropertySeoTitle({
        typeName: "Casa",
        barrioName: "",
        cityName: "General Roca",
        operationType: "venta",
      })
    ).toBe("Casa en Venta en General Roca");
  });

  it("uses the operation label for alquiler", () => {
    expect(
      buildPropertySeoTitle({
        typeName: "Departamento",
        barrioName: "Centro",
        cityName: "General Roca",
        operationType: "alquiler",
      })
    ).toBe("Departamento en Alquiler en Centro, General Roca");
  });

  it("defaults to Venta when the operation is unknown", () => {
    expect(
      buildPropertySeoTitle({
        typeName: "Casa",
        barrioName: "Centro",
        cityName: "General Roca",
      })
    ).toBe("Casa en Venta en Centro, General Roca");
  });

  it("falls back to a generic type name", () => {
    expect(
      buildPropertySeoTitle({
        barrioName: "Centro",
        cityName: "General Roca",
        operationType: "venta",
      })
    ).toBe("Propiedad en Venta en Centro, General Roca");
  });

  it("does not duplicate the locality when the zone is the same city", () => {
    expect(
      buildPropertySeoTitle({
        typeName: "Casa",
        barrioName: "",
        zoneName: "General Roca",
        cityName: "General Roca",
        operationType: "venta",
      })
    ).toBe("Casa en Venta en General Roca");
  });
});
