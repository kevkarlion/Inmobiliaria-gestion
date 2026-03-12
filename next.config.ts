import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    const singularToPlural = [
      { singular: "departamento", plural: "departamentos" },
      { singular: "casa", plural: "casas" },
      { singular: "terreno", plural: "terrenos" },
      { singular: "lote", plural: "lotes" },
      { singular: "local", plural: "locales" },
      { singular: "oficina", plural: "oficinas" },
      { singular: "PH", plural: "PHs" },
      { singular: "galpon", plural: "galpones" },
      { singular: "fundo", plural: "fundos" },
      { singular: "loteo", plural: "loteos" },
      // Tipos compuestos
      { singular: "departamento-en-pozo", plural: "departamentos-en-pozo" },
    ];

    const redirects = [
      // Legacy redirects
      {
        source: "/property/:slug",
        destination: "/propiedad/:slug",
        permanent: true,
      },
      {
        source: "/properties/:slug",
        destination: "/propiedad/:slug",
        permanent: true,
      },
      {
        source: "/search-type/:path*",
        destination: "/propiedades/:path*",
        permanent: true,
      },
    ];

    // Singular to Plural redirects for SEO categories
    for (const { singular, plural } of singularToPlural) {
      for (const operation of ["venta", "alquiler"]) {
        redirects.push({
          source: `/${singular}-en-${operation}/:citySlug*`,
          destination: `/${plural}-en-${operation}/:citySlug*`,
          permanent: true,
        });
      }
    }

    return redirects;
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // Esto permite cualquier bucket de Cloudinary
        pathname: "/**",
      },
    ],
  },
  /* Otras opciones de configuración aquí */
};

export default nextConfig;
