import { formatBrazilianPhone } from '../lib/phone';

type MessagePreviewProps = {
  phone: string;
  message: string;
};

/** Shows, in readable form, who the client will talk to and what they will send. */
export function MessagePreview({ phone, message }: MessagePreviewProps) {
  return (
    <dl className="summary">
      <dt>Para</dt>
      <dd className="summary-phone">{formatBrazilianPhone(phone)}</dd>
      <dt>Mensagem</dt>
      <dd>
        {message ? (
          <p className="bubble">{message}</p>
        ) : (
          <span className="hint">Nenhuma: a conversa abre sem texto.</span>
        )}
      </dd>
    </dl>
  );
}
