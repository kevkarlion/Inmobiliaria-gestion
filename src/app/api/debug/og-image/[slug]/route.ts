import { NextResponse } from "next/server";
import { PropertyService } from "@/server/services/property.service";
import { buildOgImageUrl } from "@/lib/ogImage";
import { getCanonicalUrl } from "@/lib/config";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const property = await PropertyService.findBySlug(slug);

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Extract first image
    const rawImage = property.images?.[0];
    const imageUrl = typeof rawImage === "string" 
      ? rawImage 
      : rawImage?.url || null;
    
    const optimizedImage = buildOgImageUrl(imageUrl);

    return NextResponse.json({
      slug,
      title: property.title,
      images: property.images,
      firstImageRaw: rawImage,
      firstImageExtracted: imageUrl,
      optimizedImage,
      ogImageUrl: optimizedImage,
      isCloudinary: imageUrl?.includes("res.cloudinary.com") ?? false,
      isAbsolute: imageUrl?.startsWith("http") ?? false,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
