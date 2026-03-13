import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { RequirementService } from "@/server/services/requirement.service";
import { CreateRequirementDTO } from "@/dtos/requirement/create-requirement.dto";
import { QueryRequirementDTO } from "@/dtos/requirement/query-requirement.dto";
import { HttpError } from "@/server/errors/http-error";

// GET /api/admin/requirements - List all requirements with filters and pagination
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const rawQuery = Object.fromEntries(searchParams);
    const queryDto = new QueryRequirementDTO(rawQuery);

    const { items, meta } = await RequirementService.findAll(queryDto);

    return NextResponse.json({
      items,
      meta,
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

// POST /api/admin/requirements - Create a new requirement
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const dto = new CreateRequirementDTO(body);
    const requirement = await RequirementService.create(dto);

    return NextResponse.json(requirement, { status: 201 });
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
