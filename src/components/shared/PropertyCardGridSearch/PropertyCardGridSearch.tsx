// components/PropertyCardGrid.tsx
import { PropertyUI } from "@/domain/types/PropertyUI.types";
import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, Layers, Home, MessageCircle } from "lucide-react";
import { buildPropertySeoTitle } from "@/lib/seo/propertyTitle";
import { generatePropertyInquiryUrl } from "@/lib/whatsappMessage";
import { SITE_URL } from "@/lib/config";

interface Props {
  properties?: PropertyUI[]; // si viene undefined, renderizamos skeletons
  skeletonCount?: number; // cantidad de skeletons a mostrar
}

const isLandType = (typeSlug?: string) =>
  typeSlug === "terreno" || typeSlug === "loteo" || typeSlug === "lote";

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
      {properties.map((p) => {
        const isLand = isLandType(p.typeSlug);

        // Título estandarizado (cola larga) para SEO + CTA de WhatsApp.
        const seoTitle = buildPropertySeoTitle({
          typeName: p.typeName,
          barrioName: p.barrioName,
          cityName: p.cityName,
          operationType: p.operationType,
        });

        const whatsappUrl = generatePropertyInquiryUrl(
          seoTitle,
          p.contactPhone,
          p.operationType === "venta" ? "Venta" : "Alquiler",
          `${SITE_URL}/propiedad/${p.slug}`
        );

        return (
        <div
          key={p.id}
          className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-transparent hover:border-gold-sand/30 hover:-translate-y-1 transition-all duration-300 flex flex-col"
        >
          <Link href={`/propiedad/${p.slug}`} className="block flex-1">
            {/* IMAGEN CON OVERLAY */}
            <div className="relative h-52 overflow-hidden">
              <Image
                src={p.images[0] || "/placeholder.jpg"}
                alt={seoTitle}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Operación badge */}
              <div className="absolute top-3 left-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  p.operationType === "venta"
                    ? "bg-gold-sand text-oxford"
                    : "bg-blue-600 text-white"
                }`}>
                  {p.operationType === "venta" ? "Venta" : "Alquiler"}
                </span>
              </div>

              {/* RIBBON: Reserved - Diagonal from middle-top to extended past right */}
              {p.reserved && (
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                  <div
                    className="absolute text-white text-xs font-black uppercase tracking-wider py-1 shadow-lg flex items-center justify-center"
                    style={{
                      backgroundColor: '#67EA81',
                      left: '43%',
                      top: '-12%',
                      width: '81%',
                      transformOrigin: '0% 0%',
                      transform: 'rotate(29.74deg)',
                    }}
                  >
                    <span className="whitespace-nowrap font-montserrat">{p.reservedIsMale ? "RESERVADO" : "RESERVADA"}</span>
                  </div>
                </div>
              )}

              {/* RIBBON: Sold - Diagonal from middle-top to extended past right */}
              {p.sold && (
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                  <div
                    className="absolute text-white text-xs font-black uppercase tracking-wider py-1 shadow-lg flex items-center justify-center"
                    style={{
                      backgroundColor: '#EB4D23',
                      left: '43%',
                      top: '-12%',
                      width: '81%',
                      transformOrigin: '0% 0%',
                      transform: 'rotate(29.74deg)',
                    }}
                  >
                    <span className="whitespace-nowrap font-montserrat">{p.soldIsMale ? "VENDIDO" : "VENDIDA"}</span>
                  </div>
                </div>
              )}

              {/* Tipo propiedad */}
              <div className="absolute bottom-3 left-3">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/90 bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                  {p.typeName}
                </span>
              </div>

              {/* Gradiente inferior */}
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            </div>

            <div className="p-4 space-y-3">
              {/* Tipo y zona */}
              <div>
                <p className="text-gold-sand text-[9px] font-bold uppercase tracking-widest">
                  {p.typeName}
                </p>
                <h3 className="font-montserrat font-bold text-sm text-neutral-800 leading-tight group-hover:text-gold-sand transition-colors line-clamp-2">
                  {seoTitle}
                </h3>
                {p.title && p.title !== seoTitle && (
                  <p className="text-xs text-neutral-500 leading-snug line-clamp-2 mt-1">
                    {p.title}
                  </p>
                )}
              </div>

              {/* Dirección */}
              {p.zoneName && (
                <div className="flex items-center gap-1 text-neutral-500 text-xs">
                  <MapPin className="w-3 h-3 text-gold-sand/60 shrink-0" />
                  <span className="truncate">{p.zoneName}</span>
                </div>
              )}

              {/* Features */}
              <div className="flex items-center gap-3 py-2 border-y border-neutral-100">
                {/* Ambientes - solo si NO es terreno/loteo */}
                {!isLand && p.bedrooms !== undefined && p.bedrooms > 0 && (
                  <div className="flex items-center gap-1 text-neutral-600 text-xs">
                    <BedDouble className="w-3.5 h-3.5 text-gold-sand" />
                    <span>{p.bedrooms}</span>
                  </div>
                )}

                {/* M2 Cubiertos - si existe */}
                {p.coveredM2 !== undefined && p.coveredM2 > 0 && (
                  <div className="flex items-center gap-1 text-neutral-600 text-xs">
                    <Home className="w-3.5 h-3.5 text-gold-sand" />
                    <span>{p.coveredM2} m²</span>
                  </div>
                )}

                {/* M2 Total / Terreno */}
                {p.totalM2 !== undefined && p.totalM2 > 0 && (
                  <div className="flex items-center gap-1 text-neutral-600 text-xs">
                    <Layers className="w-3.5 h-3.5 text-gold-sand" />
                    <span>{p.totalM2} m²</span>
                  </div>
                )}
              </div>

              {/* Precio */}
              <p className="font-bold text-lg text-neutral-800">
                <span className="text-gold-sand text-xs font-semibold mr-0.5">{p.currency}</span>
                {formatAmount(p.amount)}
              </p>
            </div>
          </Link>

          {/* CTA directo de WhatsApp */}
          <div className="px-4 pb-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#25D366]/40 text-[#128C4A] bg-[#25D366]/10 hover:bg-[#25D366]/20 text-xs font-bold uppercase tracking-wider transition-colors"
              aria-label={`Consultar por WhatsApp: ${seoTitle}`}
            >
              <MessageCircle size={14} />
              Consultar por WhatsApp
            </a>
          </div>
        </div>
        );
      })}
    </>
  );
}
