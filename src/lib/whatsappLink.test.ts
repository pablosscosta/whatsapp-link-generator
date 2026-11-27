import { buildWhatsAppLink, createWhatsAppLink } from './whatsappLink';

describe('buildWhatsAppLink', () => {
  it('pre-fills the encoded message', () => {
    expect(buildWhatsAppLink('5511900000000', 'Olá, quero ser atendido pela Ana!')).toBe(
      'https://wa.me/5511900000000?text=Ol%C3%A1%2C%20quero%20ser%20atendido%20pela%20Ana!',
    );
  });

  it('encodes emojis, line breaks and URL-reserved characters', () => {
    const link = buildWhatsAppLink('5511900000000', 'Promo 😀\nPreço: R$ 10 & frete?');

    expect(link).toBe(
      'https://wa.me/5511900000000?text=Promo%20%F0%9F%98%80%0APre%C3%A7o%3A%20R%24%2010%20%26%20frete%3F',
    );
    expect(new URL(link).searchParams.get('text')).toBe('Promo 😀\nPreço: R$ 10 & frete?');
  });

  it('trims surrounding whitespace from the message', () => {
    expect(buildWhatsAppLink('5511900000000', '  Oi  ')).toBe(
      'https://wa.me/5511900000000?text=Oi',
    );
  });

  it('omits the text parameter when the message is blank', () => {
    expect(buildWhatsAppLink('5511900000000', '  \n ')).toBe('https://wa.me/5511900000000');
  });
});

describe('createWhatsAppLink', () => {
  it('keeps the phone and the trimmed message next to the link', () => {
    expect(createWhatsAppLink('5511900000000', '  Oi  ')).toEqual({
      phone: '5511900000000',
      message: 'Oi',
      url: 'https://wa.me/5511900000000?text=Oi',
    });
  });
});
