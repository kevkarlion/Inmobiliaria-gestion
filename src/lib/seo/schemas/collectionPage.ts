export function buildCollectionPageSchema(
  url: string,
  itemList: Record<string, unknown>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url,
    mainEntity: itemList,
  };
}
