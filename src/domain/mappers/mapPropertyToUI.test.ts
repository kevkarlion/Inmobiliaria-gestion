import { describe, it, expect } from "vitest";

// Función que extrae coordenadas del iframe de Google Maps
// (duplicada para testing - en producción está en mapPropertyToUI.ts)
function extractCoordinatesFromIframe(embedUrl: string): { lat: string | null; lng: string | null } {
  const lngMatch = embedUrl.match(/!2d(-?[\d.]+)/);
  const latMatch = embedUrl.match(/!3d(-?[\d.]+)/);
  
  return {
    lat: latMatch ? latMatch[1] : null,
    lng: lngMatch ? lngMatch[1] : null,
  };
}

function buildExternalMapsUrl(embedUrl: string, address?: { street?: string; number?: string; city?: string }): string {
  const { lat, lng } = extractCoordinatesFromIframe(embedUrl);
  
  if (lat && lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  
  // Fallback a búsqueda por texto
  const street = address?.street || "";
  const number = address?.number || "";
  const city = address?.city || "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${street} ${number} ${city}`)}`;
}

describe("extractCoordinatesFromIframe", () => {
  it("debe extraer lat y lng del iframe de Google Maps", () => {
    const iframe = "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d9023.692316907285!2d-67.62097503284645!3d-39.029637877068055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMznCsDAxJzQ2LjgiUyA2N8KwMzYnMDkuMSJX!5e1!3m2!1ses!2sar!4v1775765112859";
    
    const result = extractCoordinatesFromIframe(iframe);
    
    expect(result.lat).toBe("-39.029637877068055");
    expect(result.lng).toBe("-67.62097503284645");
  });

  it("debe manejar iframe sin coordenadas", () => {
    const iframe = "https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d100!2d0!3d0";
    
    const result = extractCoordinatesFromIframe(iframe);
    
    expect(result.lat).toBe("0");
    expect(result.lng).toBe("0");
  });

  it("debe retornar null cuando no hay coordenadas", () => {
    const iframe = "https://www.google.com/maps/embed?pb=!1m1";
    
    const result = extractCoordinatesFromIframe(iframe);
    
    expect(result.lat).toBeNull();
    expect(result.lng).toBeNull();
  });

  it("debe manejar iframe vacío", () => {
    const iframe = "";
    
    const result = extractCoordinatesFromIframe(iframe);
    
    expect(result.lat).toBeNull();
    expect(result.lng).toBeNull();
  });
});

describe("buildExternalMapsUrl", () => {
  it("debe generar URL con coordenadas cuando el iframe tiene lat/lng", () => {
    const iframe = "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d9023.692316907285!2d-67.62097503284645!3d-39.029637877068055";
    
    const result = buildExternalMapsUrl(iframe);
    
    expect(result).toBe("https://www.google.com/maps/search/?api=1&query=-39.029637877068055,-67.62097503284645");
  });

  it("debe usar fallback de texto cuando no hay coordenadas", () => {
    const iframe = "";
    const address = { street: "Juana Manso", number: "123", city: "General Roca" };
    
    const result = buildExternalMapsUrl(iframe, address);
    
    expect(result).toBe("https://www.google.com/maps/search/?api=1&query=Juana%20Manso%20123%20General%20Roca");
  });

  it("debe manejar direcciones sin número", () => {
    const iframe = "";
    const address = { street: "Juana Manso", city: "General Roca" };
    
    const result = buildExternalMapsUrl(iframe, address);
    
    expect(result).toBe("https://www.google.com/maps/search/?api=1&query=Juana%20Manso%20%20General%20Roca");
  });

  it("debe manejar dirección vacía en fallback", () => {
    const iframe = "";
    const address = {};
    
    const result = buildExternalMapsUrl(iframe, address);
    
    expect(result).toBe("https://www.google.com/maps/search/?api=1&query=%20%20");
  });

  it("debe codificar caracteres especiales en fallback", () => {
    const iframe = "";
    const address = { street: "Av. San Martín", number: "100", city: "Villa María" };
    
    const result = buildExternalMapsUrl(iframe, address);
    
    expect(result).toContain("Av.%20San%20Mart%C3%ADn");
  });
});