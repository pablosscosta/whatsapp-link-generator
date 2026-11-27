const COUNTRY_CODE = '55';

// Brazilian area codes (DDD) in use, per Anatel's numbering plan.
const AREA_CODES = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43,
  44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77,
  79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

export type PhoneError = 'empty' | 'invalid-length' | 'invalid-area-code' | 'invalid-number';

export type PhoneResult = { ok: true; value: string } | { ok: false; error: PhoneError };

/**
 * Validates a Brazilian phone number typed in any common format
 * ("(11) 90000-0000", "+55 11 90000-0000", "11900000000") and returns it
 * as digits only, prefixed with the country code, as wa.me expects.
 */
export function normalizeBrazilianPhone(input: string): PhoneResult {
  const digits = input.replace(/\D/g, '');
  if (digits === '') {
    return { ok: false, error: 'empty' };
  }

  const national = stripCountryCode(digits);
  if (national.length !== 10 && national.length !== 11) {
    return { ok: false, error: 'invalid-length' };
  }

  if (!AREA_CODES.has(Number(national.slice(0, 2)))) {
    return { ok: false, error: 'invalid-area-code' };
  }

  if (!isValidSubscriberNumber(national.slice(2))) {
    return { ok: false, error: 'invalid-number' };
  }

  return { ok: true, value: COUNTRY_CODE + national };
}

/**
 * Formats a number returned by normalizeBrazilianPhone for display:
 * "5511900000000" becomes "+55 (11) 90000-0000".
 */
export function formatBrazilianPhone(normalized: string): string {
  const national = normalized.slice(COUNTRY_CODE.length);
  const areaCode = national.slice(0, 2);
  const subscriber = national.slice(2);
  const lastFourStart = subscriber.length - 4;
  return `+${COUNTRY_CODE} (${areaCode}) ${subscriber.slice(0, lastFourStart)}-${subscriber.slice(lastFourStart)}`;
}

// 12 or 13 digits starting with 55 carry the country code. An 11-digit number
// starting with 55 is a national number from area code 55, so it is kept.
function stripCountryCode(digits: string): string {
  const hasCountryCode =
    digits.startsWith(COUNTRY_CODE) && (digits.length === 12 || digits.length === 13);
  return hasCountryCode ? digits.slice(COUNTRY_CODE.length) : digits;
}

// Mobile numbers have 9 digits starting with 9; landlines have 8 digits starting with 2 to 5.
function isValidSubscriberNumber(subscriber: string): boolean {
  if (subscriber.length === 9) {
    return subscriber.startsWith('9');
  }
  return /^[2-5]/.test(subscriber);
}
