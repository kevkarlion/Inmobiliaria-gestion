import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { MatchingService } from "@/server/services/matching.service";
import { HttpError } from "@/server/errors/http-error";

// POST /api/admin/matching/run - Run full matching for all active requirements
export async function POST(req: Request) {
  try {
    await connectDB();
    
    const result = await MatchingService.runFullMatching();
    
    return NextResponse.json({
      message: "Matching completado",
      processed: result.processed,
      matches: result.matches,
    });
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
