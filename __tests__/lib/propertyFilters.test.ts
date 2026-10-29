import { describe, expect, it } from "vitest";
import {
  buildBarrioMatchRegex,
  isPropertyUnavailable,
  matchesBarrioQuery,
  sortPropertiesByAvailability,
} from "@/lib/propertyFilters";

describe("isPropertyUnavailable", () => {
  it("treats sold properties as unavailable", () => {
    expect(isPropertyUnavailable({ sold: true, reserved: false })).toBe(true);
  });

  it("treats reserved properties as unavailable", () => {
    expect(isPropertyUnavailable({ sold: false, reserved: true })).toBe(true);
  });

  it("treats active properties as available", () => {
    expect(isPropertyUnavailable({ sold: false, reserved: false })).toBe(false);
  });

  it("handles missing flags", () => {
    expect(isPropertyUnavailable({})).toBe(false);
  });
});

describe("sortPropertiesByAvailability", () => {
  it("moves sold and reserved properties to the end, keeping the relative order", () => {
    const items = [
      { id: "a", sold: false, reserved: false },
      { id: "b", sold: true, reserved: false },
      { id: "c", sold: false, reserved: false },
      { id: "d", sold: false, reserved: true },
    ];

    const sorted = sortPropertiesByAvailability(items);

    expect(sorted.map((i) => i.id)).toEqual(["a", "c", "b", "d"]);
  });

  it("does not mutate the original array", () => {
    const items = [
      { id: "a", sold: true, reserved: false },
      { id: "b", sold: false, reserved: false },
    ];

    sortPropertiesByAvailability(items);

    expect(items.map((i) => i.id)).toEqual(["a", "b"]);
  });
});

describe("buildBarrioMatchRegex", () => {
  it("matches the barrio written with spaces", () => {
    const regex = buildBarrioMatchRegex("210-viviendas")!;
    expect(regex.test("210 Viviendas")).toBe(true);
  });

  it("matches the barrio written with dashes", () => {
    const regex = buildBarrioMatchRegex("210-viviendas")!;
    expect(regex.test("210-viviendas")).toBe(true);
  });

  it("matches the barrio prefixed with 'Barrio'", () => {
    const regex = buildBarrioMatchRegex("210-viviendas")!;
    expect(regex.test("Barrio 210 Viviendas")).toBe(true);
  });

  it("does not match a different barrio", () => {
    const regex = buildBarrioMatchRegex("210-viviendas")!;
    expect(regex.test("Don Fernando")).toBe(false);
  });

  it("returns null for an empty query", () => {
    expect(buildBarrioMatchRegex("")).toBeNull();
  });
});

describe("matchesBarrioQuery", () => {
  it("matches when the barrio name corresponds to the query", () => {
    expect(matchesBarrioQuery("210 Viviendas", "210-viviendas")).toBe(true);
  });

  it("returns false when the barrio name does not correspond", () => {
    expect(matchesBarrioQuery("Don Fernando", "210-viviendas")).toBe(false);
  });

  it("returns true when there is no query", () => {
    expect(matchesBarrioQuery("Don Fernando", undefined)).toBe(true);
  });

  it("returns false when the property has no barrio and a query is set", () => {
    expect(matchesBarrioQuery("", "210-viviendas")).toBe(false);
  });
});
