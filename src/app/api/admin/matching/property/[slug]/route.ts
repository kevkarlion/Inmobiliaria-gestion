import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { PropertyModel } from "@/db/schemas/property.schema";
import { MatchingService } from "@/server/services/matching.service";
import { NotFoundError, HttpError } from "@/server/errors/http-error";

// GET /api/admin/matching/property/[slug] - Get requirement matches for a property
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const minScore = searchParams.get("minScore") 
      ? parseInt(searchParams.get("minScore")!, 10) 
      : undefined;

    // First find the property by slug to get the ID
    const property = await PropertyModel.findOne({ slug }).lean();
    if (!property) {
      throw new NotFoundError("Propiedad no encontrada");
    }

    const matches = await MatchingService.findMatchesForProperty(
      (property._id as any).toString(),
      minScore
    );
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
