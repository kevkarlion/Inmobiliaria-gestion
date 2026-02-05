// components/PropertyCardGrid.tsx
import { PropertyUI } from "@/domain/types/PropertyUI.types";
import Image from "next/image";
import Link from "next/link";

interface Props {
  properties?: PropertyUI[]; // si viene undefined, renderizamos skeletons
  skeletonCount?: number; // cantidad de skeletons a mostrar
}

export default function PropertyCardGridSearch({ properties, skeletonCount = 6 }: Props) {
 // Si properties es undefined, mostramos skeletons
if (!properties) {
  return (
    <>
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <div
          key={i}
          className="group bg-white rounded-3xl overflow-hidden shadow-xl animate-pulse h-80"
        >
          <div className="h-52 bg-gray-200 relative" />
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


  const formatAmount = (amount: number) =>
  amount.toLocaleString("es-AR");


  return (
    <>
      {properties.map((p) => (
        <Link
          key={p.id}
          href={`/property/${p.slug}`}
          className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:-translate-y-1 transition"
        >
          <div className="relative h-52">
            <Image
              src={p.images[0] || "/placeholder.jpg"}
              alt={p.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-5 space-y-2">
            <h3 className="font-montserrat font-bold text-sm uppercase">{p.title}</h3>
            <p className="text-xs text-blue-gray">
              {p.typeName} · {p.zoneName}
            </p>
            <p className="font-semibold">
              {p.currency} {formatAmount(p.amount)}
            </p>
            <p className="text-xs text-gray-400">
              {p.bedrooms} hab · {p.totalM2} m²
            </p>
          </div>
        </Link>
      ))}
    </>
  );
}
