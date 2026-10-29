import { describe, expect, it } from "vitest";
import {
  DEFAULT_WHATSAPP,
  generatePropertyInquiryUrl,
  normalizeArgentinePhone,
} from "@/lib/whatsappMessage";

describe("normalizeArgentinePhone", () => {
  it("keeps an already international number", () => {
    expect(normalizeArgentinePhone("5492984582082")).toBe("5492984582082");
  });

  it("adds the country code and the mobile prefix to a local number", () => {
    expect(normalizeArgentinePhone("2984582082")).toBe("5492984582082");
  });

  it("drops the local trunk prefix", () => {
    expect(normalizeArgentinePhone("02984582082")).toBe("5492984582082");
  });

  it("keeps a local number that already includes the mobile prefix", () => {
    expect(normalizeArgentinePhone("92984582082")).toBe("5492984582082");
  });

  it("falls back to the agency number when there is no phone", () => {
    expect(normalizeArgentinePhone("")).toBe(DEFAULT_WHATSAPP);
    expect(normalizeArgentinePhone(undefined)).toBe(DEFAULT_WHATSAPP);
  });
});

describe("generatePropertyInquiryUrl", () => {
  it("builds the prefilled inquiry message", () => {
    const url = generatePropertyInquiryUrl(
      "Casa en Venta en 210 Viviendas, General Roca",
      "2984582082",
      "Venta"
    );

    expect(url).toBe(
      "https://wa.me/5492984582082?text=Hola!%20Quiero%20consultar%20por%20la%20propiedad%20Casa%20en%20Venta%20en%20210%20Viviendas%2C%20General%20Roca%20(Ref%3A%20Venta)"
    );
  });

  it("uses the agency number when the property has no phone", () => {
    const url = generatePropertyInquiryUrl("Casa en Venta", "");
    expect(url.startsWith(`https://wa.me/${DEFAULT_WHATSAPP}?text=`)).toBe(true);
  });
});
