import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bullmq';
import {
  MAIL_JOB_NAMES,
  SendEmailVerificationMessageJobData,
  SendPasswordRecoveryMessageJobData,
} from './mail.service';
import { EmailVerificationMailJobHandler } from './handlers/email-verification-mail-job.handler';

@Processor('mailQueue', {
  concurrency: 5,
  limiter: {
    max: 10,
    duration: 1000,
  },
})
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly emailVerificationMailJobHandler: EmailVerificationMailJobHandler,
  ) {
    super();
  }

  async process(
    job: Job<
      SendEmailVerificationMessageJobData | SendPasswordRecoveryMessageJobData
    >,
  ) {
    this.logger.log(`Processing mail job ${job.id} (${job.name})`);

    switch (job.name) {
      case MAIL_JOB_NAMES.SEND_EMAIL_VERIFICATION:
        await this.emailVerificationMailJobHandler.handle(
          job as Job<SendEmailVerificationMessageJobData>,
        );
        this.logger.log(`Completed mail job ${job.id}`);
        return;
      case MAIL_JOB_NAMES.SEND_PASSWORD_RECOVERY:
        await this.processGenericMailJob(
          job as Job<SendPasswordRecoveryMessageJobData>,
        );
        return;
      default:
        await this.processGenericMailJob(
          job as Job<SendPasswordRecoveryMessageJobData>,
        );
    }
  }

  private async processGenericMailJob(
    job: Job<{ options: ISendMailOptions }>,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail(job.data.options);
      this.logger.log(`Completed mail job ${job.id}`);
    } catch (error) {
      this.logger.error(
        `Mail job ${job.id} failed: ${job.name}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
