// app/admin/clients/page.tsx (SERVER)
export const dynamic = "force-dynamic";
export const revalidate = 0;

import ClientsAdminClient from "@/components/shared/ClientsAdminPage/ClientsAdminPage";
import ClientNewModal from "./components/ClientNewModal";
import { ClientService } from "@/server/services/client.service";
import { clientResponseDTO, ClientResponse } from "@/dtos/client/client-response.dto";
import { QueryClientDTO } from "@/dtos/client/query-client.dto";
import { getCurrentUser } from "@/lib/auth";

export default async function ClientsAdminPage() {
  // Obtener usuario actual para filtrar
  const currentUser = await getCurrentUser();
  
  const queryDto = new QueryClientDTO({});
  const { items } = await ClientService.findAll(queryDto, currentUser);
  const clients: ClientResponse[] = items.map(clientResponseDTO);

  return <ClientsAdminClient initialClients={clients} />;
}
