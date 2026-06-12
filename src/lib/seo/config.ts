import { SITE_URL } from "@/lib/config";

export interface SeoAddress {
  street: string;
  locality: string;
  region: string;
  country: string;
  postalCode: string;
}

export interface SeoSocial {
  facebook: string;
  instagram: string;
}

export interface SeoConfig {
  siteName: string;
  siteUrl: string;
  logo: string;
  address: SeoAddress;
  phone: string;
  email: string;
  social: SeoSocial;
  openingHours: string;
  priceRange: string;
}

export const SEO_CONFIG: SeoConfig = Object.freeze({
  siteName: "Riquelme Propiedades",
  siteUrl: SITE_URL,
  logo: "/og-image.png",
  address: {
    street: "Mitre 247",
    locality: "General Roca",
    region: "Río Negro",
    country: "AR",
    postalCode: "8332",
  },
  phone: "+5492984582082",
  email: "info@riquelmeprop.com",
  social: {
    facebook: "https://facebook.com/riquelmepropiedades",
    instagram: "https://instagram.com/riquelmepropiedades",
  },
  openingHours: "Mo-Fr 09:00-18:00",
  priceRange: "$$$",
});
