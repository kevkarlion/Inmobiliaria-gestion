// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("next/font/google", () => ({
  Montserrat: () => ({ variable: "--font-montserrat", className: "" }),
  Lora: () => ({ variable: "--font-lora", className: "" }),
  Inter: () => ({ variable: "--font-inter", className: "" }),
}));

vi.mock("@/server/services/property.service", () => ({
  PropertyService: {
    getMenuStructure: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock("next/link", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("sonner", () => ({
  Toaster: () => null,
}));

vi.mock("@/components/shared/Navbar/Navbar", () => ({
  default: () => null,
}));

vi.mock("@/components/shared/Footer/Footer", () => ({
  default: () => null,
}));

vi.mock("@/components/shared/WhatsAppButton/WhatsAppButton", () => ({
  default: () => null,
}));

vi.mock("@/components/shared/PublicBackground/PublicBackground", () => ({
  PublicBackground: () => null,
}));

vi.mock("@/components/shared/BlogScrollRestoration", () => ({
  default: () => null,
}));

vi.mock("@/context/PropertyContext", () => ({
  PropertyProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import PublicLayout from "@/app/(public)/layout";

describe("PublicLayout Organization Schema", () => {
  function getOrgSchema(container: HTMLElement): Record<string, unknown> | null {
    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    for (const script of scripts) {
      const parsed = JSON.parse(script.innerHTML);
      if (
        Array.isArray(parsed["@type"]) &&
        parsed["@type"].includes("Organization")
      ) {
        return parsed;
      }
    }
    return null;
  }

  it("renders at least one JSON-LD script tag", async () => {
    const { container } = render(
      await PublicLayout({ children: <div>test</div> })
    );
    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    expect(scripts.length).toBeGreaterThanOrEqual(1);
  });

  it("renders Organization schema in JSON-LD", async () => {
    const { container } = render(
      await PublicLayout({ children: <div>test</div> })
    );
    const orgSchema = getOrgSchema(container);
    expect(orgSchema).not.toBeNull();
  });

  it("Organization schema has correct name", async () => {
    const { container } = render(
      await PublicLayout({ children: <div>test</div> })
    );
    const orgSchema = getOrgSchema(container);
    expect(orgSchema).not.toBeNull();
    expect(orgSchema!.name).toBe("Riquelme Propiedades");
  });

  it("Organization schema has correct url", async () => {
    const { container } = render(
      await PublicLayout({ children: <div>test</div> })
    );
    const orgSchema = getOrgSchema(container);
    expect(orgSchema).not.toBeNull();
    expect(orgSchema!.url).toBe("https://riquelmeprop.com");
  });

  it("Organization schema includes LocalBusiness type", async () => {
    const { container } = render(
      await PublicLayout({ children: <div>test</div> })
    );
    const orgSchema = getOrgSchema(container);
    expect(orgSchema).not.toBeNull();
    expect(orgSchema!["@type"]).toContain("LocalBusiness");
  });

  it("Organization schema has address as PostalAddress", async () => {
    const { container } = render(
      await PublicLayout({ children: <div>test</div> })
    );
    const orgSchema = getOrgSchema(container);
    expect(orgSchema).not.toBeNull();
    const address = orgSchema!.address as Record<string, string>;
    expect(address).toBeDefined();
    expect(address["@type"]).toBe("PostalAddress");
    expect(address.streetAddress).toBe("Mitre 247");
    expect(address.addressLocality).toBe("General Roca");
  });

  it("Organization schema has contactPoint", async () => {
    const { container } = render(
      await PublicLayout({ children: <div>test</div> })
    );
    const orgSchema = getOrgSchema(container);
    expect(orgSchema).not.toBeNull();
    const contactPoint = orgSchema!.contactPoint as Record<string, string>;
    expect(contactPoint).toBeDefined();
    expect(contactPoint["@type"]).toBe("ContactPoint");
    expect(contactPoint.contactType).toBe("sales");
  });

  it("Organization schema has sameAs with social URLs", async () => {
    const { container } = render(
      await PublicLayout({ children: <div>test</div> })
    );
    const orgSchema = getOrgSchema(container);
    expect(orgSchema).not.toBeNull();
    const sameAs = orgSchema!.sameAs as string[];
    expect(sameAs).toBeDefined();
    expect(sameAs).toContain("https://facebook.com/riquelmepropiedades");
    expect(sameAs).toContain("https://instagram.com/riquelmepropiedades");
  });
});
