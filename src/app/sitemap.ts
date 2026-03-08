import { MetadataRoute } from "next";
import { PropertyService } from "@/server/services/property.service";
import { SITE_URL } from "@/lib/config";
import { SEO_CATEGORIES } from "@/lib/seoCategories";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const base = SITE_URL;

  const properties = await PropertyService.findAllForSitemap();

  const now = new Date();

  /*
  -------------------------
  Páginas estáticas
  -------------------------
  */

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      changeFrequency: "daily",
      priority: 1,
      lastModified: now,
    },
    {
      url: `${base}/nosotros`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: now,
    },
    {
      url: `${base}/contacto`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: now,
    },
    {
      url: `${base}/propiedades`,
      changeFrequency: "daily",
      priority: 0.8,
      lastModified: now,
    },
  ];

  /*
  -------------------------
  Categorías SEO
  -------------------------
  */

  const categoryRoutes: MetadataRoute.Sitemap = SEO_CATEGORIES.map((category) => ({
    url: `${base}/${category.slug}`,
    changeFrequency: "daily",
    priority: 0.85,
    lastModified: now,
  }));

  /*
  -------------------------
  Propiedades individuales
  -------------------------
  */

  const propertyRoutes: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${base}/propiedad/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...propertyRoutes,
  ];
}