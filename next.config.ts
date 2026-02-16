import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/property/:slug",
        destination: "/propiedad/:slug",
        permanent: true,
      },
      {
        source: "/search-type/:path*",
        destination: "/propiedades/:path*",
        permanent: true,
      },
    ];
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
