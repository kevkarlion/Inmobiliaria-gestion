"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2, Home, Star } from "lucide-react";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  author: string;
  status: "draft" | "published";
  publishedAt: string | null;
  readingTime: number;
  featuredOnHome: boolean;
  homeOrder: number;
  seoTitle?: string;
  seoDescription?: string;
}

interface Props {
  initialPosts: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    /** Artículos seleccionados para la home (todas las páginas). */
    featuredTotal?: number;
  };
  page: number;
}

export default function NovedadesAdminClient({ initialPosts, meta, page }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [currentMeta, setCurrentMeta] = useState(meta);
  const [currentPage, setCurrentPage] = useState(page);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
  }>({ isOpen: false, title: "", message: "", onConfirm: null });

  const router = useRouter();

  async function goToPage(newPage: number) {
    if (newPage < 1 || newPage > currentMeta.pages || newPage === currentPage) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(newPage));
      const res = await fetch(`/api/admin/blog-post?${params.toString()}&isAdmin=true`);
      const data = await res.json();
      setPosts(data.items);
      setCurrentMeta(data.meta);
      setCurrentPage(newPage);
      router.push(`/admin/novedades?page=${newPage}`, { scroll: false });
    } catch {
      toast.error("Error al cargar la página");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setConfirmModal({
      isOpen: true,
      title: "Eliminar Post",
      message: "¿Seguro que querés eliminar este post? Esta acción no se puede deshacer.",
      onConfirm: () => executeDelete(id),
    });
  }

  async function executeDelete(id: string) {
    setConfirmModal((s) => ({ ...s, isOpen: false }));
    try {
      const res = await fetch(`/api/admin/blog-post?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Post eliminado correctamente");
      await refreshPage();
    } catch {
      toast.error("Error al eliminar el post");
    }
  }

  async function toggleFeaturedOnHome(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/admin/blog-post?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featuredOnHome: !current }),
      });

      if (!res.ok) throw new Error();

      // Confiamos en la respuesta del servidor: si el backend no aplicó el
      // cambio, mostramos el estado real en vez de fingir que se guardó.
      const data = await res.json().catch(() => null);
      const applied = data?.featuredOnHome === true;

      setPosts((prev) =>
        prev.map((post) =>
          post._id === id
            ? { ...post, featuredOnHome: applied, homeOrder: data?.homeOrder ?? post.homeOrder }
            : post
        )
      );

      if (applied !== !current) {
        toast.error(
          "El servidor no guardó el cambio. Revisá que el backend esté actualizado."
        );
        return;
      }

      toast.success(
        applied
          ? "Artículo agregado a la home"
          : "Artículo quitado de la home"
      );
      router.refresh();
    } catch {
      toast.error("Error al actualizar la selección de la home");
    }
  }

  async function refreshPage() {
    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    const res = await fetch(`/api/admin/blog-post?${params.toString()}&isAdmin=true`);
    const data = await res.json();
    setPosts(data.items);
    setCurrentMeta(data.meta);
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-base font-semibold text-slate-900">
            Novedades
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentMeta.total} post{currentMeta.total !== 1 ? "s" : ""} en total
            {typeof currentMeta.featuredTotal === "number" && (
              <>
                {" · "}
                <span className="text-gold-sand font-medium">
                  {currentMeta.featuredTotal} en la home
                </span>
              </>
            )}
          </p>
        </div>
        <Link href="/admin/novedades/new">
          <Button className="gap-2">
            <Plus size={16} />
            Nuevo Post
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-3 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                  Título
                </th>
                <th className="text-left px-3 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                  Categoría
                </th>
                <th className="text-left px-3 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                  Estado
                </th>
                <th className="text-left px-3 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                  Home
                </th>
                <th className="text-left px-3 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                  Fecha
                </th>
                <th className="text-right px-3 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <tr
                  key={post._id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-3 py-2">
                    <div>
                      <p className="font-medium text-slate-800 line-clamp-1 text-xs">
                        {post.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate max-w-xs">
                        {post.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-block text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium capitalize">
                      {post.category.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.status === "published" ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() =>
                        toggleFeaturedOnHome(post._id, post.featuredOnHome)
                      }
                      className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-medium transition-colors ${
                        post.featuredOnHome
                          ? "bg-gold-sand/20 text-gold-sand border border-gold-sand/40"
                          : "bg-slate-100 text-slate-500 hover:bg-gold-sand/10 hover:text-gold-sand border border-transparent"
                      }`}
                      title={
                        post.featuredOnHome
                          ? "Quitar de la home"
                          : "Mostrar en la home"
                      }
                      aria-pressed={post.featuredOnHome}
                    >
                      {post.featuredOnHome ? (
                        <>
                          <Star size={11} />
                          En home
                          {post.homeOrder ? ` · ${post.homeOrder}` : ""}
                        </>
                      ) : (
                        <>
                          <Home size={11} />
                          No
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-500 whitespace-nowrap">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("es-AR")
                      : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/novedades/${post._id}/edit`}>
                        <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 text-[10px]">
                          <Pencil size={12} />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 h-7 px-2 text-[10px] text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(post._id)}
                      >
                        <Trash2 size={12} />
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-xs text-slate-500">
                    No hay posts todavía.{" "}
                    <Link href="/admin/novedades/new" className="text-primary hover:underline">
                      Creá el primero
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {currentMeta.pages > 1 && (
          <div className="flex items-center justify-between px-3 py-2 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Página {currentPage} de {currentMeta.pages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1 || loading}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= currentMeta.pages || loading}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onCancel={() => setConfirmModal((s) => ({ ...s, isOpen: false }))}
        onConfirm={confirmModal.onConfirm ?? (() => {})}
      />
    </div>
  );
}
