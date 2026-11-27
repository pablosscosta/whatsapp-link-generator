import type { QrCodeState } from '../hooks/useQrCode';

type QrCodeImageProps = {
  qrCode: QrCodeState;
};

// The QR code area keeps the same height in every state, so the page does not jump.
export function QrCodeImage({ qrCode }: QrCodeImageProps) {
  if (qrCode.status === 'loading') {
    return (
      <div className="qr">
        <p className="hint">Gerando QR code…</p>
      </div>
    );
  }

  if (qrCode.status === 'error') {
    return (
      <div className="qr">
        <p className="error" role="alert">
          Não foi possível gerar o QR code. Tente encurtar a mensagem e gerar de novo.
        </p>
      </div>
    );
  }

  return (
    <div className="qr">
      <img src={qrCode.images.svgUrl} alt="QR code do link" width={256} height={256} />
    </div>
  );
}
