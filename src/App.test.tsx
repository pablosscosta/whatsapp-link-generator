import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QRCode from 'qrcode';
import { App } from './App';

const EXPECTED_LINK =
  'https://wa.me/5511900000000?text=Ol%C3%A1!%20Quero%20ser%20atendido%20pela%20Ana.';

async function generateLink(phone: string, message = 'Olá! Quero ser atendido pela Ana.') {
  const user = userEvent.setup();
  render(<App />);
  await user.type(screen.getByLabelText('Número do WhatsApp'), phone);
  if (message) {
    await user.type(screen.getByLabelText('Mensagem pronta'), message);
  }
  await user.click(screen.getByRole('button', { name: 'Gerar link' }));
  return user;
}

describe('App', () => {
  it('shows who the client will talk to, the message and the QR code', async () => {
    await generateLink('(11) 90000-0000');

    const result = screen.getByRole('region', { name: 'Seu link está pronto' });
    expect(within(result).getByText('+55 (11) 90000-0000')).toBeInTheDocument();
    expect(within(result).getByText('Olá! Quero ser atendido pela Ana.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Abrir no WhatsApp' })).toHaveAttribute(
      'href',
      EXPECTED_LINK,
    );
    expect(await screen.findByRole('img', { name: 'QR code do link' })).toHaveAttribute(
      'src',
      expect.stringMatching(/^data:image\/svg\+xml/),
    );
  });

  it('shows an error and no link for an invalid number', async () => {
    await generateLink('(20) 90000-0000');

    expect(screen.getByRole('alert')).toHaveTextContent('DDD inválido.');
    expect(screen.getByLabelText('Número do WhatsApp')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByRole('heading', { name: 'Seu link está pronto' })).not.toBeInTheDocument();
  });

  it('asks for the number when it is empty', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Gerar link' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Informe o número do WhatsApp.');
  });

  it('hides the previous result when the form is edited', async () => {
    const user = await generateLink('(11) 90000-0000');
    expect(screen.getByRole('heading', { name: 'Seu link está pronto' })).toBeInTheDocument();

    await user.type(screen.getByLabelText('Mensagem pronta'), ' Obrigado!');

    expect(screen.queryByRole('heading', { name: 'Seu link está pronto' })).not.toBeInTheDocument();
  });

  it('copies the link to the clipboard', async () => {
    const user = await generateLink('(11) 90000-0000');

    await user.click(screen.getByRole('button', { name: 'Copiar link' }));

    expect(screen.getByRole('status')).toHaveTextContent('Link copiado!');
    await expect(navigator.clipboard.readText()).resolves.toBe(EXPECTED_LINK);
  });

  it('moves the focus to the result', async () => {
    await generateLink('(11) 90000-0000');

    expect(screen.getByRole('heading', { name: 'Seu link está pronto' })).toHaveFocus();
  });

  it('scrolls to the result when it is not fully visible', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 900,
      bottom: 1500,
    } as DOMRect);
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView');

    await generateLink('(11) 90000-0000');

    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
  });

  it('does not scroll when the result is already visible', async () => {
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView');

    await generateLink('(11) 90000-0000');

    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('tells the user when copying fails', async () => {
    const user = await generateLink('(11) 90000-0000');
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await user.click(screen.getByRole('button', { name: 'Copiar link' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível copiar');
    expect(screen.getByRole('textbox', { name: 'Link gerado' })).toHaveValue(EXPECTED_LINK);
  });

  it('says the chat opens empty when there is no message', async () => {
    await generateLink('11900000000', '');

    expect(screen.getByText('Nenhuma: a conversa abre sem texto.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Abrir no WhatsApp' })).toHaveAttribute(
      'href',
      'https://wa.me/5511900000000',
    );
  });

  it('counts the message characters', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Mensagem pronta'), 'Oi');

    expect(screen.getByText('2/500 caracteres')).toBeInTheDocument();
    expect(screen.getByLabelText('Mensagem pronta')).toHaveAccessibleDescription(
      /só precisa tocar em enviar/,
    );
  });

  it('tells the user when the QR code cannot be generated', async () => {
    vi.spyOn(QRCode, 'toString').mockRejectedValue(new Error('too big'));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await generateLink('(11) 90000-0000');

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível gerar o QR code');
  });

  it('offers the QR code as PNG and SVG downloads', async () => {
    await generateLink('(11) 90000-0000');

    const png = await screen.findByRole('link', { name: 'Baixar PNG' });
    expect(png).toHaveAttribute('download', 'qrcode-whatsapp.png');
    expect(png).toHaveAttribute('href', expect.stringMatching(/^data:image\/png;base64,/));
    expect(screen.getByRole('link', { name: 'Baixar SVG' })).toHaveAttribute(
      'download',
      'qrcode-whatsapp.svg',
    );
  });
});
