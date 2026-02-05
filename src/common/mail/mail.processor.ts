import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bullmq';

@Processor('mailQueue', {
  concurrency: 5,
  limiter: {
    max: 10,
    duration: 1000,
  },
})
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<{ options: ISendMailOptions }>) {
    this.logger.log(`Processing mail job ${job.id} (${job.name})`);

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
