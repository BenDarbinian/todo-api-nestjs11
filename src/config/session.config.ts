import { registerAs } from '@nestjs/config';
import { EnvUtils } from '../common/utils/env.utils';

export interface SessionConfig {
  lifetime: number;
  refreshThreshold: number;
  passwordRecoveryLifetime: number;

  lifetimeMs: number;
  refreshThresholdMs: number;
  passwordRecoveryLifetimeMs: number;
}

export default registerAs('session', (): SessionConfig => {
  const lifetime = EnvUtils.getEnvVariable('SESSION_LIFETIME', {
    defaultValue: 120,
  });
  const refreshThreshold = EnvUtils.getEnvVariable(
    'SESSION_REFRESH_THRESHOLD',
    {
      defaultValue: 60,
    },
  );
  const passwordRecoveryLifetime = EnvUtils.getEnvVariable(
    'SESSION_PASSWORD_RECOVERY_LIFETIME',
    {
      defaultValue: 60,
    },
  );

  return {
    lifetime,
    refreshThreshold,
    passwordRecoveryLifetime,
    lifetimeMs: lifetime * 60 * 1000,
    refreshThresholdMs: refreshThreshold * 60 * 1000,
    passwordRecoveryLifetimeMs: passwordRecoveryLifetime * 60 * 1000,
  };
});
