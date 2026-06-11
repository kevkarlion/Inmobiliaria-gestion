interface JsonLdProps {
  type: string;
  data: Record<string, unknown>;
  id?: string;
}

export function JsonLd({ type, data, id }: JsonLdProps) {
  const output: Record<string, unknown> = { ...data };

  if (!output["@context"]) {
    output["@context"] = "https://schema.org";
  }

  if (!output["@type"]) {
    output["@type"] = type;
  }

  if (id) {
    output["@id"] = id;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(output) }}
    />
  );
}
