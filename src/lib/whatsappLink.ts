/**
 * Builds a wa.me link that opens a chat with `phone` (digits only, with
 * country code) and, when `message` is not blank, pre-fills it.
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  const link = `https://wa.me/${phone}`;
  const text = message.trim();
  return text === '' ? link : `${link}?text=${encodeURIComponent(text)}`;
}
