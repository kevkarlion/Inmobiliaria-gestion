// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/components/shared/TipTapEditor/TipTapEditor", () => ({
  TipTapEditor: ({ content }: { content: string }) => (
    <div data-testid="editor">{content}</div>
  ),
}));

vi.mock("@/components/CloudinaryUploader/CloudinaryUploader", () => ({
  default: () => <div data-testid="uploader" />,
}));

import BlogPostForm from "@/components/shared/BlogPostForm/BlogPostForm";

const initialData = {
  title: "Zonificación y código urbano",
  slug: "zonificacion-y-codigo-urbano",
  excerpt: "Qué tenés que saber antes de comprar o construir.",
  content: "<p>Contenido</p>",
  category: "normativa",
  tags: "",
  featuredImage: "",
  author: "Riquelme Propiedades",
  status: "published" as const,
  featuredOnHome: false,
  homeOrder: "0",
  seoTitle: "",
  seoDescription: "",
};

describe("BlogPostForm (curaduría de la home)", () => {
  beforeEach(() => {
    // Radix (Switch) requiere ResizeObserver, que jsdom no implementa.
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    );

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => ({}) }))
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("muestra el switch para destacar el artículo en la home", () => {
    render(<BlogPostForm mode="edit" postId="p1" initialData={initialData} />);

    const toggle = screen.getByLabelText(
      "Destacado en la home"
    ) as HTMLButtonElement;
    expect(toggle).toBeDefined();
    expect(toggle.getAttribute("data-state")).toBe("unchecked");
  });

  it("muestra el orden configurado en la home", () => {
    render(
      <BlogPostForm
        mode="edit"
        postId="p1"
        initialData={{ ...initialData, featuredOnHome: true, homeOrder: "3" }}
      />
    );

    const order = screen.getByLabelText("Orden en la home") as HTMLInputElement;
    expect(order.value).toBe("3");

    const toggle = screen.getByLabelText(
      "Destacado en la home"
    ) as HTMLButtonElement;
    expect(toggle.getAttribute("data-state")).toBe("checked");
  });

  it("envía la selección de la home al guardar", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({}) }));
    vi.stubGlobal("fetch", fetchMock);

    render(<BlogPostForm mode="edit" postId="p1" initialData={initialData} />);

    fireEvent.click(screen.getByLabelText("Destacado en la home"));
    fireEvent.change(screen.getByLabelText("Orden en la home"), {
      target: { value: "2" },
    });

    fireEvent.submit(document.querySelector("form") as HTMLFormElement);

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());

    const [, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit
    ];
    const payload = JSON.parse(String(init.body));

    expect(payload.featuredOnHome).toBe(true);
    expect(payload.homeOrder).toBe(2);
  });
});
