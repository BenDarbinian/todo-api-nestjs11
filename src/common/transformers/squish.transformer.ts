import { Transform } from 'class-transformer';

/**
 * Decorator for automatic trimming and removing extra spaces in a string.
 */
export function Squish() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim().replace(/\s+/g, ' ');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  });
}
