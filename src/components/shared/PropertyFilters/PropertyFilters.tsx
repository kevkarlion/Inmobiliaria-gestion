/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

interface Filters {
  type: string[];
  minPrice: number | null;
  maxPrice: number | null;
  currency: "USD" | "ARS" | null;
  bedrooms: number | null;
  garage: boolean;
}

interface Props {
  value: Filters;
  onChange: (filters: Filters) => void;
}

export default function PropertyFilters({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* BARRA STICKY */}
      <div className="sticky top-20 z-40">
        <div className="mx-auto max-w-6xl bg-white rounded-full shadow-xl px-4 py-3 flex items-center gap-3">

          <FilterPill label="Tipo" />
          <FilterPill label="Precio" />
          <FilterPill label="Dormitorios" />

          <button
            onClick={() => setOpen(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            <SlidersHorizontal size={18} />
            Filtros
          </button>
        </div>
      </div>

      {/* MODAL PRINCIPAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-8 max-h-[85vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">
              <h3 className="font-montserrat text-xl font-bold">
                Filtros
              </h3>
              <button onClick={() => setOpen(false)}>Cerrar</button>
            </div>

            {/* MONEDA */}
            <Section title="Moneda">
              <div className="flex gap-3">
                {["USD", "ARS"].map((c) => (
                  <Toggle
                    key={c}
                    active={value.currency === c}
                    onClick={() =>
                      onChange({ ...value, currency: c as any })
                    }
                  >
                    {c}
                  </Toggle>
                ))}
              </div>
            </Section>

            {/* PRECIO */}
            <Section title="Precio">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Min"
                  className="input"
                  value={value.minPrice || ""}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      minPrice: Number(e.target.value),
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="input"
                  value={value.maxPrice || ""}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      maxPrice: Number(e.target.value),
                    })
                  }
                />
              </div>
            </Section>

            {/* DORMITORIOS */}
            <Section title="Dormitorios">
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((n) => (
                  <Toggle
                    key={n}
                    active={value.bedrooms === n}
                    onClick={() =>
                      onChange({ ...value, bedrooms: n })
                    }
                  >
                    {n}+
                  </Toggle>
                ))}
              </div>
            </Section>

            {/* EXTRAS */}
            <Section title="Extras">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={value.garage}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      garage: e.target.checked,
                    })
                  }
                />
                Con garage
              </label>
            </Section>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() =>
                  onChange({
                    type: [],
                    minPrice: null,
                    maxPrice: null,
                    currency: null,
                    bedrooms: null,
                    garage: false,
                  })
                }
                className="text-sm text-slate-500 underline"
              >
                Limpiar
              </button>

              <button
                onClick={() => setOpen(false)}
                className="px-6 py-3 rounded-full bg-slate-900 text-white"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- Subcomponentes ---------- */

function FilterPill({ label }: { label: string }) {
  return (
    <button className="px-4 py-2 rounded-full border border-slate-200 hover:border-gold-sand transition text-sm font-medium">
      {label}
    </button>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="mb-6">
      <h4 className="font-semibold mb-3">{title}</h4>
      {children}
    </div>
  );
}

function Toggle({ active, children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-2 rounded-full border text-sm font-medium transition
        ${active
          ? "bg-slate-900 text-white border-slate-900"
          : "border-slate-200 hover:border-gold-sand"}
      `}
    >
      {children}
    </button>
  );
}
