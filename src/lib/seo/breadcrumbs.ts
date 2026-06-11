import { SEO_CONFIG } from "@/lib/seo/config";
import { slugify } from "@/lib/slugify";

interface BreadcrumbItem {
  name: string;
  item: string;
}

export function buildBreadcrumbItems(
  _path: string,
  labels: string[],
  baseUrl?: string
): BreadcrumbItem[] {
  const root = baseUrl ?? SEO_CONFIG.siteUrl;

  return labels.map((label, index) => {
    if (index === 0) {
      return { name: label, item: `${root}/` };
    }

    const isLast = index === labels.length - 1;

    if (isLast) {
      return { name: label, item: "" };
    }

    const url = `${root}/${slugify(label)}`;

    return { name: label, item: url };
  });
}
