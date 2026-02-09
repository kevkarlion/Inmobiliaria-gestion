//src/components/server/data-access/get-ui-properties.ts
import { connectDB } from '@/db/connection'
import { mapPropertyToUI } from '@/domain/mappers/mapPropertyToUI';
import { QueryPropertyDTO } from '@/dtos/property/query-property.dto';
import { PropertyService } from '@/server/services/property.service';

// components/server/data-access/get-ui-properties.ts

export const getUiProperties = async (params: {
  type?: string;
  limit?: number;
  isOpportunity?: boolean;
}) => {

  await connectDB();

  const queryDto = new QueryPropertyDTO({
    operationType: params.type,
    opportunity: params.isOpportunity,
    limit: params.limit,
    page: 1,
  });

  const { items } = await PropertyService.findAll(queryDto);
  console.log('items', items)

  return items.map(mapPropertyToUI);
};
