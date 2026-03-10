import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { PropertyModel } from "@/db/schemas/property.schema";

// GET /api/admin/check-duplicates
export async function GET() {
  try {
    await connectDB();

    const properties = await PropertyModel.find({}).select("title slug status").lean() as any[];

    // Buscar duplicados por título similar
    const titleMap = new Map<string, any[]>();
    
    properties.forEach(p => {
      const normalizedTitle = p.title.toLowerCase().trim();
      if (!titleMap.has(normalizedTitle)) {
        titleMap.set(normalizedTitle, []);
      }
      titleMap.get(normalizedTitle)!.push(p);
    });

    // Encontrar duplicados
    const duplicates: any[] = [];
    titleMap.forEach((props, title) => {
      if (props.length > 1) {
        duplicates.push({ title, properties: props });
      }
    });

    // También buscar slugs que contengan palabras similares
    const similarSlugs: any[] = [];
    properties.forEach((p: any, i: number) => {
      properties.slice(i + 1).forEach((p2: any) => {
        // Si comparten palabras en el título (más de 3 chars)
        const words1 = (p.title as string).toLowerCase().split(" ").filter((w: string) => w.length > 3);
        const words2 = (p2.title as string).toLowerCase().split(" ").filter((w: string) => w.length > 3);
        const intersection = words1.filter((w: string) => words2.includes(w));
        
        if (intersection.length >= 2) {
          similarSlugs.push({
            property1: { title: p.title, slug: p.slug, status: p.status },
            property2: { title: p2.title, slug: p2.slug, status: p2.status },
            sharedWords: intersection
          });
        }
      });
    });

    return NextResponse.json({
      totalProperties: properties.length,
      duplicateCount: duplicates.length,
      duplicates,
      similarSlugs
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
