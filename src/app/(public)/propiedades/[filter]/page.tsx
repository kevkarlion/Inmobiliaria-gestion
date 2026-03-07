// app/propiedades/[filter]/page.tsx
import { getUiProperties } from "@/components/server/data-access/get-ui-properties";
import SearchTypePage from "@/components/shared/SearchTypePage/SearchTypePage";
import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/config";

interface Props {
  params: Promise<{ filter: string }>;
}

const FILTER_COPY: Record<
  string,
  { title: string; description: string }
> = {
  venta: {
    title: "Propiedades en venta en General Roca",
    description:
      "Casas, departamentos y terrenos en venta en General Roca, Río Negro. Encontrá tu próxima inversión con Riquelme Propiedades.",
  },
  alquiler: {
    title: "Propiedades en alquiler en General Roca",
    description:
      "Alquiler de casas y departamentos en General Roca, Río Negro. Opciones para vivienda y uso profesional con asesoramiento experto.",
  },
  oportunidad: {
    title: "Oportunidades inmobiliarias en General Roca",
    description:
      "Propiedades destacadas y oportunidades de inversión inmobiliaria en General Roca, Río Negro, seleccionadas por Riquelme Propiedades.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ filter: string }>;
}): Promise<Metadata> {
  const { filter } = await params;
  const fallback = {
    title: "Propiedades en General Roca",
    description:
      "Buscá propiedades en venta y alquiler en General Roca, Río Negro, filtradas por tipo de operación y características.",
  };

  const copy = FILTER_COPY[filter] ?? fallback;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: getCanonicalUrl(`/propiedades/${filter}`),
    },
  };
}

export default async function Page({ params }: Props) {
  const { filter } = await params;

  const isOpportunity = filter === "oportunidad";
  const operationType = isOpportunity ? undefined : filter;

  const properties = await getUiProperties({
    type: operationType,
    isOpportunity,
    limit: 50,
  });

  return (
    <SearchTypePage
      properties={properties}
      filterParam={filter}
    />
  );
}