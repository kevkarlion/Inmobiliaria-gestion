/* eslint-disable @typescript-eslint/no-explicit-any */
// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <div role="img" aria-label={alt} />,
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const baseProperty = {
  id: "p1",
  title: "Casa con pileta en 210 Viviendas",
  slug: "casa-210-viviendas-general-roca",
  operationType: "venta",
  typeSlug: "casa",
  typeName: "Casa",
  provinceSlug: "rio-negro",
  provinceName: "Río Negro",
  citySlug: "general-roca",
  cityName: "General Roca",
  barrioSlug: "210-viviendas",
  barrioName: "210 Viviendas",
  zoneName: "General Roca, 210 Viviendas",
  street: "Mitre",
  number: "123",
  zipCode: "8332",
  amount: 150000,
  currency: "USD",
  priceOption: "amount",
  bedrooms: 3,
  bathrooms: 2,
  totalM2: 200,
  coveredM2: 150,
  rooms: 5,
  garage: true,
  garageType: "cochera",
  width: 10,
  length: 20,
  age: 5,
  services: [],
  featured: false,
  opportunity: false,
  premium: false,
  reserved: false,
  reservedIsMale: false,
  sold: false,
  soldIsMale: false,
  status: "active",
  tags: [],
  images: [],
  imagesDesktop: [],
  imagesMobile: [],
  videos: [],
  description: "",
  contactPhone: "",
  mapsUrl: "",
  externalMapsUrl: "",
  lat: -39.0298,
  lng: -67.5792,
};

const activeProperty = baseProperty;

const soldProperty = {
  ...baseProperty,
  id: "p2",
  title: "Casa en Don Fernando",
  slug: "casa-don-fernando-general-roca",
  barrioSlug: "don-fernando",
  barrioName: "Don Fernando",
  zoneName: "General Roca, Don Fernando",
  sold: true,
  soldIsMale: true,
};

const reservedProperty = {
  ...baseProperty,
  id: "p3",
  title: "Terreno en Costa Dorada",
  slug: "terreno-costa-dorada-general-roca",
  typeSlug: "terreno",
  typeName: "Terreno",
  barrioSlug: "costa-dorada",
  barrioName: "Costa Dorada",
  zoneName: "General Roca, Costa Dorada",
  reserved: true,
};

const getUiProperties = vi.fn(async () => [soldProperty, activeProperty, reservedProperty]);
vi.mock("@/components/server/data-access/get-ui-properties", () => ({
  getUiProperties: (...args: unknown[]) => getUiProperties(...(args as [])),
}));

// Componente asíncrono de servidor: no puede renderizarse dentro del árbol cliente.
vi.mock("@/components/shared/RelatedCategories/RelatedCategories", () => ({
  default: () => null,
}));

import VentaPropiedadesPage from "@/app/(public)/venta-de-propiedades/page";

function getItemList(container: HTMLElement) {
  const scripts = Array.from(
    container.querySelectorAll('script[type="application/ld+json"]')
  ).map((script) => JSON.parse(script.innerHTML));

  return scripts.find((s) => s["@type"] === "ItemList");
}

describe("Catálogo de ventas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUiProperties.mockResolvedValue([
      soldProperty,
      activeProperty,
      reservedProperty,
    ] as never);
  });

  it("renders the catalog h1", async () => {
    const { container } = render(
      await VentaPropiedadesPage({
        searchParams: Promise.resolve({}),
      })
    );

    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toBe(
      "Propiedades en Venta en General Roca y Alto Valle"
    );
  });

  it("renders an ItemList with nested RealEstateListing entries", async () => {
    const { container } = render(
      await VentaPropiedadesPage({
        searchParams: Promise.resolve({}),
      })
    );

    const itemList = getItemList(container);

    expect(itemList).toBeDefined();
    expect(itemList.itemListElement[0].item["@type"]).toBe("RealEstateListing");
    expect(itemList.itemListElement[0].item.name).toBe(
      "Casa en Venta en 210 Viviendas, General Roca"
    );
    expect(itemList.itemListElement[0].item.url).toContain(
      "/propiedad/casa-210-viviendas-general-roca"
    );
  });

  it("orders active properties first and sold or reserved ones last", async () => {
    const { container } = render(
      await VentaPropiedadesPage({
        searchParams: Promise.resolve({}),
      })
    );

    const itemList = getItemList(container);
    const names = itemList.itemListElement.map((i: any) => i.item.name);

    expect(names[0]).toBe("Casa en Venta en 210 Viviendas, General Roca");
    expect(names[names.length - 1]).toBe(
      "Terreno en Venta en Costa Dorada, General Roca"
    );

    const cardTitles = Array.from(container.querySelectorAll("h3")).map(
      (h3) => h3.textContent
    );
    expect(cardTitles[0]).toBe("Casa en Venta en 210 Viviendas, General Roca");
  });

  it("forwards the barrio, tipo and ubicacion query params to the data layer", async () => {
    render(
      await VentaPropiedadesPage({
        searchParams: Promise.resolve({
          barrio: "210-viviendas",
          tipo: "casa",
          ubicacion: "general-roca",
        }),
      })
    );

    expect(getUiProperties).toHaveBeenCalledWith(
      expect.objectContaining({
        operationType: "venta",
        barrio: "210-viviendas",
        propertyType: "casa",
        city: "general-roca",
      })
    );
  });
});
