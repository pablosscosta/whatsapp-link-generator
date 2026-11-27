import type { QrCodeState } from '../hooks/useQrCode';

type QrCodeImageProps = {
  qrCode: QrCodeState;
};

export function QrCodeImage({ qrCode }: QrCodeImageProps) {
  if (qrCode.status === 'loading') {
    return <p className="hint qr">Gerando QR code…</p>;
  }

  if (qrCode.status === 'error') {
    return (
      <p className="error qr" role="alert">
        Não foi possível gerar o QR code. Tente encurtar a mensagem e gerar de novo.
      </p>
    );
  }

  return (
    <div className="qr">
      <img src={qrCode.images.svgUrl} alt="QR code do link" width={256} height={256} />
    </div>
  );
}
