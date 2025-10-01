import { registerAs } from '@nestjs/config';
import { EnvUtils } from '../common/utils/env.utils';

export interface AppConfig {
  env: string;
  host: string;
  port: number;
}

export default registerAs(
  'app',
  (): AppConfig => ({
    env: EnvUtils.getEnvVariable('APP_ENV', {
      defaultValue: 'production',
    }),
    host: EnvUtils.getEnvVariable('APP_HOST', {
      defaultValue: '0.0.0.0',
    }),
    port: EnvUtils.getEnvVariable('APP_PORT', {
      defaultValue: 8080,
    }),
  }),
);
