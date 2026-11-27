import { normalizeBrazilianPhone } from './phone';

describe('normalizeBrazilianPhone', () => {
  it.each([
    ['(11) 90000-0000', '5511900000000'],
    ['11 90000-0000', '5511900000000'],
    ['11900000000', '5511900000000'],
    ['+55 (11) 90000-0000', '5511900000000'],
    ['5511900000000', '5511900000000'],
    ['(21) 3000-0000', '552130000000'],
    ['+55 21 3000-0000', '552130000000'],
  ])('normalizes %s to %s', (input, expected) => {
    expect(normalizeBrazilianPhone(input)).toEqual({ ok: true, value: expected });
  });

  it('keeps an 11-digit number from area code 55 as a national number', () => {
    expect(normalizeBrazilianPhone('(55) 90000-0000')).toEqual({
      ok: true,
      value: '5555900000000',
    });
  });

  it.each([
    ['', 'empty'],
    ['   ', 'empty'],
    ['abc', 'empty'],
    ['90000-0000', 'invalid-length'],
    ['11 900000-00000', 'invalid-length'],
    ['(20) 90000-0000', 'invalid-area-code'],
    ['(10) 3000-0000', 'invalid-area-code'],
    ['(11) 80000-0000', 'invalid-number'],
    ['(11) 9000-0000', 'invalid-number'],
  ])('rejects %j with %s', (input, error) => {
    expect(normalizeBrazilianPhone(input)).toEqual({ ok: false, error });
  });
});
