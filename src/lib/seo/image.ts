interface AltTextProperty {
  title: string;
  operationType?: string;
  barrioName?: string;
  cityName?: string;
}

export function generateAltText(
  property: AltTextProperty,
  index?: number
): string {
  const parts: string[] = [property.title];

  if (property.operationType) {
    parts.push("en", property.operationType);
  }

  const location = [property.barrioName, property.cityName]
    .filter(Boolean)
    .join(", ");

  if (location) {
    parts.push("en", location);
  }

  let result = parts.join(" ");

  if (index && index > 0) {
    result += ` — Imagen ${index}`;
  }

  return result;
}
