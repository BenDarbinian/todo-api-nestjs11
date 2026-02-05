import { registerAs } from '@nestjs/config';
import { EnvUtils } from '../common/utils/env.utils';

export interface MailerConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  secure: boolean;
  tls: boolean;

  emailFrom: string;
  emailReplyTo: string;
}

export default registerAs('mailer', (): MailerConfig => {
  return {
    host: EnvUtils.getEnvVariable('SMTP_HOST', { defaultValue: '' }),
    port: EnvUtils.getEnvVariable('SMTP_PORT', {
      type: 'number',
      defaultValue: 587,
    }),
    username: EnvUtils.getEnvVariable('SMTP_USERNAME', { defaultValue: '' }),
    password: EnvUtils.getEnvVariable('SMTP_PASSWORD', { defaultValue: '' }),
    secure: EnvUtils.getEnvVariable('SMTP_SECURE', {
      type: 'boolean',
      defaultValue: false,
    }),
    tls: EnvUtils.getEnvVariable('SMTP_TLS', {
      type: 'boolean',
      defaultValue: false,
    }),

    emailFrom: EnvUtils.getEnvVariable('EMAIL_FROM', { defaultValue: '' }),
    emailReplyTo: EnvUtils.getEnvVariable('EMAIL_REPLY_TO', {
      defaultValue: '',
    }),
  };
});
