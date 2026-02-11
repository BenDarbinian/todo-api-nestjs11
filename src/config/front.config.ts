import { registerAs } from '@nestjs/config';
import { EnvUtils } from '../common/utils/env.utils';

export interface FrontConfig {
  baseUrl: string;
  passwordRecoveryPath: string;
  passwordRecoveryUrl: string;
  emailVerificationPath: string;
  emailVerificationUrl: string;
}

export default registerAs('front', (): FrontConfig => {
  const baseUrl = EnvUtils.getEnvVariable('FRONT_BASE_URL', {
    defaultValue: 'http://localhost:5173',
  });
  const passwordRecoveryPath = EnvUtils.getEnvVariable(
    'FRONT_PASSWORD_RECOVERY_PATH',
    {
      defaultValue: '/password-recovery',
    },
  );
  const emailVerificationPath = EnvUtils.getEnvVariable(
    'FRONT_EMAIL_VERIFICATION_PATH',
    {
      defaultValue: '/verify-email',
    },
  );

  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedPasswordRecoveryPath = passwordRecoveryPath.startsWith('/')
    ? passwordRecoveryPath
    : `/${passwordRecoveryPath}`;
  const normalizedEmailVerificationPath = emailVerificationPath.startsWith('/')
    ? emailVerificationPath
    : `/${emailVerificationPath}`;

  return {
    baseUrl,
    passwordRecoveryPath,
    passwordRecoveryUrl: `${normalizedBase}${normalizedPasswordRecoveryPath}`,
    emailVerificationPath,
    emailVerificationUrl: `${normalizedBase}${normalizedEmailVerificationPath}`,
  };
});
