/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/uploadImg/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "properties";

    if (!file) {
      return NextResponse.json({ success: false, error: "No hay archivo" }, { status: 400 });
    }

    // Convertimos el archivo a Buffer para Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subida directa a Cloudinary mediante Promesa
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: folder },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({ 
      success: true, 
      data: [result.secure_url] 
    });

  } catch (error: any) {
    console.error("Error upload:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}