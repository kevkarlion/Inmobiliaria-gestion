export function pluralizePropertyType(type: string) {
      const map: Record<string, string> = {
        casa: "Casas",
        departamento: "Departamentos",
        terreno: "Terrenos",
        lote: "Lotes",
        local: "Locales",
        oficina: "Oficinas",
      };
    
      const normalized = type.toLowerCase();
    
      return map[normalized] ?? `${type}s`;
    }