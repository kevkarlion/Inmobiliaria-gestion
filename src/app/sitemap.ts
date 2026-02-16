import { MetadataRoute } from "next";
import { PropertyService } from "@/server/services/property.service";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.riquelmeprop.com";

  const properties = await PropertyService.findAllForSitemap();

  return properties.map((p) => ({
    url: `${base}/propiedad/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "daily",
    priority: 0.9,
  }));
}
