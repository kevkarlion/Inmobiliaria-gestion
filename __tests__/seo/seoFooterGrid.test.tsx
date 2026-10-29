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

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <div role="img" aria-label={alt} />,
}));

import Footer from "@/components/shared/Footer/Footer";
import SeoFooterGrid from "@/components/shared/SeoFooterGrid/SeoFooterGrid";

const expectedLinks = [
  {
    href: "/casas-en-venta-general-roca",
    text: "Casas en Venta en General Roca",
  },
  {
    href: "/terrenos-en-venta-general-roca",
    text: "Terrenos y Loteos en General Roca",
  },
  {
    href: "/departamentos-en-venta-general-roca",
    text: "Departamentos en Venta en General Roca",
  },
  {
    href: "/venta-de-propiedades?barrio=210-viviendas",
    text: "Barrio 210 Viviendas",
  },
  {
    href: "/venta-de-propiedades?barrio=don-fernando",
    text: "Barrio Don Fernando",
  },
  {
    href: "/venta-de-propiedades?barrio=827-viviendas",
    text: "Barrio 827 Viviendas",
  },
  {
    href: "/venta-de-propiedades?barrio=stefenelli",
    text: "Stefenelli Sur y Norte",
  },
  {
    href: "/venta-de-propiedades?ubicacion=las-grutas",
    text: "Propiedades en Las Grutas",
  },
  {
    href: "/venta-de-propiedades?ubicacion=bariloche",
    text: "Propiedades en San Carlos de Bariloche",
  },
  {
    href: "/venta-de-propiedades?ubicacion=sierra-grande",
    text: "Lotes en Costa Dorada (Sierra Grande)",
  },
];

const expectedColumnTitles = [
  "Propiedades por Categoría",
  "Búsquedas por Barrio",
  "Otras Zonas de Interés",
];

describe("SeoFooterGrid", () => {
  it("renders the exact hyperlocal links", () => {
    const { container } = render(<SeoFooterGrid />);
    const links = Array.from(container.querySelectorAll("a"));

    expect(links).toHaveLength(expectedLinks.length);
    expectedLinks.forEach(({ href, text }) => {
      const link = links.find((candidate) => candidate.getAttribute("href") === href);
      expect(link).toBeDefined();
      expect(link?.textContent).toBe(text);
    });
  });

  it("renders each SEO link column title", () => {
    const { container } = render(<SeoFooterGrid />);
    const headings = Array.from(container.querySelectorAll("h4"));

    expect(headings.map((heading) => heading.textContent)).toEqual(
      expectedColumnTitles
    );
  });

  it("is rendered by the global Footer", () => {
    const { container } = render(<Footer />);

    expect(
      container.querySelector(
        '.grid.grid-cols-1.md\\:grid-cols-3.gap-6.text-sm.text-neutral-400.mt-8.border-t.border-neutral-800.pt-6'
      )
    ).not.toBeNull();
  });
});
