"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play, X, Film } from "lucide-react";

interface VideoGalleryProps {
  videos: string[];
}

function getCloudinaryThumbnail(url: string): string {
  return url
    .replace("/upload/", "/upload/w_300/q_auto/")
    .replace(/\.\w+$/, ".jpg");
}

export default function VideoGallery({ videos }: VideoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute("src");
        videoRef.current.load();
      }
    };
  }, []);

  const openModal = (index: number) => {
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedIndex(null);
  };

  if (!videos || videos.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Film className="w-6 h-6 text-gold-sand" />
        <h3 className="font-montserrat text-2xl font-black uppercase tracking-tight border-l-4 border-gold-sand pl-4 text-oxford">
          Galería de Videos
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4">
        {videos.map((url, idx) => (
          <button
            key={idx}
            onClick={() => openModal(idx)}
            className="relative min-h-[220px] sm:min-h-[280px] md:min-h-0 md:aspect-video w-full rounded-2xl overflow-hidden border border-black/5 shadow-xl group cursor-pointer bg-black"
          >
            <Image
              src={getCloudinaryThumbnail(url)}
              alt={`Video ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-14 md:h-14 bg-gold-sand rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-gold-sand/30">
                <Play className="w-7 h-7 md:w-6 md:h-6 text-black ml-0.5" fill="currentColor" />
              </div>
            </div>
            {videos.length > 1 && (
              <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Video {idx + 1} de {videos.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex flex-col md:flex-row md:items-center md:justify-center p-0 md:p-4"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>

          <div
            className="flex-1 md:flex-none md:w-full md:max-w-4xl md:aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={videoRef}
              key={selectedIndex}
              controls
              autoPlay
              className="w-full h-full object-contain rounded-none md:rounded-2xl"
            >
              <source src={videos[selectedIndex]} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </div>
  );
}
