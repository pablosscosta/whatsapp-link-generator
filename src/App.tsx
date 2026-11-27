import { useState } from 'react';
import { LinkForm } from './components/LinkForm';
import { LinkResult } from './components/LinkResult';
import type { WhatsAppLink } from './lib/whatsappLink';

export function App() {
  const [link, setLink] = useState<WhatsAppLink | null>(null);

  return (
    <div className="app">
      <main>
        <header>
          <h1 className="title">
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width={40} height={40} />
            Gerador de link para WhatsApp
          </h1>
          <p className="lead">
            Crie um link e um QR code que abrem o WhatsApp com o número certo e uma mensagem pronta.
          </p>
        </header>

        <div className="layout">
          <LinkForm
            onGenerate={setLink}
            onEdit={() => {
              setLink(null);
            }}
          />
          {link ? (
            <LinkResult link={link} />
          ) : (
            <div className="card placeholder">
              <p>O link e o QR code aparecem aqui.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>
          Feito por <a href="https://portfolio-pablosscosta.netlify.app/">Pablo Costa</a> ·{' '}
          <a href="https://github.com/pablosscosta/whatsapp-link-generator">Código no GitHub</a>
        </p>
        <p>Ferramenta independente, sem vínculo com o WhatsApp ou a Meta.</p>
      </footer>
    </div>
  );
}
