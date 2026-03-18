"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertModal } from "@/components/ui/alert-modal";

interface CloudinaryUploaderProps {
  onImageUpload: (urls: string[]) => void; // acepta múltiples URLs
  folder?: string;
  existingImages?: string[];
}

export default function CloudinaryUploader({
  onImageUpload,
  folder = "properties",
  existingImages = [],
}: CloudinaryUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Alert modal state
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertModalOpen(true);
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setProgress(0);

    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validar tipo
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
          showAlert("Tipo de archivo no válido", "Solo se permiten imágenes JPEG, PNG, GIF o WEBP");
          continue;
        }

        // Validar tamaño (máx 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          showAlert("Archivo demasiado grande", "La imagen es demasiado grande. Máximo 5MB");
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/uploadImg", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.success && data.data) {
          uploadedUrls.push(...data.data);
        }

        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      if (uploadedUrls.length > 0) {
        onImageUpload(uploadedUrls);
      }
    } catch (err) {
      console.error(err);
      showAlert("Error de upload", "Error al subir las imágenes");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-2">
      {/* Input de subida */}
      <label className="block w-full p-4 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-gray-800 transition-all">
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFiles}
          disabled={uploading}
        />
        {uploading ? `Subiendo imágenes... ${progress}%` : "Click o arrastra imágenes aquí"}
      </label>

      {/* Miniaturas */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-2">
          {existingImages.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-lg overflow-hidden border border-white/10"
            >
              <Image
                src={img}
                alt={`Imagen ${idx + 1}`}
                fill
                className="object-cover"
                unoptimized // si las imágenes ya vienen de Cloudinary no necesitas optimización adicional
              />
            </div>
          ))}
        </div>
      )}

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModalOpen}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertModalOpen(false)}
      />
    </div>
  );
}
