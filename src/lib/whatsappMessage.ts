/**
 * WhatsApp message generator for tasación leads
 * Generates pre-filled WhatsApp messages from form data
 */

/**
 * Generate a pre-filled WhatsApp message URL
 * @param phone - WhatsApp phone number (with country code, no +)
 * @param name - Contact name
 * @param propertyType - Type of property
 * @param city - City location
 * @param neighborhood - Neighborhood (optional)
 * @returns Full WhatsApp URL
 */
export function generateWhatsAppUrl(
  phone: string,
  name: string,
  propertyType: string,
  city: string,
  neighborhood?: string
): string {
  const propertyTypeLabels: Record<string, string> = {
    casa: "Casa",
    departamento: "Departamento",
    terreno: "Terreno",
    local: "Local comercial",
    campo: "Campo/Chacra",
  };

  const location = neighborhood ? `${neighborhood}, ${city}` : city;
  const typeLabel = propertyTypeLabels[propertyType] || propertyType;

  const message = `Hola! Me llamo ${name} y me gustaría solicitar una tasación para mi ${typeLabel} en ${location}. ¿Podrían darme más información sobre el proceso de tasación?`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

/**
 * Generate a simple contact WhatsApp message
 * @param phone - WhatsApp phone number
 * @returns Full WhatsApp URL
 */
export function generateSimpleWhatsAppUrl(phone: string): string {
  const message = "Hola! Me gustaría solicitar una tasación de mi propiedad.";
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

/**
 * Default WhatsApp number for Riquelme Propiedades
 */
export const DEFAULT_WHATSAPP = "5492984582082";
