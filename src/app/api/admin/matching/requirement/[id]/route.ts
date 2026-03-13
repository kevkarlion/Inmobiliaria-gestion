import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { MatchingService } from "@/server/services/matching.service";
import { HttpError } from "@/server/errors/http-error";

// GET /api/admin/matching/requirement/[id] - Get property matches for a requirement
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const minScore = searchParams.get("minScore") 
      ? parseInt(searchParams.get("minScore")!, 10) 
      : undefined;

    const matches = await MatchingService.findMatchesForRequirement(id, minScore);
    return NextResponse.json({ matches });
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
