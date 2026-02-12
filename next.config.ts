import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        // Esto permite cualquier bucket de Cloudinary
        pathname: '/**', 
        
      },
    ],
  },
  /* Otras opciones de configuración aquí */
};

export default nextConfig;