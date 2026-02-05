import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { MailerConfig } from '../../config/mailer.config';
import { ConfigNotInitializedException } from '../exceptions/config-not-initialized.exception';

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
  ): Promise<void> {
    if (!this.mailerConfig.host) {
      this.logger.warn(
        `SMTP not configured - skip email verification for ${email}`,
      );
      this.logger.warn(`Verification link: ${verificationLink}`);
      return;
    }

    await this.mailQueue.add('sendEmailVerificationMessage', {
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
  }
}
