/**
 * Picks what the share button sends: the QR code image with the link as text
 * when the device can share files (as phones do), or only the link. Returns
 * null when the browser has no share sheet, so the button is not shown.
 */
export function getShareData(url: string, image: File | null): ShareData | null {
  if (!('share' in navigator)) return null;

  if (image) {
    const withImage: ShareData = { files: [image], text: url };
    if ('canShare' in navigator && navigator.canShare(withImage)) return withImage;
  }
  return { url };
}
