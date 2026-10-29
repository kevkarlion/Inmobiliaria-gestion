// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
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

import { toast } from "sonner";
import NovedadesAdminClient from "@/components/shared/NovedadesAdminPage/NovedadesAdminPage";

const posts = [
  {
    _id: "p1",
    title: "Zonificación y código urbano",
    slug: "zonificacion-y-codigo-urbano",
    excerpt: "Resumen",
    content: "<p>Contenido</p>",
    category: "normativa",
    tags: [],
    featuredImage: "",
    author: "Riquelme Propiedades",
    status: "published" as const,
    publishedAt: "2026-03-08T00:00:00.000Z",
    readingTime: 6,
    featuredOnHome: true,
    homeOrder: 1,
  },
  {
    _id: "p2",
    title: "Crédito hipotecario 2026",
    slug: "credito-hipotecario-2026",
    excerpt: "Resumen",
    content: "<p>Contenido</p>",
    category: "guias",
    tags: [],
    featuredImage: "",
    author: "Riquelme Propiedades",
    status: "published" as const,
    publishedAt: "2026-03-23T00:00:00.000Z",
    readingTime: 4,
    featuredOnHome: false,
    homeOrder: 0,
  },
];

const meta = { total: 2, page: 1, limit: 12, pages: 1 };

describe("Listado de novedades (curaduría de la home)", () => {
  beforeEach(() => {
    vi.mocked(toast.error).mockClear();
    vi.mocked(toast.success).mockClear();

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => ({ items: posts, meta }) }))
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("muestra qué artículos están seleccionados para la home", () => {
    render(
      <NovedadesAdminClient initialPosts={posts} meta={meta} page={1} />
    );

    const featured = screen.getByText(/En home/);
    expect(featured).toBeDefined();
    expect(screen.getAllByText(/No/).length).toBeGreaterThan(0);
  });

  it("no marca el artículo si el servidor no aplicó el cambio", async () => {
    // Backend que responde 200 pero sin aplicar el flag (backend desactualizado).
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ _id: "p2", featuredOnHome: false, homeOrder: 0 }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    render(
      <NovedadesAdminClient initialPosts={posts} meta={meta} page={1} />
    );

    // p2 está sin destacar: el click debería activarlo.
    const toggle = screen
      .getAllByRole("button")
      .find((b) => b.textContent?.includes("No")) as HTMLButtonElement;

    fireEvent.click(toggle);

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "El servidor no guardó el cambio. Revisá que el backend esté actualizado."
      )
    );

    // El estado real se mantiene: el post sigue sin destacar.
    expect(
      screen.getAllByRole("button").some((b) => b.textContent?.includes("No"))
    ).toBe(true);
  });

  it("activa y desactiva un artículo desde el listado", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ items: posts, meta }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    render(
      <NovedadesAdminClient initialPosts={posts} meta={meta} page={1} />
    );

    fireEvent.click(screen.getByText(/En home/));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit
    ];

    expect(url).toBe("/api/admin/blog-post?id=p1");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(String(init.body))).toEqual({ featuredOnHome: false });
  });
});
