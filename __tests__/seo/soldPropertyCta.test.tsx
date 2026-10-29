// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";

vi.mock("@/components/shared/Analytics", () => ({
  trackFormSubmit: vi.fn(),
}));

import SoldPropertyCta from "@/components/shared/SoldPropertyCta/SoldPropertyCta";

describe("SoldPropertyCta", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("explains that the property was sold and asks for contact", () => {
    render(
      <SoldPropertyCta
        barrio="210 Viviendas"
        city="General Roca"
        typeName="Casa"
        typeSlug="casa"
        propertyTitle="Casa en 210 Viviendas"
      />
    );

    expect(
      screen.getByText(/Esta propiedad ya fue vendida/i)
    ).toBeDefined();
    expect(
      screen.getByText(/opción similar en/i).textContent
    ).toContain("210 Viviendas");
  });

  it("requires name and phone", () => {
    render(
      <SoldPropertyCta
        barrio="210 Viviendas"
        city="General Roca"
        propertyTitle="Casa en 210 Viviendas"
      />
    );

    const name = screen.getByLabelText("Tu nombre") as HTMLInputElement;
    const phone = screen.getByLabelText("Tu teléfono") as HTMLInputElement;

    expect(name.required).toBe(true);
    expect(phone.required).toBe(true);
  });

  it("posts the lead and confirms", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);

    render(
      <SoldPropertyCta
        barrio="210 Viviendas"
        city="General Roca"
        typeName="Casa"
        typeSlug="casa"
        propertyTitle="Casa en 210 Viviendas"
      />
    );

    fireEvent.change(screen.getByLabelText("Tu nombre"), {
      target: { value: "Ana" },
    });
    fireEvent.change(screen.getByLabelText("Tu teléfono"), {
      target: { value: "2984555555" },
    });

    fireEvent.submit(
      document.querySelector("form") as HTMLFormElement
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit
    ];
    expect(url).toBe("/api/clients");

    const payload = JSON.parse(String(init.body));
    expect(payload.name).toBe("Ana");
    expect(payload.phone).toBe("2984555555");
    expect(payload.preferences.operationType).toBe("compra");
    expect(payload.preferences.propertyPreferences[0].propertyType).toBe("casa");
    expect(payload.preferences.propertyPreferences[0].zones[0].barrio).toBe(
      "210 Viviendas"
    );

    await waitFor(() =>
      expect(screen.getByText(/Gracias, Ana/i)).toBeDefined()
    );
  });
});
