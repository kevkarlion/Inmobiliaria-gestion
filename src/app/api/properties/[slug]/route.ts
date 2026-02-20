/* eslint-disable @typescript-eslint/no-explicit-any */
//src/app/api/properties/[slug]/route.ts

import { PropertyController } from "@/server/controllers/property.controller";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const property = await PropertyController.getBySlug(slug);
    return NextResponse.json(property);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 404 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const resolvedParams = await params;
  console.log('resolvedParams',req)

  // Clonamos la petición para poder leer el body sin "gastarlo"
  // antes de que llegue al controlador
  // const clone = req.clone();
  // const body = await clone.json();

  return PropertyController.update(req, { params: resolvedParams });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const resolvedParams = await params;
  return PropertyController.delete(req, { params: resolvedParams });
}
