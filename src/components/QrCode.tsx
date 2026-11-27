import { useQrCode } from '../hooks/useQrCode';
import { QR_FILE_NAME } from '../lib/qrCode';

type QrCodeProps = {
  link: string;
};

export function QrCode({ link }: QrCodeProps) {
  const qrCode = useQrCode(link);

  if (qrCode.status === 'loading') {
    return <p className="hint">Gerando QR code…</p>;
  }

  if (qrCode.status === 'error') {
    return (
      <p className="error" role="alert">
        Não foi possível gerar o QR code. Tente encurtar a mensagem e gerar de novo.
      </p>
    );
  }

  const { svgUrl, pngUrl } = qrCode.images;
  return (
    <div className="qr">
      <img src={svgUrl} alt="QR code do link" width={240} height={240} />
      <div className="actions">
        <a className="button" href={pngUrl} download={`${QR_FILE_NAME}.png`}>
          Baixar PNG
        </a>
        <a className="button" href={svgUrl} download={`${QR_FILE_NAME}.svg`}>
          Baixar SVG
        </a>
      </div>
    </div>
  );
}
