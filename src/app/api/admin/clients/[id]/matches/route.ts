import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { MatchingService, ClientMatchResult } from "@/server/services/matching.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Obtener clientes con intereses similares
    const similarClients = await MatchingService.findSimilarClients(id, 0.3);
    
    return NextResponse.json({ matches: similarClients });
  } catch (error) {
    console.error("Error finding similar clients:", error);
    return NextResponse.json(
      { message: "Error al buscar clientes similares" },
      { status: 500 }
    );
  }
}
