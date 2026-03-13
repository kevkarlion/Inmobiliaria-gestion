import { connectDB } from "@/db/connection";
import { RequirementService } from "../services/requirement.service";
import { NextResponse } from "next/server";
import { HttpError } from "@/server/errors/http-error";
import { QueryRequirementDTO } from "@/dtos/requirement/query-requirement.dto";
import { requirementResponseDTO, RequirementResponse } from "@/dtos/requirement/requirement-response.dto";
import { CreateRequirementDTO } from "@/dtos/requirement/create-requirement.dto";
import { UpdateRequirementDTO } from "@/dtos/requirement/update-requirement.dto";

export class RequirementController {
  private static handleError(error: unknown) {
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

  // POST /requirements
  static async create(req: Request) {
    try {
      await connectDB();
      const body = await req.json();

      const dto = new CreateRequirementDTO(body);
      const requirement = await RequirementService.create(dto);

      const response = requirementResponseDTO(requirement);
      return NextResponse.json(response, { status: 201 });
    } catch (error: unknown) {
      console.error("🔴 ERROR EN CONTROLLER:", error);
      return this.handleError(error);
    }
  }

  // GET /requirements
  static async getAll(req: Request) {
    try {
      await connectDB();
      const { searchParams } = new URL(req.url);

      const rawQuery = Object.fromEntries(searchParams);
      const queryDto = new QueryRequirementDTO(rawQuery);

      const { items, meta } = await RequirementService.findAll(queryDto);

      const responseItems: RequirementResponse[] = items.map(requirementResponseDTO);

      return NextResponse.json({
        items: responseItems,
        meta,
      });
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // GET /requirements/by-client/:clientId
  static async getByClientId({ params }: { params: { clientId: string } }) {
    try {
      await connectDB();
      const requirements = await RequirementService.findByClientId(params.clientId);
      const responseItems: RequirementResponse[] = requirements.map(requirementResponseDTO);
      return NextResponse.json(responseItems);
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // GET /requirements/:id
  static async getById({ params }: { params: { id: string } }) {
    try {
      await connectDB();
      const requirement = await RequirementService.findById(params.id);
      return requirementResponseDTO(requirement);
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // PUT /requirements/:id
  static async update(req: Request, { params }: { params: { id: string } }) {
    try {
      await connectDB();
      const body = await req.json();

      const dto = new UpdateRequirementDTO(body);

      const updatedRequirement = await RequirementService.update(params.id, dto);

      return NextResponse.json(requirementResponseDTO(updatedRequirement));
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // DELETE /requirements/:id
  static async delete(req: Request, { params }: { params: { id: string } }) {
    try {
      await connectDB();
      const result = await RequirementService.delete(params.id);
      return NextResponse.json(result);
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }
}
