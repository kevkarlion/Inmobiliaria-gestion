import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/slugify";

describe("slugify", () => {
  it("convierte texto normal a slug", () => {
    expect(slugify("Hola Mundo")).toBe("hola-mundo");
  });

  it("reemplaza espacios múltiples con un solo guión", () => {
    expect(slugify("casa   en   venta")).toBe("casa-en-venta");
  });

  it("convierte a lowercase", () => {
    expect(slugify("PROPIEDADES")).toBe("propiedades");
  });

  it("elimina acentos", () => {
    expect(slugify("José García")).toBe("jose-garcia");
  });

  it("elimina caracteres especiales", () => {
    expect(slugify("¡Hola! ¿Cómo estás?")).toBe("hola-como-estas");
  });

  it("devuelve vacío para string vacío", () => {
    expect(slugify("")).toBe("");
  });

  it("trimea espacios al inicio y fin", () => {
    expect(slugify("  texto  ")).toBe("texto");
  });

  it("no deja guiones al inicio o final", () => {
    expect(slugify(" texto ")).toBe("texto");
  });

  it("genera slug SEO-friendly para título inmobiliario", () => {
    expect(slugify("¡OPORTUNIDAD! Casa en Venta - General Roca")).toBe(
      "oportunidad-casa-en-venta-general-roca"
    );
  });
});
