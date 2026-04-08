"use client";

import { useState } from "react";
import CloudinaryUploader from "./CloudinaryUploader";

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
          <div className="flex flex-wrap gap-2">
            {desktopImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => removeDesktopImage(idx)}
                className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-400 px-2 py-1 rounded transition-colors"
              >
                Eliminar {idx + 1}
              </button>
            ))}
          </div>
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
          <div className="flex flex-wrap gap-2">
            {mobileImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => removeMobileImage(idx)}
                className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-400 px-2 py-1 rounded transition-colors"
              >
                Eliminar {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
