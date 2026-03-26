/**
 * API Route: POST /api/tasacion
 * Handles tasación (property valuation) lead submissions
 */
import { NextResponse } from "next/server";
import { sendTasacionEmail } from "@/server/services/tasacion-email.service";

/**
 * Zod schemas for form validation
 */
const contactSchema = {
  name: (val: unknown) => {
    if (typeof val !== "string" || val.trim().length < 2) {
      return "El nombre debe tener al menos 2 caracteres";
    }
    return null;
  },
  email: (val: unknown) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof val !== "string" || !emailRegex.test(val)) {
      return "Email inválido";
    }
    return null;
  },
  phone: (val: unknown) => {
    const phoneRegex = /^[\d\s\-+()]{10,}$/;
    if (typeof val !== "string" || !phoneRegex.test(val.replace(/\s/g, ""))) {
      return "Teléfono inválido (mínimo 10 dígitos)";
    }
    return null;
  },
  contactPreference: (val: unknown) => {
    if (!["email", "whatsapp", "phone"].includes(val as string)) {
      return "Selecciona una opción válida";
    }
    return null;
  },
};

const locationSchema = {
  city: (val: unknown) => {
    if (typeof val !== "string" || val.trim().length === 0) {
      return "La ciudad es requerida";
    }
    return null;
  },
};

const propertyTypeSchema = {
  propertyType: (val: unknown) => {
    if (!["casa", "departamento", "terreno", "local", "campo"].includes(val as string)) {
      return "Selecciona un tipo de propiedad";
    }
    return null;
  },
  propertyState: (val: unknown) => {
    if (!["nuevo", "usado", "a_reciclar"].includes(val as string)) {
      return "Selecciona el estado de la propiedad";
    }
    return null;
  },
};

const contextSchema = {
  reason: (val: unknown) => {
    if (!["vender", "comprar", "refinancing", "sucesion", "otro"].includes(val as string)) {
      return "Selecciona un motivo";
    }
    return null;
  },
  timeline: (val: unknown) => {
    if (!["inmediata", "3_6_meses", "6_12_meses", "sin_urgencia"].includes(val as string)) {
      return "Selecciona un plazo";
    }
    return null;
  },
};

/**
 * Sanitize input string - trim and strip HTML tags
 */
function sanitizeString(str: string): string {
  return str.trim().replace(/<[^>]*>/g, "");
}

/**
 * Validate form data
 */
function validateFormData(data: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate Step 1: Contact
  const step1 = data.step1 as Record<string, unknown> | undefined;
  if (step1) {
    if (contactSchema.name(step1.name)) errors.push(contactSchema.name(step1.name)!);
    if (contactSchema.email(step1.email)) errors.push(contactSchema.email(step1.email)!);
    if (contactSchema.phone(step1.phone)) errors.push(contactSchema.phone(step1.phone)!);
    if (contactSchema.contactPreference(step1.contactPreference)) {
      errors.push(contactSchema.contactPreference(step1.contactPreference)!);
    }
  } else {
    errors.push("Faltan datos de contacto");
  }

  // Validate Step 2: Location
  const step2 = data.step2 as Record<string, unknown> | undefined;
  if (step2) {
    if (locationSchema.city(step2.city)) errors.push(locationSchema.city(step2.city)!);
  } else {
    errors.push("Faltan datos de ubicación");
  }

  // Validate Step 3: Property Type
  const step3 = data.step3 as Record<string, unknown> | undefined;
  if (step3) {
    if (propertyTypeSchema.propertyType(step3.propertyType)) {
      errors.push(propertyTypeSchema.propertyType(step3.propertyType)!);
    }
    if (propertyTypeSchema.propertyState(step3.propertyState)) {
      errors.push(propertyTypeSchema.propertyState(step3.propertyState)!);
    }
  } else {
    errors.push("Faltan datos del tipo de propiedad");
  }

  // Validate Step 5: Context
  const step5 = data.step5 as Record<string, unknown> | undefined;
  if (step5) {
    if (contextSchema.reason(step5.reason)) errors.push(contextSchema.reason(step5.reason)!);
    if (contextSchema.timeline(step5.timeline)) errors.push(contextSchema.timeline(step5.timeline)!);
  } else {
    errors.push("Faltan datos del contexto");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * POST handler for tasación submissions
 */
export async function POST(req: Request) {
  try {
    // Parse request body
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // Honeypot check - if website_url is filled, it's likely a bot
    if (body.website_url && typeof body.website_url === "string" && body.website_url.length > 0) {
      console.log("[Tasacion API] Potential spam detected:", body.website_url);
      // Fail silently - don't let bots know they were caught
      return NextResponse.json(
        { success: true, message: "Solicitud recibida" },
        { status: 200 }
      );
    }

    // Validate form data
    const validation = validateFormData(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    // Extract and sanitize data
    const step1 = body.step1 as Record<string, unknown>;
    const step2 = body.step2 as Record<string, unknown>;
    const step3 = body.step3 as Record<string, unknown>;
    const step4 = body.step4 as Record<string, unknown> || {};
    const step5 = body.step5 as Record<string, unknown>;
    const step6 = body.step6 as Record<string, unknown> || {};

    // Prepare data for email service
    const emailData = {
      name: sanitizeString(step1.name as string),
      email: sanitizeString(step1.email as string),
      phone: sanitizeString(step1.phone as string),
      contactPreference: step1.contactPreference as "email" | "whatsapp" | "phone",
      city: sanitizeString(step2.city as string),
      neighborhood: step2.neighborhood ? sanitizeString(step2.neighborhood as string) : undefined,
      address: step2.address ? sanitizeString(step2.address as string) : undefined,
      propertyType: step3.propertyType as string,
      propertyState: step3.propertyState as string,
      surfaceCovered: step4.surfaceCovered ? Number(step4.surfaceCovered) : undefined,
      surfaceTotal: step4.surfaceTotal ? Number(step4.surfaceTotal) : undefined,
      rooms: step4.rooms ? Number(step4.rooms) : undefined,
      bathrooms: step4.bathrooms ? Number(step4.bathrooms) : undefined,
      garage: step4.garage !== undefined ? Number(step4.garage) : undefined,
      reason: step5.reason as string,
      timeline: step5.timeline as string,
      estimatedPrice: step6.estimatedPrice ? sanitizeString(step6.estimatedPrice as string) : undefined,
      notes: step6.notes ? sanitizeString(step6.notes as string) : undefined,
    };

    // Send email
    const emailResult = await sendTasacionEmail(emailData);

    if (!emailResult.success) {
      console.error("[Tasacion API] Email sending failed:", emailResult.error);
      // Still return success to user - email failure shouldn't block their submission
    }

    return NextResponse.json(
      { success: true, message: "Solicitud recibida" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Tasacion API] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Only allow POST method
export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method Not Allowed" },
    { status: 405 }
  );
}
