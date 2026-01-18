"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Filters() {

  const router = useRouter();
  const params = useSearchParams();



  function updateFilter(key: string, value: string) {
  const newParams = new URLSearchParams(params.toString());

  if (value) newParams.set(key, value);
  else newParams.delete(key);

  router.push(`/properties?${newParams.toString()}`);
}



  
  return (
    <div className="flex gap-2 flex-wrap">
      <select onChange={(e) => updateFilter("operationType", e.target.value)}>
        <option className="text-black" value="">Operación</option>
        <option className="text-black" value="venta">Venta</option>
        <option className="text-black" value="alquiler">Alquiler</option>
      </select>

      <select onChange={(e) => updateFilter("propertyType", e.target.value)}>
        <option className="text-black" value="">Tipo</option>
        <option className="text-black" value="casa">Casa</option>
        <option className="text-black" value="departamento">Departamento</option>
      </select>

      <select onChange={(e) => updateFilter("zone", e.target.value)}>
        <option className="text-black" value="">Zona</option>
        <option className="text-black" value="norte">Norte</option>
        <option className="text-black" value="sur">Sur</option>
        <option className="text-black" value="centro">Centro</option>
        <option className="text-black" value="zona-norte">Zona-Norte</option>
        <option className="text-black" value="zona-comercial">Zona-Comercial</option>
        <option className="text-black" value="zona-universitaria">Zona-Universitaria</option>
        <option className="text-black" value="costanera">Costanera</option>
        <option className="text-black" value="barrio-privado">Barrio Privado</option>
      </select>
    </div>
  );
}
