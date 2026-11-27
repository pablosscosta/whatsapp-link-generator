import { useState } from 'react';
import type { QrCodeState } from '../hooks/useQrCode';
import { QR_FILE_NAME } from '../lib/qrCode';
import type { WhatsAppLink } from '../lib/whatsappLink';

type CopyStatus = 'idle' | 'copied' | 'failed';

type ResultActionsProps = {
  link: WhatsAppLink;
  qrCode: QrCodeState;
};

export function ResultActions({ link, qrCode }: ResultActionsProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopyStatus('copied');
    } catch (error) {
      console.error('Failed to copy link', error);
      setCopyStatus('failed');
    }
  }

  return (
    <>
      <div className="actions">
        <button
          type="button"
          className="button button-primary button-wide"
          onClick={() => void copyLink()}
        >
          Copiar link
        </button>
        {qrCode.status === 'ready' && (
          <>
            <a className="button" href={qrCode.images.pngUrl} download={`${QR_FILE_NAME}.png`}>
              Baixar PNG
            </a>
            <a className="button" href={qrCode.images.svgUrl} download={`${QR_FILE_NAME}.svg`}>
              Baixar SVG
            </a>
          </>
        )}
        <a className="button button-wide" href={link.url} target="_blank" rel="noopener noreferrer">
          Abrir no WhatsApp
        </a>
      </div>

      <p className="status" role="status">
        {copyStatus === 'copied' && 'Link copiado!'}
      </p>
      {copyStatus === 'failed' && (
        <div className="copy-fallback">
          <p className="error" role="alert">
            Não foi possível copiar automaticamente. Copie o link abaixo.
          </p>
          <input
            type="text"
            readOnly
            value={link.url}
            aria-label="Link gerado"
            onFocus={(event) => {
              event.target.select();
            }}
          />
        </div>
      )}
    </>
  );
}
