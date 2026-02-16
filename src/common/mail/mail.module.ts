import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';
import { MailerConfig } from '../../config/mailer.config';
import { ConfigNotInitializedException } from '../exceptions/config-not-initialized.exception';
import { EmailVerificationToken } from '../../modules/email-verification/entities/email-verification-token.entity';
import { EmailVerificationMailJobHandler } from './handlers/email-verification-mail-job.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailVerificationToken]),
    BullModule.registerQueue({
      name: 'mailQueue',
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mailerConfig: MailerConfig | undefined =
          configService.get<MailerConfig>('mailer');

        if (!mailerConfig) {
          throw new ConfigNotInitializedException('mailerConfig');
        }

        if (!mailerConfig.host) {
          console.warn('SMTP not configured - mailer disabled');

          return {
            transport: {
              host: 'localhost',
              port: 587,
            },
            defaults: {
              from: 'none@localhost.local',
            },
          };
        }

        return {
          transport: {
            host: mailerConfig.host,
            port: mailerConfig.port,
            secure: mailerConfig.secure,
            requireTLS: mailerConfig.tls,
            auth: {
              user: mailerConfig.username,
              pass: mailerConfig.password,
            },
          },
          defaults: {
            from: mailerConfig.emailFrom,
            replyTo: mailerConfig.emailReplyTo,
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService, MailProcessor, EmailVerificationMailJobHandler],
  exports: [MailService],
})
export class MailModule {}
