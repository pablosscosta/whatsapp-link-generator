import { useQrCode } from '../hooks/useQrCode';
import type { WhatsAppLink } from '../lib/whatsappLink';
import { MessagePreview } from './MessagePreview';
import { QrCodeImage } from './QrCodeImage';
import { ResultActions } from './ResultActions';

type LinkResultProps = {
  link: WhatsAppLink;
};

export function LinkResult({ link }: LinkResultProps) {
  const qrCode = useQrCode(link.url);

  return (
    <section className="card result" aria-labelledby="result-title">
      <h2 id="result-title">Seu link está pronto</h2>
      <MessagePreview phone={link.phone} message={link.message} />
      <QrCodeImage qrCode={qrCode} />
      <ResultActions link={link} qrCode={qrCode} />
    </section>
  );
}
