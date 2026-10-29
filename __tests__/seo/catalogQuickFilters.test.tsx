// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

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

import CatalogQuickFilters, {
  QUICK_FILTER_CHIPS,
} from "@/components/shared/CatalogQuickFilters/CatalogQuickFilters";

describe("CatalogQuickFilters", () => {
  it("renders the five quick filters", () => {
    const { container } = render(<CatalogQuickFilters />);

    const labels = Array.from(container.querySelectorAll("a")).map(
      (a) => a.textContent
    );

    expect(labels).toEqual([
      "General Roca",
      "Casas",
      "Terrenos",
      "Departamentos en Pozo",
      "Las Grutas",
    ]);
  });

  it("links each quick filter to the catalog with the right query", () => {
    const { container } = render(<CatalogQuickFilters />);

    const hrefs = Array.from(container.querySelectorAll("a")).map((a) =>
      a.getAttribute("href")
    );

    expect(hrefs).toEqual([
      "/venta-de-propiedades?ubicacion=general-roca",
      "/venta-de-propiedades?tipo=casa",
      "/venta-de-propiedades?tipo=terreno",
      "/venta-de-propiedades?tipo=departamento-en-pozo",
      "/venta-de-propiedades?ubicacion=las-grutas",
    ]);
  });

  it("marks the active filter", () => {
    const { container } = render(
      <CatalogQuickFilters activeType="casa" activeCity="general-roca" />
    );

    const active = container.querySelectorAll('a[aria-current="page"]');
    expect(active.length).toBe(2);
  });

  it("exposes the chip catalog", () => {
    expect(QUICK_FILTER_CHIPS).toHaveLength(5);
  });
});
