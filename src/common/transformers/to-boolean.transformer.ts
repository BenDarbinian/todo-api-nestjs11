import { Transform } from 'class-transformer';

/**
 * Decorator for converting "true"/"false" string values into booleans.
 */
export function ToBoolean() {
  return Transform(({ value }) => {
    if (value === 'true' || value === true) {
      return true;
    }

    if (value === 'false' || value === false) {
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  });
}
