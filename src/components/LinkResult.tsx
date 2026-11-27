import { useEffect, useRef } from 'react';
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
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // `link` is a new object on every "Gerar link", so the result is revealed each time.
  useEffect(() => {
    if (sectionRef.current && headingRef.current) {
      revealResult(sectionRef.current, headingRef.current);
    }
  }, [link]);

  return (
    <section ref={sectionRef} className="card result" aria-labelledby="result-title">
      <h2 id="result-title" ref={headingRef} tabIndex={-1}>
        Seu link está pronto
      </h2>
      <MessagePreview phone={link.phone} message={link.message} />
      <QrCodeImage qrCode={qrCode} />
      <ResultActions link={link} qrCode={qrCode} />
    </section>
  );
}

// Moves focus to the result, so screen readers announce it, and scrolls to it
// when it is not fully visible (on phones it renders below the form).
function revealResult(section: HTMLElement, heading: HTMLElement) {
  heading.focus({ preventScroll: true });
  const { top, bottom } = section.getBoundingClientRect();
  if (top < 0 || bottom > window.innerHeight) {
    section.scrollIntoView({ block: 'start' });
  }
}
