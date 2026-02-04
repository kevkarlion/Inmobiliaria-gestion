// import { NextResponse } from "next/server";
//api/properties/route.tsx

import { PropertyController } from "@/server/controllers/property.controller";
// import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {

  return PropertyController.getAll(req);
}

export async function POST(req: Request) {
  console.log('aca toy')
  return PropertyController.create(req);
}
