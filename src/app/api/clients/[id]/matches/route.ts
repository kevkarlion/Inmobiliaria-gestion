import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { ClientModel } from "@/db/schemas/client.schema";
import { RequirementModel } from "@/domain/models/requirement.model";
import MatchingService from "@/server/services/matching.service";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id: clientId } = await context.params;
  const client = await ClientModel.findById(clientId).lean();
  if (!client) {
    return NextResponse.json({ message: "Client not found" }, { status: 404 });
  }
  const requirements = await RequirementModel.find({ clientId }).lean();
  const matches = MatchingService.computeMatches(client, requirements);
  return NextResponse.json({ matches });
}
