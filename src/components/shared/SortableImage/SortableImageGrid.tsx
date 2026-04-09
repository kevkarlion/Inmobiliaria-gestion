"use client";

import {
  DndContext,
  DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableImage from "./SortableImage";

interface SortableImageGridProps {
  images: string[];
  onReorder: (reorderedImages: string[]) => void;
  onRemove: (index: number) => void;
}

export default function SortableImageGrid({
  images,
  onReorder,
  onRemove,
}: SortableImageGridProps) {
  // Crear IDs únicos para cada imagen
  const imageIds = images.map((image, index) => `${image}-${index}`);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Extraer los índices de los IDs únicos
    const oldId = active.id as string;
    const newId = over.id as string;
    
    const oldIndex = parseInt(oldId.split("-").pop() || "0", 10);
    const newIndex = parseInt(newId.split("-").pop() || "0", 10);

    if (isNaN(oldIndex) || isNaN(newIndex)) return;

    onReorder(arrayMove(images, oldIndex, newIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={imageIds}
        strategy={horizontalListSortingStrategy}
      >
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {images.map((image, index) => (
            <SortableImage
              key={`${image}-${index}`}
              image={image}
              index={index}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
