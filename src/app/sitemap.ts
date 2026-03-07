import { MetadataRoute } from "next";
import { PropertyService } from "@/server/services/property.service";
import { SITE_URL } from "@/lib/config";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;

  const properties = await PropertyService.findAllForSitemap();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      changeFrequency: "daily",
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: `${base}/nosotros`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: new Date(),
    },
    {
      url: `${base}/contacto`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: new Date(),
    },
    {
      url: `${base}/propiedades/venta`,
      changeFrequency: "daily",
      priority: 0.8,
      lastModified: new Date(),
    },
    {
      url: `${base}/propiedades/alquiler`,
      changeFrequency: "daily",
      priority: 0.8,
      lastModified: new Date(),
    },
    {
      url: `${base}/propiedades/oportunidad`,
      changeFrequency: "daily",
      priority: 0.8,
      lastModified: new Date(),
    },
  ];

  const propertyRoutes: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${base}/propiedad/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
