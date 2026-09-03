interface BreadcrumbItem {
  name: string;
  item: string;
}

export function buildBreadcrumbListSchema(
  items: BreadcrumbItem[]
): Record<string, unknown> {
  const itemListElement = items.map((crumb, index) => {
    const entry: Record<string, unknown> = {
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
    };
    // Solo emitir "item" si es una URL absoluta válida (nunca cadena vacía).
    if (crumb.item && crumb.item.startsWith("http")) {
      entry.item = crumb.item;
    }
    return entry;
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}
