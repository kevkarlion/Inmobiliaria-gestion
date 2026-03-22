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
      // Cloudinary
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Stock images - Unsplash
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // Stock images - Pexels
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      // Stock images - Pixabay
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        pathname: "/**",
      },
      // Stock images - iStock
      {
        protocol: "https",
        hostname: "www.istockphoto.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        pathname: "/**",
      },
      // Stock images - Getty Images
      {
        protocol: "https",
        hostname: "www.gettyimages.com",
        pathname: "/**",
      },
      // Stock images - Shutterstock
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
        pathname: "/**",
      },
      // Freelarge - common free stock
      {
        protocol: "https",
        hostname: "freelarge.com",
        pathname: "/**",
      },
      // Placeholder services
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },
  /* Otras opciones de configuración aquí */
};

export default nextConfig;
