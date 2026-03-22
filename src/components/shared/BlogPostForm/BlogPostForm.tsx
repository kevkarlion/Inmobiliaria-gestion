"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TipTapEditor } from "@/components/shared/TipTapEditor/TipTapEditor";
import CloudinaryUploader from "@/components/CloudinaryUploader/CloudinaryUploader";
import { ChevronLeft, Send } from "lucide-react";
import { BLOG_CATEGORIES } from "@/lib/blogCategories";
import { slugify } from "@/lib/slugify";

interface Props {
  initialData?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string;
    featuredImage: string;
    author: string;
    status: "draft" | "published";
    seoTitle: string;
    seoDescription: string;
  };
  postId?: string;
  mode: "create" | "edit";
}

export default function BlogPostForm({ initialData, postId, mode }: Props) {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    category: initialData?.category || "",
    tags: initialData?.tags || "",
    featuredImage: initialData?.featuredImage || "",
    author: initialData?.author || "Riquelme Propiedades",
    status: initialData?.status || "draft",
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleTitleChange(value: string) {
    setForm((f) => ({
      ...f,
      title: value,
      slug: slugify(value),
    }));
  }

  async function handleSubmit(e: FormEvent, publishNow: boolean) {
    e.preventDefault();
    if (!form.title) return toast.error("El título es requerido");
    if (!form.excerpt) return toast.error("El excerpt es requerido");
    if (!form.content || form.content === "<p></p>") return toast.error("El contenido es requerido");
    if (!form.category) return toast.error("La categoría es requerida");

    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        status: publishNow ? "published" : form.status,
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
      };

      const url = mode === "edit" && postId
        ? `/api/admin/blog-post?id=${postId}`
        : "/api/admin/blog-post";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error al guardar");
      }

      toast.success(
        mode === "edit"
          ? "Post actualizado correctamente"
          : publishNow
          ? "Post publicado correctamente"
          : "Post guardado como borrador"
      );
      router.push("/admin/novedades");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar el post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/novedades">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft size={16} />
            Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          {mode === "create" ? "Nuevo Post" : "Editar Post"}
        </h1>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
        {/* Título */}
        <div className="space-y-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Título del post"
            maxLength={120}
            required
          />
          <p className="text-xs text-neutral-500">{form.title.length}/120</p>
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="url-del-post"
          />
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt (reseña) *</Label>
          <Textarea
            id="excerpt"
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            placeholder="Breve descripción del post (máx. 300 caracteres)"
            maxLength={300}
            rows={3}
            required
          />
          <p className="text-xs text-neutral-500">{form.excerpt.length}/300</p>
        </div>

        {/* Categoría */}
        <div className="space-y-2">
          <Label htmlFor="category">Categoría *</Label>
          <Select
            value={form.category}
            onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {BLOG_CATEGORIES.map((cat) => (
                <SelectItem key={cat.slug} value={cat.slug}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Imagen destacada */}
        <div className="space-y-2">
          <Label>Imagen destacada</Label>
          <CloudinaryUploader
            folder="novedades"
            existingImages={form.featuredImage ? [form.featuredImage] : []}
            onImageUpload={(urls) =>
              setForm((f) => ({ ...f, featuredImage: urls[0] || "" }))
            }
          />
          {form.featuredImage && (
            <div className="mt-2 w-48 h-32 rounded-lg overflow-hidden border bg-slate-100 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.featuredImage}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (separados por coma)</Label>
          <Input
            id="tags"
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            placeholder="inmuebles, inversión, consejos"
          />
        </div>

        {/* Contenido */}
        <div className="space-y-2">
          <Label>Contenido *</Label>
          <TipTapEditor
            content={form.content}
            onChange={(html) => setForm((f) => ({ ...f, content: html }))}
            placeholder="Escribí tu artículo aquí..."
          />
        </div>

        {/* SEO */}
        <div className="border-t border-slate-200 pt-6 space-y-4">
          <h3 className="font-semibold text-slate-900">
            SEO (opcional)
          </h3>

          <div className="space-y-2">
            <Label htmlFor="seoTitle">Title SEO</Label>
            <Input
              id="seoTitle"
              value={form.seoTitle}
              onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
              placeholder="Title para el meta tag (si es distinto al título)"
              maxLength={120}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoDescription">Meta description</Label>
            <Textarea
              id="seoDescription"
              value={form.seoDescription}
              onChange={(e) =>
                setForm((f) => ({ ...f, seoDescription: e.target.value }))
              }
              placeholder="Descripción para el meta tag"
              maxLength={160}
              rows={2}
            />
            <p className="text-xs text-neutral-500">
              {form.seoDescription.length}/160
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar borrador"}
          </Button>
          <Button
            type="button"
            onClick={(e) => handleSubmit(e as unknown as FormEvent, true)}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send size={16} className="mr-1" />
            {mode === "edit" && form.status === "published"
              ? "Actualizar publicación"
              : "Publicar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
