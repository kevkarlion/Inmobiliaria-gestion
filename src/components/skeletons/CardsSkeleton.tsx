// components/skeletons/CardsSkeleton.tsx
export default function CardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="group bg-white rounded-3xl overflow-hidden shadow-xl animate-pulse"
        >
          {/* Imagen */}
          <div className="h-52 bg-gray-200 relative" />

          {/* Contenido */}
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      ))}
    </>
  );
}
