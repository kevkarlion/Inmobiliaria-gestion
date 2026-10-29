// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
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

import PropertyCardGridSearch from "@/components/shared/PropertyCardGridSearch/PropertyCardGridSearch";

const property = {
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
} as never;

describe("PropertyCardGridSearch card", () => {
  it("renders the standardized long tail title", () => {
    const { container } = render(<PropertyCardGridSearch properties={[property]} />);

    const title = container.querySelector("h3");
    expect(title?.textContent).toBe(
      "Casa en Venta en 210 Viviendas, General Roca"
    );
  });

  it("renders a WhatsApp button with the prefilled inquiry message", () => {
    const { container } = render(<PropertyCardGridSearch properties={[property]} />);

    const whatsapp = container.querySelector(
      'a[href^="https://wa.me/"]'
    ) as HTMLAnchorElement;

    expect(whatsapp).not.toBeNull();
    expect(whatsapp.getAttribute("target")).toBe("_blank");

    const message = decodeURIComponent(
      whatsapp.getAttribute("href")!.split("text=")[1]
    );
    expect(message).toBe(
      "Hola! Quiero consultar por la propiedad Casa en Venta en 210 Viviendas, General Roca (Ref: Venta)"
    );
  });

  it("keeps the link to the property detail", () => {
    const { container } = render(<PropertyCardGridSearch properties={[property]} />);

    const detailLink = container.querySelector(
      'a[href="/propiedad/casa-210-viviendas-general-roca"]'
    );
    expect(detailLink).not.toBeNull();
  });
});
