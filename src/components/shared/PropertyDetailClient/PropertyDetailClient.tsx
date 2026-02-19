import { mapPropertyToUI } from "@/domain/mappers/mapPropertyToUI";
import { PropertyGallery } from "@/components/shared/PropertyGalllery/PropertyGallery";
import { PropertyResponse } from "@/dtos/property/property-response.dto";
import { formatPrice } from "@/utils/formatPrice";
import { PropertyShare } from "@/components/shared/PropertyShare/PropertyShare";

export function PropertyDetailClient({
  property,
}: {
  property: PropertyResponse;
}) {
  const p = mapPropertyToUI(property);

  return (
    /* El section ahora es el contenedor de ancho completo para el background */
    <section className="w-full bg-white-bg">
      {/* Contenedor interno que centra el contenido y maneja el max-width */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* CABECERA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-black/10 pb-10 pt-12 lg:pt-32">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="label-subtitle font-montserrat bg-black text-white px-3 py-1 rounded">
                {p.operationType}
              </span>
              {p.opportunity && (
                <span className="label-subtitle font-montserrat bg-gold-sand text-black px-3 py-1 rounded">
                  Oportunidad
                </span>
              )}
              {p.featured && (
                <span className="label-subtitle font-montserrat bg-oxford text-white px-3 py-1 rounded">
                  Destacada
                </span>
              )}
              {p.premium && (
                <span className="label-subtitle font-montserrat bg-purple-600 text-white px-3 py-1 rounded">
                  Premium
                </span>
              )}
            </div>

            <h1 className="font-montserrat text-4xl md:text-6xl font-black uppercase tracking-tight leading-none text-oxford">
              {p.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-2 text-blue-gray font-semibold">
              <span>📍</span>
              <span>
                {p.street} {p.number}
              </span>
              <span className="opacity-60 italic">| {p.zoneName}</span>
            </div>
          </div>

          <div className="flex flex-col md:items-end">
            <span className="label-subtitle text-blue-gray mb-1">
              Valor de la propiedad
            </span>
            <div className="font-montserrat text-4xl md:text-5xl font-black text-gold-sand flex items-baseline gap-2">
              <span className="text-xl">{p.currency}</span>
              <span>{formatPrice(p.amount)}</span>
            </div>
          </div>
        </div>

        {/* GALERÍA */}
        <div className="mb-14">
          <PropertyGallery images={p.images} />
        </div>

        {/* CONTENIDO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
          <div className="md:col-span-2 space-y-14">
            {p.description && (
              <div className="space-y-4">
                <h3 className="font-montserrat text-2xl font-black uppercase tracking-tight border-l-4 border-gold-sand pl-4 text-oxford">
                  Descripción General
                </h3>
                <p className="whitespace-pre-line leading-relaxed text-lg text-blue-gray">
                  {p.description}
                </p>
              </div>
            )}

            {/* Ficha técnica */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 bg-white rounded-3xl border border-black/5 shadow-xl p-10">
              <Item label="Tipo" value={p.typeName} />
              <Item label="Ambientes" value={p.rooms} />
              <Item label="Dormitorios" value={p.bedrooms} />
              <Item label="Baños" value={p.bathrooms} />
              <Item
                label="Sup. Total"
                value={p.totalM2 ? `${p.totalM2} m²` : null}
              />
              <Item
                label="Sup. Cubierta"
                value={p.coveredM2 ? `${p.coveredM2} m²` : null}
              />
              <Item label="Cochera" value={p.garage ? "Sí" : "No"} />
              <Item label="Antigüedad" value={p.age ? `${p.age} años` : null} />
              <Item label="Estado" value={p.status} />
            </div>

            {/* Tags */}
            {p.tags?.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {p.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-sm bg-black/5 text-oxford px-4 py-1 rounded-full font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA LATERAL */}
          {/* COLUMNA LATERAL */}
          <div className="space-y-6">
            <div className="bg-oxford p-10 rounded-3xl shadow-2xl sticky top-24 text-white flex flex-col">
              <h3 className="font-montserrat text-xl font-black uppercase tracking-tight border-l-4 border-gold-sand pl-4 mb-6">
                Ubicación y Entorno
              </h3>

              <div className="space-y-5">
                <Item
                  label="Dirección"
                  value={`${p.street} ${p.number}`}
                  light
                />
                <Item label="Provincia" value={p.provinceName} light />
                <Item label="Localidad" value={p.cityName} light />
                <Item label="Barrio" value={p.barrioName} light />
                <Item label="Código Postal" value={p.zipCode} light />
                <Item label="Latitud" value={p.lat} light />
                <Item label="Longitud" value={p.lng} light />
              </div>

              {p.mapsUrl && (
                <div className="mt-6 border-t border-white/20 pt-6">
                  <div className="w-full h-56 rounded-2xl overflow-hidden border border-white/10 mb-4">
                    <iframe
                      src={p.mapsUrl}
                      className="w-full h-full"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <a
                    href={p.externalMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-subtitle text-gold-sand hover:text-white transition-colors flex justify-center bg-white/10 py-2 rounded-lg"
                  >
                    Abrir en Google Maps ↗
                  </a>
                </div>
              )}

              {/* BOTÓN CENTRADO */}
              {/* ACCIONES */}
              <div className="mt-10 flex flex-col gap-4 w-full">
                {/* Contacto asesor (tu botón actual) */}
                {p.contactPhone && (
                  <a
                    href={`https://wa.me/54${p.contactPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cta bg-gold-sand text-black hover:bg-gold-hover text-center w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.02]"
                  >
                    Contactar asesor
                  </a>
                )}

                {/* NUEVO: Compartir propiedad por slug */}
                <PropertyShare
                  title={p.title}
                  price={`${p.currency} ${formatPrice(p.amount)}`}
                  zone={p.zoneName}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  function Item({
    label,
    value,
    light = false,
  }: {
    label: string;
    value: React.ReactNode;
    light?: boolean;
  }) {
    if (!value) return null;

    return (
      <div className="flex flex-col gap-0.5">
        <span
          className={`label-subtitle ${light ? "text-gold-secondary" : "text-blue-gray"}`}
        >
          {label}
        </span>
        <span
          className={`text-lg font-semibold ${light ? "text-white" : "text-oxford"}`}
        >
          {value}
        </span>
      </div>
    );
  }
}
