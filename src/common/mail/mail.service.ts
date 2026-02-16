import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { MailerConfig } from '../../config/mailer.config';
import { ConfigNotInitializedException } from '../exceptions/config-not-initialized.exception';
import { ISendMailOptions } from '@nestjs-modules/mailer';

export const MAIL_JOB_NAMES = {
  SEND_EMAIL_VERIFICATION: 'sendEmailVerificationMessage',
  SEND_PASSWORD_RECOVERY: 'sendPasswordRecoveryMessage',
} as const;

interface BaseMailJobData {
  options: ISendMailOptions;
}

export interface SendEmailVerificationMessageJobData extends BaseMailJobData {
  verificationTokenId: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SendPasswordRecoveryMessageJobData extends BaseMailJobData {}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly mailerConfig: MailerConfig;

  constructor(
    readonly configService: ConfigService,
    @InjectQueue('mailQueue') private readonly mailQueue: Queue,
  ) {
    const mailerConfig: MailerConfig | undefined =
      configService.get<MailerConfig>('mailer');

    if (!mailerConfig) {
      throw new ConfigNotInitializedException('mailerConfig');
    }

    this.mailerConfig = mailerConfig;
  }

  async sendEmailVerificationMessage(
    email: string,
    fullName: string,
    verificationLink: string,
    verificationTokenId: number,
  ): Promise<boolean> {
    if (!this.mailerConfig.host) {
      this.logger.warn(
        `SMTP not configured - skip email verification for ${email}`,
      );
      this.logger.warn(`Verification link: ${verificationLink}`);
      return false;
    }

    await this.mailQueue.add(MAIL_JOB_NAMES.SEND_EMAIL_VERIFICATION, {
      verificationTokenId,
      options: {
        to: email,
        subject: 'Подтвердите email',
        template: 'email-verification-message',
        context: {
          fullName,
          verificationLink,
        },
      },
    });

    return true;
  }

  async sendPasswordRecoveryMessage(
    email: string,
    fullName: string,
    recoveryLink: string,
  ): Promise<void> {
    if (!this.mailerConfig.host) {
      this.logger.warn(
        `SMTP not configured - skip password recovery for ${email}`,
      );
      this.logger.warn(`Recovery link: ${recoveryLink}`);
      return;
    }

    await this.mailQueue.add(MAIL_JOB_NAMES.SEND_PASSWORD_RECOVERY, {
      options: {
        to: email,
        subject: 'Восстановление пароля',
        template: 'password-recovery-message',
        context: {
          fullName,
          recoveryLink,
        },
      },
    });
  }
}
