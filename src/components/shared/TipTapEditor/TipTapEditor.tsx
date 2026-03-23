"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Undo,
  Redo,
  Image as ImageIcon,
} from "lucide-react";
import { useCallback, useEffect } from "react";

interface TipTapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

export function TipTapEditor({
  content = "",
  onChange,
  placeholder = "Escribí tu contenido aquí...",
}: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl shadow-lg max-w-full",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral dark:prose-invert max-w-none min-h-[300px] focus:outline-none px-4 py-3",
      },
    },
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL de la imagen");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="border border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden bg-neutral-50 dark:bg-neutral-900 animate-pulse">
        <div className="relative h-10 flex flex-wrap items-center gap-1 px-2 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
          <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 h-full">
          <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />
          <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded" />
          </div>
        </div>
        <div className="px-4 py-3 min-h-[300px]">
          <div className="space-y-3">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-4/5" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-900 flex flex-col max-h-[500px]">
      {/* Toolbar - sticky */}
      <div className="sticky top-0 z-20 flex-none h-10 flex flex-wrap items-center gap-1 px-2 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
        <div className="flex flex-wrap items-center gap-1 h-full">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("bold")
              ? "bg-primary/20 text-primary"
              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
          aria-label="Negrita"
        >
          <Bold size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("italic")
              ? "bg-primary/20 text-primary"
              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
          aria-label="Cursiva"
        >
          <Italic size={16} />
        </button>

        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-primary/20 text-primary"
              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
          aria-label="Título 2"
        >
          <Heading2 size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-primary/20 text-primary"
              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
          aria-label="Título 3"
        >
          <Heading3 size={16} />
        </button>

        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("bulletList")
              ? "bg-primary/20 text-primary"
              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
          aria-label="Lista"
        >
          <List size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("orderedList")
              ? "bg-primary/20 text-primary"
              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
          aria-label="Lista numerada"
        >
          <ListOrdered size={16} />
        </button>

        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded transition-colors ${
            editor.isActive("link")
              ? "bg-primary/20 text-primary"
              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
          aria-label="Agregar enlace"
        >
          <LinkIcon size={16} />
        </button>

        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          aria-label="Agregar imagen"
        >
          <ImageIcon size={16} />
        </button>

        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-40"
          aria-label="Deshacer"
        >
          <Undo size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-40"
          aria-label="Rehacer"
        >
          <Redo size={16} />
        </button>
        </div>
      </div>

      {/* Editor - scrollable area */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
