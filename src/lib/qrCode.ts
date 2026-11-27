import QRCode from 'qrcode';
import { dataUrlToFile } from './dataUrl';

export const QR_FILE_NAME = 'qrcode-whatsapp';

const QR_OPTIONS = { errorCorrectionLevel: 'M', margin: 2 } as const;
const PNG_WIDTH = 1024;

export type QrCodeImages = {
  svgUrl: string;
  pngUrl: string;
  pngFile: File;
};

/**
 * Generates the QR code for `text` as SVG (shown on screen and downloadable)
 * and as PNG (downloadable and shareable), both as data URLs.
 */
export async function generateQrCode(text: string): Promise<QrCodeImages> {
  const [svg, pngUrl] = await Promise.all([
    QRCode.toString(text, { ...QR_OPTIONS, type: 'svg' }),
    QRCode.toDataURL(text, { ...QR_OPTIONS, width: PNG_WIDTH }),
  ]);

  return {
    svgUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    pngUrl,
    pngFile: dataUrlToFile(pngUrl, `${QR_FILE_NAME}.png`),
  };
}
