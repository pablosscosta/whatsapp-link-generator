import { useState, type SubmitEvent } from 'react';
import { normalizeBrazilianPhone, type PhoneError } from '../lib/phone';
import { buildWhatsAppLink } from '../lib/whatsappLink';

export const MESSAGE_MAX_LENGTH = 500;

const PHONE_ERRORS: Record<PhoneError, string> = {
  empty: 'Informe o número do WhatsApp.',
  'invalid-length': 'O número deve ter DDD + 8 ou 9 dígitos.',
  'invalid-area-code': 'DDD inválido.',
  'invalid-number': 'Número inválido: celulares têm 9 dígitos e começam com 9.',
};

type LinkFormProps = {
  onGenerate: (link: string) => void;
  onEdit: () => void;
};

export function LinkForm({ onGenerate, onEdit }: LinkFormProps) {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = normalizeBrazilianPhone(phone);
    if (!result.ok) {
      setPhoneError(PHONE_ERRORS[result.error]);
      return;
    }
    setPhoneError(null);
    onGenerate(buildWhatsAppLink(result.value, message));
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="phone">Número do WhatsApp</label>
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="off"
          placeholder="(11) 90000-0000"
          value={phone}
          aria-invalid={phoneError !== null}
          aria-describedby={phoneError ? 'phone-error' : 'phone-hint'}
          onChange={(event) => {
            setPhone(event.target.value);
            onEdit();
          }}
        />
        {phoneError ? (
          <p id="phone-error" className="error" role="alert">
            {phoneError}
          </p>
        ) : (
          <p id="phone-hint" className="hint">
            Com DDD. O código do Brasil (+55) é opcional.
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="message">Mensagem pronta</label>
        <textarea
          id="message"
          rows={4}
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder="Olá! Vi a promoção no status da Ana e quero ser atendido por ela."
          value={message}
          aria-describedby="message-count"
          onChange={(event) => {
            setMessage(event.target.value);
            onEdit();
          }}
        />
        <p id="message-count" className="hint">
          {message.length}/{MESSAGE_MAX_LENGTH} caracteres. Opcional.
        </p>
      </div>

      <button type="submit" className="button button-primary">
        Gerar link
      </button>
    </form>
  );
}
