// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { JsonLd } from "@/lib/seo/jsonLd";

describe("JsonLd", () => {
  it("renders a script tag with application/ld+json type", () => {
    const { container } = render(
      <JsonLd type="Organization" data={{ name: "Test" }} />
    );
    const script = container.querySelector("script");
    expect(script).toBeTruthy();
    expect(script?.getAttribute("type")).toBe("application/ld+json");
  });

  it("includes @type from prop if not in data", () => {
    const { container } = render(
      <JsonLd type="Organization" data={{ name: "Test" }} />
    );
    const parsed = JSON.parse(container.querySelector("script")?.innerHTML || "{}");
    expect(parsed["@type"]).toBe("Organization");
  });

  it("includes @context if not in data", () => {
    const { container } = render(
      <JsonLd type="Organization" data={{ name: "Test" }} />
    );
    const parsed = JSON.parse(container.querySelector("script")?.innerHTML || "{}");
    expect(parsed["@context"]).toBe("https://schema.org");
  });

  it("preserves @type already present in data", () => {
    const { container } = render(
      <JsonLd
        type="Organization"
        data={{ "@type": ["Organization", "LocalBusiness"], name: "Test" }}
      />
    );
    const parsed = JSON.parse(container.querySelector("script")?.innerHTML || "{}");
    expect(parsed["@type"]).toEqual(["Organization", "LocalBusiness"]);
  });

  it("includes @id when provided", () => {
    const { container } = render(
      <JsonLd
        type="Organization"
        data={{ name: "Test" }}
        id="https://example.com/#org"
      />
    );
    const parsed = JSON.parse(container.querySelector("script")?.innerHTML || "{}");
    expect(parsed["@id"]).toBe("https://example.com/#org");
  });

  it("renders data unchanged for full schema objects", () => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: "Casa Moderna",
      url: "https://riquelmeprop.com/propiedad/casa-moderna",
    };
    const { container } = render(
      <JsonLd type="RealEstateListing" data={schemaData} />
    );
    const parsed = JSON.parse(container.querySelector("script")?.innerHTML || "{}");
    expect(parsed).toEqual(schemaData);
  });
});
