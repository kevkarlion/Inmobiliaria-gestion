// import { NextResponse } from "next/server";
import { PropertyController } from "@/server/controllers/property.controller";
// import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  // const admin = await requireAdmin();

  // if (!admin) {
  //   return NextResponse.json(
  //     { error: "No autorizado" },
  //     { status: 401 }
  //   );
  // }

  return PropertyController.getAll(req);
}

export async function POST(req: Request) {
  return PropertyController.create(req);
}
