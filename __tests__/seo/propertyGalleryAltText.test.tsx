/* eslint-disable @next/next/no-img-element */
// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { PropertyGallery } from "@/components/shared/PropertyGalllery/PropertyGallery";

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: Record<string, unknown>) => (
    <img alt={alt as string} {...props} />
  ),
}));

vi.mock("lucide-react", () => ({
  ChevronLeft: () => <span>{"<"}</span>,
  ChevronRight: () => <span>{">"}</span>,
}));

vi.mock("@/lib/device-resolution", () => ({
  useDeviceResolution: vi.fn(() => false),
}));

afterEach(cleanup);

describe("PropertyGallery alt text integration", () => {
  const images = [
    "https://res.cloudinary.com/demo/image/upload/v1/img1.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1/img2.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1/img3.jpg",
  ];

  it("uses altTexts array for main image when provided", () => {
    const altTexts = [
      "Casa Moderna en venta en Centro, General Roca — Imagen 1",
      "Casa Moderna en venta en Centro, General Roca — Imagen 2",
      "Casa Moderna en venta en Centro, General Roca — Imagen 3",
    ];

    render(<PropertyGallery images={images} altTexts={altTexts} />);

    const allImgs = screen.getAllByRole("img");
    const matchingImgs = allImgs.filter(
      (img) =>
        img.getAttribute("alt") ===
        "Casa Moderna en venta en Centro, General Roca — Imagen 1"
    );
    expect(matchingImgs.length).toBeGreaterThanOrEqual(1);
  });

  it("falls back to default alt text for main image when altTexts not provided", () => {
    render(<PropertyGallery images={images} />);

    const allImgs = screen.getAllByRole("img");
    const defaultAlts = allImgs.filter(
      (img) => img.getAttribute("alt") === "Propiedad - Imagen 1"
    );
    expect(defaultAlts.length).toBeGreaterThanOrEqual(1);
  });

  it("uses altTexts for thumbnail images when provided", () => {
    const altTexts = [
      "Casa en venta — Foto 1",
      "Casa en venta — Foto 2",
      "Casa en venta — Foto 3",
    ];

    const { container } = render(
      <PropertyGallery images={images} altTexts={altTexts} />
    );

    const imgs = container.querySelectorAll("img");
    const thumbAlts = Array.from(imgs).map((img) => img.getAttribute("alt"));
    expect(thumbAlts).toContain("Casa en venta — Foto 1");
    expect(thumbAlts).toContain("Casa en venta — Foto 2");
    expect(thumbAlts).toContain("Casa en venta — Foto 3");
  });

  it("falls back to default thumbnail alt when altTexts array is shorter than images", () => {
    const altTexts = ["Only one alt text"];

    const { container } = render(
      <PropertyGallery images={images} altTexts={altTexts} />
    );

    const imgs = container.querySelectorAll("img");
    const altValues = Array.from(imgs).map((img) => img.getAttribute("alt"));
    expect(altValues).toContain("Only one alt text");
    expect(altValues).toContain("Thumbnail 2");
    expect(altValues).toContain("Thumbnail 3");
  });

  it("handles empty images array without crashing", () => {
    const { container } = render(<PropertyGallery images={[]} altTexts={[]} />);

    expect(container.textContent).toContain("Sin imágenes disponibles");
  });
});
