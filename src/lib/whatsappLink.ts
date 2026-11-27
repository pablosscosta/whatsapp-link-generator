export type WhatsAppLink = {
  /** Digits only, with the country code. */
  phone: string;
  /** Trimmed message; empty when there is none. */
  message: string;
  url: string;
};

/**
 * Builds a wa.me link that opens a chat with `phone` (digits only, with
 * country code) and, when `message` is not blank, pre-fills it.
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  const link = `https://wa.me/${phone}`;
  const text = message.trim();
  return text === '' ? link : `${link}?text=${encodeURIComponent(text)}`;
}

/** Bundles the link with the data it was built from, for display. */
export function createWhatsAppLink(phone: string, message: string): WhatsAppLink {
  const text = message.trim();
  return { phone, message: text, url: buildWhatsAppLink(phone, text) };
}
