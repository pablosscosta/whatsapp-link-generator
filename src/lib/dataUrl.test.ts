import { dataUrlToFile } from './dataUrl';

describe('dataUrlToFile', () => {
  it('decodes the content and keeps the media type', async () => {
    const file = dataUrlToFile('data:text/plain;base64,T2zDoQ==', 'greeting.txt');

    expect(file.name).toBe('greeting.txt');
    expect(file.type).toBe('text/plain');
    await expect(file.text()).resolves.toBe('Olá');
  });

  it('rejects data URLs that are not base64', () => {
    expect(() => dataUrlToFile('data:text/plain,Ola', 'greeting.txt')).toThrow(
      'Expected a base64 data URL',
    );
  });
});
