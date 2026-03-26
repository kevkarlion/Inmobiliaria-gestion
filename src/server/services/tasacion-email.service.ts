/**
 * Email service for tasación lead submissions
 * Uses Nodemailer with SMTP configuration
 */
import nodemailer from "nodemailer";

interface TasacionEmailData {
  // Step 1: Contact
  name: string;
  email: string;
  phone: string;
  contactPreference: "email" | "whatsapp" | "phone";
  
  // Step 2: Location
  city: string;
  neighborhood?: string;
  address?: string;
  
  // Step 3: Property Type
  propertyType: string;
  propertyState: string;
  
  // Step 4: Features
  surfaceCovered?: number;
  surfaceTotal?: number;
  rooms?: number;
  bathrooms?: number;
  garage?: number;
  
  // Step 5: Context
  reason: string;
  timeline: string;
  
  // Step 6: Extras
  estimatedPrice?: string;
  notes?: string;
}

/**
 * Get configured SMTP transporter
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("[TasacionEmail] SMTP not configured - email will be logged only");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Format property type for display
 */
function formatPropertyType(type: string): string {
  const labels: Record<string, string> = {
    casa: "Casa",
    departamento: "Departamento",
    terreno: "Terreno",
    local: "Local comercial",
    campo: "Campo/Chacra",
  };
  return labels[type] || type;
}

/**
 * Format property state for display
 */
function formatPropertyState(state: string): string {
  const labels: Record<string, string> = {
    nuevo: "Nuevo",
    usado: "Usado",
    a_reciclar: "A reciclar",
  };
  return labels[state] || state;
}

/**
 * Format reason for display
 */
function formatReason(reason: string): string {
  const labels: Record<string, string> = {
    vender: "Vender",
    comprar: "Comprar",
    refinancing: "Refinanciación",
    sucesion: "Sucesión/herencia",
    otro: "Otro",
  };
  return labels[reason] || reason;
}

/**
 * Format timeline for display
 */
function formatTimeline(timeline: string): string {
  const labels: Record<string, string> = {
    inmediata: "Inmediata (menos de 3 meses)",
    "3_6_meses": "3-6 meses",
    "6_12_meses": "6-12 meses",
    sin_urgencia: "Sin urgencia",
  };
  return labels[timeline] || timeline;
}

/**
 * Format contact preference for display
 */
function formatContactPreference(pref: string): string {
  const labels: Record<string, string> = {
    email: "Email",
    whatsapp: "WhatsApp",
    phone: "Teléfono",
  };
  return labels[pref] || pref;
}

/**
 * Generate HTML email body from form data
 */
function generateHtmlBody(data: TasacionEmailData): string {
  const propertyTypeLabel = formatPropertyType(data.propertyType);
  const propertyStateLabel = formatPropertyState(data.propertyState);
  const reasonLabel = formatReason(data.reason);
  const timelineLabel = formatTimeline(data.timeline);
  const contactPrefLabel = formatContactPreference(data.contactPreference);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #001d3d; border-bottom: 2px solid #c9a86c; padding-bottom: 10px; }
    .section { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
    .section h2 { font-size: 16px; color: #001d3d; margin-top: 0; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px 0; border-bottom: 1px solid #e9ecef; }
    td:first-child { font-weight: bold; width: 40%; color: #666; }
    .priority-high { background: #fee2e2; border-left: 4px solid #dc2626; padding: 10px; margin-top: 20px; }
    .footer { margin-top: 30px; font-size: 12px; color: #999; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Nueva Solicitud de Tasación</h1>
    
    <div class="section">
      <h2>📞 Datos de Contacto</h2>
      <table>
        <tr><td>Nombre</td><td>${data.name}</td></tr>
        <tr><td>Email</td><td>${data.email}</td></tr>
        <tr><td>Teléfono</td><td>${data.phone}</td></tr>
        <tr><td>Prefiere ser contactado por</td><td>${contactPrefLabel}</td></tr>
      </table>
    </div>

    <div class="section">
      <h2>📍 Ubicación</h2>
      <table>
        <tr><td>Ciudad</td><td>${data.city}</td></tr>
        ${data.neighborhood ? `<tr><td>Barrio/Zona</td><td>${data.neighborhood}</td></tr>` : ""}
        ${data.address ? `<tr><td>Dirección</td><td>${data.address}</td></tr>` : ""}
      </table>
    </div>

    <div class="section">
      <h2>🏠 Tipo de Propiedad</h2>
      <table>
        <tr><td>Tipo de propiedad</td><td>${propertyTypeLabel}</td></tr>
        <tr><td>Estado</td><td>${propertyStateLabel}</td></tr>
      </table>
    </div>

    <div class="section">
      <h2>📐 Características</h2>
      <table>
        ${data.surfaceCovered ? `<tr><td>Superficie cubierta</td><td>${data.surfaceCovered} m²</td></tr>` : ""}
        ${data.surfaceTotal ? `<tr><td>Superficie total</td><td>${data.surfaceTotal} m²</td></tr>` : ""}
        ${data.rooms ? `<tr><td>Ambientes</td><td>${data.rooms}</td></tr>` : ""}
        ${data.bathrooms ? `<tr><td>Baños</td><td>${data.bathrooms}</td></tr>` : ""}
        ${data.garage !== undefined && data.garage !== null ? `<tr><td>Cocheras</td><td>${data.garage}</td></tr>` : ""}
      </table>
    </div>

    <div class="section">
      <h2>🎯 Contexto</h2>
      <table>
        <tr><td>Motivo de la tasación</td><td>${reasonLabel}</td></tr>
        <tr><td>Plazo</td><td>${timelineLabel}</td></tr>
      </table>
    </div>

    ${data.estimatedPrice || data.notes ? `
    <div class="section">
      <h2>📝 Información Adicional</h2>
      <table>
        ${data.estimatedPrice ? `<tr><td>Precio estimado</td><td>${data.estimatedPrice}</td></tr>` : ""}
        ${data.notes ? `<tr><td>Notas</td><td>${data.notes}</td></tr>` : ""}
      </table>
    </div>
    ` : ""}

    ${data.timeline === "inmediata" ? `
    <div class="priority-high">
      <strong>⚠️ URGENTE:</strong> El cliente indica que necesita una respuesta inmediata (menos de 3 meses).
    </div>
    ` : ""}

    <div class="footer">
      <p>Riquelme Propiedades - www.riquelmeprop.com</p>
      <p>Recibido el ${new Date().toLocaleDateString("es-AR", { 
        day: "numeric", 
        month: "long", 
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })}</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text email body from form data
 */
function generateTextBody(data: TasacionEmailData): string {
  const propertyTypeLabel = formatPropertyType(data.propertyType);
  const propertyStateLabel = formatPropertyState(data.propertyState);
  const reasonLabel = formatReason(data.reason);
  const timelineLabel = formatTimeline(data.timeline);
  const contactPrefLabel = formatContactPreference(data.contactPreference);

  let body = `NUEVA SOLICITAD DE TASACIÓN\n${"=".repeat(40)}\n\n`;

  body += `DATOS DE CONTACTO\n`;
  body += `-`.repeat(20) + `\n`;
  body += `Nombre: ${data.name}\n`;
  body += `Email: ${data.email}\n`;
  body += `Teléfono: ${data.phone}\n`;
  body += `Prefiere ser contactado por: ${contactPrefLabel}\n\n`;

  body += `UBICACIÓN\n`;
  body += `-`.repeat(20) + `\n`;
  body += `Ciudad: ${data.city}\n`;
  if (data.neighborhood) body += `Barrio/Zona: ${data.neighborhood}\n`;
  if (data.address) body += `Dirección: ${data.address}\n`;
  body += `\n`;

  body += `TIPO DE PROPIEDAD\n`;
  body += `-`.repeat(20) + `\n`;
  body += `Tipo: ${propertyTypeLabel}\n`;
  body += `Estado: ${propertyStateLabel}\n\n`;

  body += `CARACTERÍSTICAS\n`;
  body += `-`.repeat(20) + `\n`;
  if (data.surfaceCovered) body += `Superficie cubierta: ${data.surfaceCovered} m²\n`;
  if (data.surfaceTotal) body += `Superficie total: ${data.surfaceTotal} m²\n`;
  if (data.rooms) body += `Ambientes: ${data.rooms}\n`;
  if (data.bathrooms) body += `Baños: ${data.bathrooms}\n`;
  if (data.garage !== undefined && data.garage !== null) body += `Cocheras: ${data.garage}\n`;
  body += `\n`;

  body += `CONTEXTO\n`;
  body += `-`.repeat(20) + `\n`;
  body += `Motivo: ${reasonLabel}\n`;
  body += `Plazo: ${timelineLabel}\n`;
  body += `\n`;

  if (data.estimatedPrice || data.notes) {
    body += `INFORMACIÓN ADICIONAL\n`;
    body += `-`.repeat(20) + `\n`;
    if (data.estimatedPrice) body += `Precio estimado: ${data.estimatedPrice}\n`;
    if (data.notes) body += `Notas: ${data.notes}\n`;
    body += `\n`;
  }

  if (data.timeline === "inmediata") {
    body += `⚠️ URGENTE: El cliente indica que necesita respuesta inmediata.\n\n`;
  }

  body += `Riquelme Propiedades - ${new Date().toLocaleString("es-AR")}`;

  return body;
}

/**
 * Send tasación lead email
 */
export async function sendTasacionEmail(data: TasacionEmailData): Promise<{ success: boolean; error?: string }> {
  const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER;
  const toEmail = process.env.TO_EMAIL || "info@riquelmeprop.com";

  const propertyTypeLabel = formatPropertyType(data.propertyType);
  const subject = `Nueva solicitud de tasación - ${propertyTypeLabel} en ${data.city}`;

  // Log the data for debugging/fallback
  console.log("[TasacionEmail] Processing new lead:", {
    name: data.name,
    email: data.email,
    phone: data.phone,
    propertyType: data.propertyType,
    city: data.city,
  });

  const transporter = getTransporter();

  if (!transporter) {
    // Log the email data as fallback
    console.log("[TasacionEmail] SMTP not configured - logging email data:");
    console.log(JSON.stringify({ subject, ...data }, null, 2));
    return { success: true }; // Fail silently for email
  }

  try {
    const info = await transporter.sendMail({
      from: `"Riquelme Propiedades" <${fromEmail}>`,
      to: toEmail,
      subject,
      text: generateTextBody(data),
      html: generateHtmlBody(data),
    });

    console.log("[TasacionEmail] Email sent successfully:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("[TasacionEmail] Failed to send email:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to send email" 
    };
  }
}
