// context/PropertyContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { PropertyUI } from "@/domain/types/PropertyUI.types";
import { mapPropertyToUI } from "@/domain/mappers/mapPropertyToUI";

// 1. Definimos qué datos va a ofrecer el contexto
interface PropertyContextType {
  properties: PropertyUI[];
  loading: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(
  undefined,
);

// 2. El Provider: el componente que envuelve la app y hace el fetch
export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<PropertyUI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch("/api/properties");
        const contentType = res.headers.get("content-type") || "";
        const isJson = contentType.includes("application/json");

        if (!res.ok) {
          const errPayload = isJson
            ? await res.json().catch(() => null)
            : await res.text().catch(() => "");

          const message =
            (typeof errPayload === "object" &&
              errPayload &&
              "message" in errPayload &&
              typeof (errPayload as any).message === "string"
              ? (errPayload as any).message
              : typeof errPayload === "string" && errPayload.trim()
                ? errPayload
                : `Error fetching properties (HTTP ${res.status})`);

          throw new Error(message);
        }

        if (!isJson) throw new Error("Respuesta inválida del servidor (no es JSON)");

        const data = await res.json();
        const mappedData = data.items.map(mapPropertyToUI);
        setProperties(mappedData);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  // Usamos useMemo para que el objeto del contexto no cambie
  // a menos que cambien las propiedades o el estado de carga
  const value = useMemo<PropertyContextType>(
    () => ({
      properties,
      loading,
    }),
    [properties, loading],
  );

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}

// 3. Hook personalizado para usar el contexto de forma fácil
export function useProperties() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error("useProperties debe usarse dentro de un PropertyProvider");
  }
  return context;
}
