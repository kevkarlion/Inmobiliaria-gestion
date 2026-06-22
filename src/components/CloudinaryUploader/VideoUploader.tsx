"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Video, Loader2 } from "lucide-react";
import { AlertModal } from "@/components/ui/alert-modal";

interface VideoUploaderProps {
  onVideosChange: (urls: string[]) => void;
  existingVideos?: string[];
  maxVideos?: number;
}

function getCloudinaryThumbnail(url: string): string {
  return url
    .replace("/upload/", "/upload/w_300/q_auto/")
    .replace(/\.\w+$/, ".jpg");
}

export default function VideoUploader({
  onVideosChange,
  existingVideos = [],
  maxVideos = 3,
}: VideoUploaderProps) {
  const [videos, setVideos] = useState<string[]>(existingVideos);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

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

        const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
        if (!allowedTypes.includes(file.type)) {
          showAlert("Formato no soportado", "Formato de video no soportado. Use mp4, webm o mov");
          continue;
        }

        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
          showAlert("Archivo demasiado grande", "El video no puede superar los 50MB");
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/uploadVideo", {
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
        const newVideos = [...videos, ...uploadedUrls];
        setVideos(newVideos);
        onVideosChange(newVideos);
      }
    } catch (err) {
      console.error(err);
      showAlert("Error de upload", "Error al subir el video");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
    onVideosChange(newVideos);
  };

  return (
    <div className="space-y-4">
      {videos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {videos.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group"
            >
              <Image
                src={getCloudinaryThumbnail(url)}
                alt={`Video ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 25vw"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Video className="w-8 h-8 text-white/80" />
              </div>
              <button
                type="button"
                onClick={() => removeVideo(idx)}
                className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {videos.length < maxVideos ? (
        <label className="block w-full p-4 border-2 border-dashed border-white/20 rounded-lg text-center cursor-pointer hover:bg-white/5 transition-all">
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFiles}
            disabled={uploading}
          />
          {uploading ? (
            <span className="flex items-center justify-center gap-2 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Subiendo video... {progress}%
            </span>
          ) : (
            <span className="text-gray-400 flex items-center justify-center gap-2">
              <Video className="w-5 h-5" />
              Click para seleccionar video
            </span>
          )}
        </label>
      ) : (
        <p className="text-sm text-gray-500 text-center">
          Máximo {maxVideos} videos por propiedad
        </p>
      )}

      <AlertModal
        isOpen={alertModalOpen}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertModalOpen(false)}
      />
    </div>
  );
}
