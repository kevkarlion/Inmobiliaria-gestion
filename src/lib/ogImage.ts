import { SITE_URL } from "@/lib/config";

/**
 * Builds an optimized OG image URL with Cloudinary transformations.
 * Only applies transformations to Cloudinary-hosted images.
 * Ensures the URL is always absolute for social media crawlers.
 *
 * @param imageUrl - The original image URL (can be null or undefined)
 * @returns Optimized URL with transformation parameters, or null if input is null/undefined
 */
export function buildOgImageUrl(
  imageUrl: string | null | undefined
): string | null {
  if (!imageUrl) {
    return null;
  }

  // Handle relative URLs by prepending the site URL
  let absoluteUrl = imageUrl;
  if (imageUrl.startsWith("/")) {
    // Remove trailing slash from SITE_URL if present
    const baseUrl = SITE_URL.replace(/\/$/, "");
    absoluteUrl = `${baseUrl}${imageUrl}`;
  } else if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    // URL doesn't have protocol, prepend https://
    absoluteUrl = `https://${imageUrl}`;
  }

  // Only apply transformation to Cloudinary URLs
  if (!absoluteUrl.includes("res.cloudinary.com")) {
    return absoluteUrl;
  }

  const separator = absoluteUrl.includes("?") ? "&" : "?";
  // f_auto: deja que Cloudinary sirva el mejor formato (WebP, AVIF, JPEG)
  // según lo que el crawler/WhatsApp soporte
  return `${absoluteUrl}${separator}fl=progressive,f_auto,q_auto:best,w_1200,h_630,c_fill`;
}
