import { registerAs } from '@nestjs/config';
import { EnvUtils } from '../common/utils/env.utils';

export interface FrontConfig {
  baseUrl: string;
  passwordRecoveryPath: string;
  passwordRecoveryUrl: string;
}

export default registerAs('front', (): FrontConfig => {
  const baseUrl = EnvUtils.getEnvVariable('FRONT_BASE_URL', {
    defaultValue: 'http://localhost:8088',
  });
  const passwordRecoveryPath = EnvUtils.getEnvVariable(
    'FRONT_PASSWORD_RECOVERY_PATH',
    {
      defaultValue: '/password-recovery',
    },
  );

  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedPath = passwordRecoveryPath.startsWith('/')
    ? passwordRecoveryPath
    : `/${passwordRecoveryPath}`;

  return {
    baseUrl,
    passwordRecoveryPath,
    passwordRecoveryUrl: `${normalizedBase}${normalizedPath}`,
  };
});
