import { useState } from 'react';
import { LinkForm } from './components/LinkForm';
import { LinkResult } from './components/LinkResult';

export function App() {
  const [link, setLink] = useState<string | null>(null);

  return (
    <main className="app">
      <header>
        <h1>Gerador de link para WhatsApp</h1>
        <p className="lead">
          Crie um link e um QR code que abrem o WhatsApp com o número certo e uma mensagem pronta.
        </p>
      </header>

      <LinkForm
        onGenerate={setLink}
        onEdit={() => {
          setLink(null);
        }}
      />
      {link && <LinkResult link={link} />}

      <footer className="hint">
        Ferramenta independente, sem vínculo com o WhatsApp ou a Meta.{' '}
        <a href="https://github.com/pablosscosta/whatsapp-link-generator">Código no GitHub</a>
      </footer>
    </main>
  );
}
