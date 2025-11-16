import { Transform } from 'class-transformer';
import validator from 'validator';

/**
 * Decorator for automatic email normalization.
 * Converts email to lowercase, removes extra spaces,
 * and applies provider-specific rules (e.g. removes dots for Gmail).
 */
export function NormalizeEmail() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value;
    }

    try {
      return validator.normalizeEmail(value, {
        all_lowercase: true,
        gmail_remove_dots: true,
        gmail_remove_subaddress: true,
        gmail_convert_googlemaildotcom: true,
        outlookdotcom_remove_subaddress: true,
        yahoo_remove_subaddress: true,
        yandex_convert_yandexru: true,
        icloud_remove_subaddress: true,
      });
    } catch {
      return value;
    }
  });
}
