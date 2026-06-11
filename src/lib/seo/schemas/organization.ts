import { SITE_URL } from "@/lib/config";
import { SeoConfig } from "@/lib/seo/config";

function resolveUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

function omitEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== "") {
      (result as Record<string, unknown>)[key] = value;
    }
  }
  return result;
}

function buildAddress(config: SeoConfig): Record<string, string> | undefined {
  const address = omitEmpty({
    "@type": "PostalAddress",
    streetAddress: config.address.street,
    addressLocality: config.address.locality,
    addressRegion: config.address.region,
    addressCountry: config.address.country,
    postalCode: config.address.postalCode,
  });
  return Object.keys(address).length > 1 ? address : undefined;
}

function buildContactPoint(
  config: SeoConfig
): Record<string, string> | undefined {
  if (!config.phone) return undefined;
  return {
    "@type": "ContactPoint",
    telephone: config.phone,
    contactType: "sales",
  };
}

function buildSameAs(config: SeoConfig): string[] | undefined {
  const urls = [config.social.facebook, config.social.instagram].filter(
    Boolean
  );
  return urls.length > 0 ? urls : undefined;
}

export function buildOrganizationSchema(
  config: SeoConfig
): Record<string, unknown> {
  const result: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: config.siteName,
    url: config.siteUrl,
  };

  if (config.logo) {
    result.logo = resolveUrl(config.logo);
  }

  const address = buildAddress(config);
  if (address) {
    result.address = address;
  }

  const contactPoint = buildContactPoint(config);
  if (contactPoint) {
    result.contactPoint = contactPoint;
  }

  const sameAs = buildSameAs(config);
  if (sameAs) {
    result.sameAs = sameAs;
  }

  return result;
}
