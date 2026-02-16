import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { EmailVerificationToken } from '../../../modules/email-verification/entities/email-verification-token.entity';
import { SmsVerificationStatus } from '../../../modules/email-verification/enums/sms-verification-status.enum';
import { SendEmailVerificationMessageJobData } from '../mail.service';

@Injectable()
export class EmailVerificationMailJobHandler {
  private readonly logger = new Logger(EmailVerificationMailJobHandler.name);

  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(EmailVerificationToken)
    private readonly emailVerificationTokenRepository: Repository<EmailVerificationToken>,
  ) {}

  async handle(job: Job<SendEmailVerificationMessageJobData>): Promise<void> {
    try {
      await this.mailerService.sendMail(job.data.options);

      await this.emailVerificationTokenRepository.update(
        job.data.verificationTokenId,
        { status: SmsVerificationStatus.SENT },
      );
    } catch (error) {
      await this.emailVerificationTokenRepository.update(
        job.data.verificationTokenId,
        { status: SmsVerificationStatus.FAILED },
      );

      this.logger.error(
        `Mail job ${job.id} failed: ${job.name}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
