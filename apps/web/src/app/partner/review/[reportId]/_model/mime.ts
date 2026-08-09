export function isImageMime(mimeType: string): boolean {
  return /^image\//i.test(mimeType) || /jpe?g|png|gif|webp/i.test(mimeType);
}
