import { SITE_URL } from "@/lib/config";

interface ItemListProperty {
  slug: string;
  title: string;
}

export function buildItemListSchema(
  properties: ItemListProperty[],
  startPosition: number = 1
): Record<string, unknown> {
  const itemListElement = properties.map((prop, index) => ({
    "@type": "ListItem",
    position: startPosition + index,
    url: `${SITE_URL}/propiedad/${prop.slug}`,
    name: prop.title,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: properties.length,
    itemListElement,
  };
}
