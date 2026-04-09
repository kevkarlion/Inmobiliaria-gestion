"use client";

import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";

interface SortableImageProps {
  image: string;
  index: number;
  onRemove: (index: number) => void;
}

export default function SortableImage({ image, index, onRemove }: SortableImageProps) {
  // Usar un ID único que incluya el índice para permitir URLs duplicadas
  const uniqueId = `${image}-${index}`;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: uniqueId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative aspect-square rounded-xl border border-white/10 overflow-hidden shadow-lg
        group select-none
        ${isDragging ? "opacity-50 z-50 shadow-2xl ring-2 ring-blue-500" : ""}
      `}
    >
      <Image
        src={image}
        alt={`preview-${index}`}
        fill
        className="object-cover transition-transform group-hover:scale-110"
        unoptimized
      />

      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 bg-black/60 hover:bg-black/80 text-white/80 hover:text-white rounded-md p-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Arrastrar para reordenar"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Delete button — solo esquina superior derecha */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md p-1"
        aria-label="Eliminar imagen"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Overlay sutil en hover — indica que es interactivo, sin tapar */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
