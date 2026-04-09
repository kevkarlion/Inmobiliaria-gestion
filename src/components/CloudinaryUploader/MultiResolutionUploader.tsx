"use client";

import { useState } from "react";
import CloudinaryUploader from "./CloudinaryUploader";
import SortableImageGrid from "@/components/shared/SortableImage/SortableImageGrid";

interface MultiResolutionUploaderProps {
  onImagesDesktop: (urls: string[]) => void;
  onImagesMobile: (urls: string[]) => void;
  existingDesktop?: string[];
  existingMobile?: string[];
}

export default function MultiResolutionUploader({
  onImagesDesktop,
  onImagesMobile,
  existingDesktop = [],
  existingMobile = [],
}: MultiResolutionUploaderProps) {
  const [desktopImages, setDesktopImages] = useState<string[]>(existingDesktop);
  const [mobileImages, setMobileImages] = useState<string[]>(existingMobile);

  const handleDesktopUpload = (urls: string[]) => {
    const newImages = [...desktopImages, ...urls];
    setDesktopImages(newImages);
    onImagesDesktop(newImages);
  };

  const handleMobileUpload = (urls: string[]) => {
    const newImages = [...mobileImages, ...urls];
    setMobileImages(newImages);
    onImagesMobile(newImages);
  };

  const removeDesktopImage = (index: number) => {
    const newImages = desktopImages.filter((_, i) => i !== index);
    setDesktopImages(newImages);
    onImagesDesktop(newImages);
  };

  const removeMobileImage = (index: number) => {
    const newImages = mobileImages.filter((_, i) => i !== index);
    setMobileImages(newImages);
    onImagesMobile(newImages);
  };

  const handleDesktopReorder = (reorderedImages: string[]) => {
    setDesktopImages(reorderedImages);
    onImagesDesktop(reorderedImages);
  };

  const handleMobileReorder = (reorderedImages: string[]) => {
    setMobileImages(reorderedImages);
    onImagesMobile(reorderedImages);
  };

  return (
    <div className="space-y-6">
      {/* Desktop Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-300">Imágenes Desktop</span>
          <span className="text-xs text-gray-500">(1200 x 900)</span>
        </div>
        <CloudinaryUploader
          onImageUpload={handleDesktopUpload}
          folder="properties/desktop"
          existingImages={desktopImages}
        />
        {desktopImages.length > 0 && (
          <SortableImageGrid
            images={desktopImages}
            onReorder={handleDesktopReorder}
            onRemove={removeDesktopImage}
          />
        )}
      </div>

      {/* Mobile Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-300">Imágenes Mobile</span>
          <span className="text-xs text-gray-500">(1080 x 1350)</span>
        </div>
        <CloudinaryUploader
          onImageUpload={handleMobileUpload}
          folder="properties/mobile"
          existingImages={mobileImages}
        />
        {mobileImages.length > 0 && (
          <SortableImageGrid
            images={mobileImages}
            onReorder={handleMobileReorder}
            onRemove={removeMobileImage}
          />
        )}
      </div>
    </div>
  );
}
