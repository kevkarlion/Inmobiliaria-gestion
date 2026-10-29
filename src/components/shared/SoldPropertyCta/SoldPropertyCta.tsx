"use client";

import { useState } from "react";
import { Bell, CheckCircle2, Loader2 } from "lucide-react";
import { trackFormSubmit } from "@/components/shared/Analytics";

/**
 * CTA de captura de leads para propiedades ya vendidas o reservadas.
 * Reemplaza los botones de consulta habituales por un formulario de aviso.
 */

interface Props {
  barrio?: string;
  city?: string;
  typeName?: string;
  typeSlug?: string;
  operationType?: "venta" | "alquiler";
  propertyTitle: string;
}

const CLIENT_PROPERTY_TYPE_BY_SLUG: Record<string, string> = {
  casa: "casa",
  departamento: "depto",
  "departamento-en-pozo": "depto",
  depto: "depto",
  terreno: "terreno",
  loteo: "loteo",
  lote: "loteo",
};

export default function SoldPropertyCta({
  barrio,
  city,
  typeName,
  typeSlug,
  operationType = "venta",
  propertyTitle,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const locationLabel = barrio?.trim() || city?.trim() || "la zona";
  const operationLabel = operationType === "alquiler" ? "alquiler" : "venta";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !phone.trim()) {
      setStatus("error");
      setErrorMessage("Completá tu nombre y tu teléfono.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    const clientPropertyType = CLIENT_PROPERTY_TYPE_BY_SLUG[typeSlug ?? ""];

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          source: "web",
          notes: `Interés en una propiedad similar (${operationLabel}) a "${propertyTitle}" (${typeName ?? "propiedad"}).`,
          preferences: {
            operationType: "compra",
            propertyPreferences: clientPropertyType
              ? [
                  {
                    propertyType: clientPropertyType,
                    zones: [
                      {
                        city: city?.trim() || undefined,
                        barrio: barrio?.trim() || undefined,
                      },
                    ],
                    notes: `Avisar cuando ingresse un inmueble similar en ${locationLabel}.`,
                  },
                ]
              : [],
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      trackFormSubmit({
        form_type: "consulta",
        form_location: "detail",
        property_id: propertyTitle,
      });

      setStatus("done");
    } catch {
      setStatus("error");
      setErrorMessage(
        "No pudimos registrar tu contacto. Escribinos por WhatsApp y lo resolvemos."
      );
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-[#25D366]/40 bg-[#25D366]/10 p-6 text-center space-y-3">
        <CheckCircle2 className="w-8 h-8 text-[#128C4A] mx-auto" />
        <p className="font-montserrat font-black uppercase tracking-tight text-oxford">
          ¡Gracias, {name.trim().split(" ")[0]}!
        </p>
        <p className="text-sm text-blue-gray">
          Te avisamos en cuanto ingrese una propiedad similar en {locationLabel}.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gold-sand/40 bg-gold-sand/5 p-6 space-y-4">
      <div className="flex items-start gap-3">
        <Bell className="w-5 h-5 text-gold-sand shrink-0 mt-0.5" />
        <p className="text-sm text-blue-gray leading-relaxed">
          Esta propiedad ya fue vendida. ¿Buscás una opción similar en{" "}
          <strong className="text-oxford">{locationLabel}</strong>? Dejanos tu
          contacto para avisarte en cuanto ingrese un nuevo inmueble.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          aria-label="Tu nombre"
          required
          className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-gold-sand outline-none"
        />

        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Tu teléfono"
          aria-label="Tu teléfono"
          required
          className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-gold-sand outline-none"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Tu email (opcional)"
          aria-label="Tu email (opcional)"
          className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-gold-sand outline-none"
        />

        {status === "error" && errorMessage && (
          <p role="alert" className="text-xs text-red-300 leading-relaxed">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-cta bg-gold-sand text-black w-full py-3 rounded-xl font-black uppercase tracking-widest disabled:opacity-60"
        >
          {status === "loading" ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Enviando
            </span>
          ) : (
            "Avisarme cuando haya una similar"
          )}
        </button>
      </form>
    </div>
  );
}
