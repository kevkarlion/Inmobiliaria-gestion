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
};

export async function getUiProperties({
  operationType,
  propertyType,
  province,
  city,
  barrio,
  limit = 20,
  isOpportunity,
}: Props) {
  await connectDB();

  const queryDto = new QueryPropertyDTO({
    operationType,
    propertyType,
    province,
    city,
    barrio,
    opportunity: isOpportunity,
    limit,
    page: 1,
  });

  const { items } = await PropertyService.findAll(queryDto);

  return items.map((p: unknown) => mapPropertyToUI(p));
}