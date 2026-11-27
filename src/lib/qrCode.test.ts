import { generateQrCode, QR_FILE_NAME } from './qrCode';

describe('generateQrCode', () => {
  it('generates the SVG and the PNG of the same text', async () => {
    const images = await generateQrCode('https://wa.me/5511900000000');

    expect(images.svgUrl).toMatch(/^data:image\/svg\+xml;charset=utf-8,%3Csvg/);
    expect(images.pngUrl).toMatch(/^data:image\/png;base64,/);
    expect(images.pngFile.name).toBe(`${QR_FILE_NAME}.png`);
    expect(images.pngFile.type).toBe('image/png');
  });
});
