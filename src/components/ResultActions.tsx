import { useEffect, useState } from 'react';
import type { QrCodeState } from '../hooks/useQrCode';
import { useShare } from '../hooks/useShare';
import { QR_FILE_NAME } from '../lib/qrCode';
import { getShareData } from '../lib/share';
import type { WhatsAppLink } from '../lib/whatsappLink';

type CopyStatus = 'idle' | 'copied' | 'failed';

const COPIED_FEEDBACK_MS = 2000;

type ResultActionsProps = {
  link: WhatsAppLink;
  qrCode: QrCodeState;
};

export function ResultActions({ link, qrCode }: ResultActionsProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const { share, failed: shareFailed } = useShare();
  const shareData = getShareData(
    link.url,
    qrCode.status === 'ready' ? qrCode.images.pngFile : null,
  );

  // "Copiado!" replaces the button label for a moment, then the button resets.
  useEffect(() => {
    if (copyStatus !== 'copied') return;
    const timer = setTimeout(() => {
      setCopyStatus('idle');
    }, COPIED_FEEDBACK_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [copyStatus]);

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
          className={shareData ? 'button button-primary' : 'button button-primary button-wide'}
          onClick={() => void copyLink()}
        >
          {copyStatus === 'copied' ? 'Copiado!' : 'Copiar link'}
        </button>
        {shareData && (
          <button type="button" className="button" onClick={() => void share(shareData)}>
            Compartilhar
          </button>
        )}
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

      <p className="visually-hidden" role="status">
        {copyStatus === 'copied' ? 'Link copiado!' : ''}
      </p>
      {shareFailed && (
        <p className="error" role="alert">
          Não foi possível compartilhar. Copie o link ou baixe o QR code.
        </p>
      )}
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
