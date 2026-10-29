import Link from "next/link";

const SeoFooterGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-neutral-400 mt-8 border-t border-neutral-800 pt-6">
      <div>
        <h4 className="font-semibold text-white mb-2">Propiedades por Categoría</h4>
        <ul className="space-y-1">
          <li>
            <Link
              href="/casas-en-venta-general-roca"
              className="text-neutral-400 hover:text-gold-sand transition-colors"
            >
              Casas en Venta en General Roca
            </Link>
          </li>
          <li>
            <Link
              href="/terrenos-en-venta-general-roca"
              className="text-neutral-400 hover:text-gold-sand transition-colors"
            >
              Terrenos y Loteos en General Roca
            </Link>
          </li>
          <li>
            <Link
              href="/departamentos-en-venta-general-roca"
              className="text-neutral-400 hover:text-gold-sand transition-colors"
            >
              Departamentos en Venta en General Roca
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-white mb-2">Búsquedas por Barrio</h4>
        <ul className="space-y-1">
          <li>
            <Link
              href="/venta-de-propiedades?barrio=210-viviendas"
              className="text-neutral-400 hover:text-gold-sand transition-colors"
            >
              Barrio 210 Viviendas
            </Link>
          </li>
          <li>
            <Link
              href="/venta-de-propiedades?barrio=don-fernando"
              className="text-neutral-400 hover:text-gold-sand transition-colors"
            >
              Barrio Don Fernando
            </Link>
          </li>
          <li>
            <Link
              href="/venta-de-propiedades?barrio=827-viviendas"
              className="text-neutral-400 hover:text-gold-sand transition-colors"
            >
              Barrio 827 Viviendas
            </Link>
          </li>
          <li>
            <Link
              href="/venta-de-propiedades?barrio=stefenelli"
              className="text-neutral-400 hover:text-gold-sand transition-colors"
            >
              Stefenelli Sur y Norte
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-white mb-2">Otras Zonas de Interés</h4>
        <ul className="space-y-1">
          <li>
            <Link
              href="/venta-de-propiedades?ubicacion=las-grutas"
              className="text-neutral-400 hover:text-gold-sand transition-colors"
            >
              Propiedades en Las Grutas
            </Link>
          </li>
          <li>
            <Link
              href="/venta-de-propiedades?ubicacion=bariloche"
              className="text-neutral-400 hover:text-gold-sand transition-colors"
            >
              Propiedades en San Carlos de Bariloche
            </Link>
          </li>
          <li>
            <Link
              href="/venta-de-propiedades?ubicacion=sierra-grande"
              className="text-neutral-400 hover:text-gold-sand transition-colors"
            >
              Lotes en Costa Dorada (Sierra Grande)
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SeoFooterGrid;
