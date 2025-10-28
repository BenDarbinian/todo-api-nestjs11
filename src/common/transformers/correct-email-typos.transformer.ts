import { Transform } from 'class-transformer';
import { EmailUtils } from '../utils/email.utils';

export function CorrectEmailTypos() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value;
    }

    try {
      return EmailUtils.correct(value);
    } catch {
      return value;
    }
  });
}
