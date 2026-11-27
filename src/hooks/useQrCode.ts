import { useEffect, useState } from 'react';
import { generateQrCode, type QrCodeImages } from '../lib/qrCode';

export type QrCodeState =
  { status: 'loading' } | { status: 'ready'; images: QrCodeImages } | { status: 'error' };

type Generated = { text: string; state: QrCodeState };

/** Generates the QR code images for `text`, regenerating when it changes. */
export function useQrCode(text: string): QrCodeState {
  const [generated, setGenerated] = useState<Generated | null>(null);

  useEffect(() => {
    let cancelled = false;
    generateQrCode(text).then(
      (images) => {
        if (!cancelled) setGenerated({ text, state: { status: 'ready', images } });
      },
      (error: unknown) => {
        console.error('Failed to generate QR code', error);
        if (!cancelled) setGenerated({ text, state: { status: 'error' } });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [text]);

  // Images generated for a previous text are never shown for the current one.
  return generated?.text === text ? generated.state : { status: 'loading' };
}
