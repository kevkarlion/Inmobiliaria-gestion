import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { RequirementService } from "@/server/services/requirement.service";
import { UpdateRequirementDTO } from "@/dtos/requirement/update-requirement.dto";
import { HttpError } from "@/server/errors/http-error";

// GET /api/admin/requirements/[id] - Get requirement by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const requirement = await RequirementService.findById(id);
    return NextResponse.json(requirement);
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

// PUT /api/admin/requirements/[id] - Update requirement
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const dto = new UpdateRequirementDTO(body);
    const requirement = await RequirementService.update(id, dto);

    return NextResponse.json(requirement);
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

// DELETE /api/admin/requirements/[id] - Delete requirement
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const result = await RequirementService.delete(id);
    return NextResponse.json(result);
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
