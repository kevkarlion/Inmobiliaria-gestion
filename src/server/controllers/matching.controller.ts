/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from "@/db/connection";
import { MatchingService } from "../services/matching.service";
import { NextResponse } from "next/server";
import { HttpError } from "@/server/errors/http-error";

export class MatchingController {
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

  // GET /matching/requirement/:id
  static async matchRequirement(req: Request, { params }: { params: { id: string } }) {
    try {
      await connectDB();
      const { searchParams } = new URL(req.url);
      const minScore = searchParams.get("minScore") 
        ? Number(searchParams.get("minScore")) 
        : undefined;

      const matches = await MatchingService.findMatchesForRequirement(
        params.id,
        minScore
      );

      return NextResponse.json({ matches });
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // GET /matching/property/:id
  static async matchProperty(req: Request, { params }: { params: { id: string } }) {
    try {
      await connectDB();
      const { searchParams } = new URL(req.url);
      const minScore = searchParams.get("minScore") 
        ? Number(searchParams.get("minScore")) 
        : undefined;

      const matches = await MatchingService.findMatchesForProperty(
        params.id,
        minScore
      );

      return NextResponse.json({ matches });
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // POST /matching/run-full
  static async runFullMatching(_req: Request) {
    try {
      await connectDB();
      
      const result = await MatchingService.runFullMatching();

      return NextResponse.json({
        message: "Matching completo ejecutado correctamente",
        ...result,
      });
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }
}
