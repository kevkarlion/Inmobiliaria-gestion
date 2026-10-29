/**
 * Schema `CollectionPage`: página de listado (catálogo de propiedades).
 * Envuelve el `ItemList` como `mainEntity` para habilitar resultados
 * enriquecidos de Google en las páginas de colección.
 */
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
