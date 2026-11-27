const BASE64_DATA_URL = /^data:([^;,]+);base64,(.*)$/;

/**
 * Converts a base64 data URL (such as the PNG generated for the QR code)
 * into a File, which the Web Share API needs to share an image.
 */
export function dataUrlToFile(dataUrl: string, fileName: string): File {
  const match = BASE64_DATA_URL.exec(dataUrl);
  const type = match?.[1];
  const base64 = match?.[2];
  if (type === undefined || base64 === undefined) {
    throw new Error('Expected a base64 data URL');
  }

  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  return new File([bytes], fileName, { type });
}
