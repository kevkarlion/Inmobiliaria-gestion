import { connectDB } from "@/db/connection";
import { mapPropertyToUI } from "@/domain/mappers/mapPropertyToUI";
import { QueryPropertyDTO } from "@/dtos/property/query-property.dto";
import { PropertyService } from "@/server/services/property.service";

type Props = {
  operationType?: "venta" | "alquiler";
  propertyType?: string;
  province?: string;
  city?: string;
  barrio?: string;
  limit?: number;
  isOpportunity?: boolean;
  /** Excluye propiedades vendidas y reservadas de los listados comerciales. */
  excludeUnavailable?: boolean;
  excludeSold?: boolean;
  excludeReserved?: boolean;
};

export async function getUiProperties({
  operationType,
  propertyType,
  province,
  city,
  barrio,
  limit = 20,
  isOpportunity,
  excludeUnavailable,
  excludeSold,
  excludeReserved,
}: Props) {
  await connectDB();

  const queryDto = new QueryPropertyDTO({
    operationType,
    propertyType,
    province,
    city,
    barrio,
    opportunity: isOpportunity,
    excludeSold: excludeUnavailable ? true : excludeSold,
    excludeReserved: excludeUnavailable ? true : excludeReserved,
    limit,
    page: 1,
  });

  const { items } = await PropertyService.findAll(queryDto);

  return items.map((p: unknown) => mapPropertyToUI(p));
}