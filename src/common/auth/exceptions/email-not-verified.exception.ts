import { ForbiddenException } from '@nestjs/common';

export const EMAIL_NOT_VERIFIED_ERROR_CODE = 'EMAIL_NOT_VERIFIED';

export class EmailNotVerifiedException extends ForbiddenException {
  constructor() {
    super({
      code: EMAIL_NOT_VERIFIED_ERROR_CODE,
      message: 'Email is not verified.',
    });
  }
}
