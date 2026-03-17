import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { MatchingService, ClientMatchResult } from "@/server/services/matching.service";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Obtener el usuario actual
    const currentUser = await getCurrentUser();
    const currentUserId = currentUser?.id;
    
    // Obtener clientes con intereses similares
    const allMatches = await MatchingService.findSimilarClients(id, 0.3);
    
    // Filtrar matches: si es del mismo usuario, mostrar datos; si es de otro, solo indicar que existe
    const filteredMatches = allMatches.map((match: ClientMatchResult) => {
      // Comparar si el match fue creado por el mismo usuario
      const isSameUser = match.createdBy?.userId === currentUserId;
      
      if (isSameUser) {
        // Mismo usuario: devolver datos completos
        return {
          ...match,
          isOtherAdvisor: false,
        };
      } else {
        // Otro usuario: solo devolver score e indicador
        return {
          clientId: match.clientId,
          clientName: null, // Ocultar nombre
          score: match.score,
          operationMatch: match.operationMatch,
          propertyTypeMatch: match.propertyTypeMatch,
          zoneMatch: match.zoneMatch,
          priceOverlap: match.priceOverlap,
          priceBonus: match.priceBonus,
          createdBy: match.createdBy,
          isOtherAdvisor: true, // Indicar que es de otro asesor
        };
      }
    });
    
    return NextResponse.json({ matches: filteredMatches });
  } catch (error) {
    console.error("Error finding similar clients:", error);
    return NextResponse.json(
      { message: "Error al buscar clientes similares" },
      { status: 500 }
    );
  }
}
