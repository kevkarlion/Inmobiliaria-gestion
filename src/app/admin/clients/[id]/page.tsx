// app/admin/clients/[id]/page.tsx (SERVER)
export const dynamic = "force-dynamic";
export const revalidate = 0;

import ClientDetailClient from "./ClientDetailClient";
import { ClientService } from "@/server/services/client.service";
import { clientResponseDTO } from "@/dtos/client/client-response.dto";
import { notFound } from "next/navigation";
import type { ClientResponse } from "@/dtos/client/client-response.dto";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;

  let clientData: ClientResponse;

  try {
    clientData = await ClientService.findById(id);
  } catch {
    notFound();
    return null;
  }

  const client = clientResponseDTO(clientData);

  return <ClientDetailClient client={client} />;
}
