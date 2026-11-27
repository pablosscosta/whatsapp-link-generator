import { useState } from 'react';
import { QrCode } from './QrCode';

type CopyStatus = 'idle' | 'copied' | 'failed';

type LinkResultProps = {
  link: string;
};

export function LinkResult({ link }: LinkResultProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopyStatus('copied');
    } catch (error) {
      console.error('Failed to copy link', error);
      setCopyStatus('failed');
    }
  }

  return (
    <section className="card" aria-labelledby="result-title">
      <h2 id="result-title">Seu link</h2>
      <p className="link">{link}</p>

      <div className="actions">
        <button type="button" className="button button-primary" onClick={() => void copyLink()}>
          Copiar link
        </button>
        <a className="button" href={link} target="_blank" rel="noopener noreferrer">
          Abrir no WhatsApp
        </a>
      </div>
      <p className="status" role="status">
        {copyStatus === 'copied' && 'Link copiado!'}
        {copyStatus === 'failed' &&
          'Não foi possível copiar. Selecione o link e copie manualmente.'}
      </p>

      <QrCode link={link} />
    </section>
  );
}
