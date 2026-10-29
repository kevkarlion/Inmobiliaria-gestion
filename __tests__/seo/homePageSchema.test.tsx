// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

// Los componentes asíncronos de la home se aíslan para poder renderizar la
// página (y su JSON-LD) en el entorno de test.
vi.mock("@/components/home/Hero/Hero", () => ({
  default: () => <section data-testid="hero" />,
}));

vi.mock("@/components/ContainerCardsMain/ContainerCardsMain", () => ({
  default: () => <section data-testid="cards" />,
}));

vi.mock("@/components/home/AboutPreview/AboutPreview", () => ({
  default: () => <section data-testid="about" />,
}));

vi.mock("@/components/home/HomeBlogSection/HomeBlogSection", () => ({
  default: () => <section data-testid="blog" />,
}));

import HomePage from "@/app/(public)/page";

describe("Home page JSON-LD", () => {
  it("renders the RealEstateAgent schema", async () => {
    const { container } = render(await HomePage());

    const scripts = Array.from(
      container.querySelectorAll('script[type="application/ld+json"]')
    ).map((script) => JSON.parse(script.innerHTML));

    const schema = scripts.find((s) => s["@type"] === "RealEstateAgent");

    expect(schema).toBeDefined();
    expect(schema?.name).toBe("Riquelme Propiedades");
    expect(schema?.telephone).toBe("+5492984582082");
    expect(schema?.areaServed).toContain("Las Grutas");
  });
});
