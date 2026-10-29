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

const getUiProperties = vi.fn(async () => []);
vi.mock("@/components/server/data-access/get-ui-properties", () => ({
  getUiProperties: (...args: unknown[]) => getUiProperties(...(args as [])),
}));

import Hero from "@/components/home/Hero/Hero";

describe("Home Hero heading", () => {
  it("renders a single h1 with the exact keyword heading", async () => {
    const { container } = render(await Hero());

    const headings = container.querySelectorAll("h1");
    expect(headings.length).toBe(1);
    expect(headings[0].textContent).toBe(
      "Inmobiliaria en General Roca | Venta de Casas, Departamentos y Terrenos"
    );
  });

  it("does not offer sold or reserved properties to the search bar", async () => {
    await Hero();

    expect(getUiProperties).toHaveBeenCalledWith(
      expect.objectContaining({ excludeUnavailable: true })
    );
  });
});
