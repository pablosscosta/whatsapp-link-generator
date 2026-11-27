import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

const QR_OPTIONS = { errorCorrectionLevel: 'M', margin: 2 } as const;
const PNG_WIDTH = 1024;
const FILE_NAME = 'qrcode-whatsapp';

type QrState =
  | { status: 'loading'; link: string }
  | { status: 'ready'; link: string; svgUrl: string }
  | { status: 'error'; link: string };

type QrCodeProps = {
  link: string;
};

export function QrCode({ link }: QrCodeProps) {
  const [state, setState] = useState<QrState>({ status: 'loading', link });
  const [pngError, setPngError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    QRCode.toString(link, { ...QR_OPTIONS, type: 'svg' }).then(
      (svg) => {
        if (!cancelled) setState({ status: 'ready', link, svgUrl: toSvgDataUrl(svg) });
      },
      (error: unknown) => {
        console.error('Failed to generate QR code', error);
        if (!cancelled) setState({ status: 'error', link });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [link]);

  async function downloadPng() {
    try {
      const pngUrl = await QRCode.toDataURL(link, { ...QR_OPTIONS, width: PNG_WIDTH });
      setPngError(false);
      triggerDownload(pngUrl, `${FILE_NAME}.png`);
    } catch (error) {
      console.error('Failed to generate PNG', error);
      setPngError(true);
    }
  }

  // A state left from the previous link is treated as loading.
  if (state.link !== link || state.status === 'loading') {
    return <p className="hint">Gerando QR code…</p>;
  }

  if (state.status === 'error') {
    return (
      <p className="error" role="alert">
        Não foi possível gerar o QR code. Tente encurtar a mensagem e gerar de novo.
      </p>
    );
  }

  return (
    <div className="qr">
      <img src={state.svgUrl} alt="QR code do link" width={240} height={240} />
      <div className="actions">
        <button type="button" className="button" onClick={() => void downloadPng()}>
          Baixar PNG
        </button>
        <a className="button" href={state.svgUrl} download={`${FILE_NAME}.svg`}>
          Baixar SVG
        </a>
      </div>
      {pngError && (
        <p className="error" role="alert">
          Não foi possível gerar o PNG. Tente baixar o SVG.
        </p>
      )}
    </div>
  );
}

function toSvgDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function triggerDownload(url: string, fileName: string) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
}
