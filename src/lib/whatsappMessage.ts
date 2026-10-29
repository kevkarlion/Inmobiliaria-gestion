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

/**
 * Normaliza un teléfono argentino al formato internacional de WhatsApp
 * (54 + 9 + número local).
 *
 * Los teléfonos guardados en las propiedades pueden venir como "02984582082",
 * "2984582082" o "5492984582082"; el prefijo internacional válido siempre es
 * "549" seguido de 10 dígitos.
 *
 * @param phone - Teléfono en cualquier formato local
 * @returns Número internacional sin signos
 */
export function normalizeArgentinePhone(phone?: string): string {
  const digits = (phone ?? "").replace(/\D/g, "");

  if (!digits) return DEFAULT_WHATSAPP;

  // Ya viene en formato internacional.
  if (digits.startsWith("54") && (digits.length === 12 || digits.length === 13)) {
    return digits;
  }

  const local = digits.startsWith("0") ? digits.slice(1) : digits;

  // 11 dígitos con el 9 móvil ya incluido: "92984582082".
  if (local.length === 11 && local.startsWith("9")) {
    return `54${local}`;
  }

  // 10 dígitos: área + número, hay que agregar el 9 móvil.
  if (local.length === 10) {
    return `549${local}`;
  }

  return DEFAULT_WHATSAPP;
}

/**
 * Generate a WhatsApp URL to inquire about a specific property
 * @param title - Property title shown in the prefilled message
 * @param phone - Optional property contact phone (falls back to the agency number)
 * @param reference - Operation reference label (e.g. "Venta")
 * @returns Full WhatsApp URL
 */
export function generatePropertyInquiryUrl(
  title: string,
  phone?: string,
  reference: string = "Venta"
): string {
  const contact = normalizeArgentinePhone(phone);

  const message = `Hola! Quiero consultar por la propiedad ${title} (Ref: ${reference})`;

  return `https://wa.me/${contact}?text=${encodeURIComponent(message)}`;
}
