/**
 * Builds an optimized OG image URL with Cloudinary transformations.
 * Only applies transformations to Cloudinary-hosted images.
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

  // Only apply transformation to Cloudinary URLs
  if (!imageUrl.includes("res.cloudinary.com")) {
    return imageUrl;
  }

  const separator = imageUrl.includes("?") ? "&" : "?";
  return `${imageUrl}${separator}fl=progressive,f_jpg,q_auto:best,w_1200,h_630,c_fill`;
}
