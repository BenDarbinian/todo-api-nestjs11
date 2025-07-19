import { registerAs } from '@nestjs/config';
import { EnvUtils } from '../common/utils/env.utils';

export interface RedisConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

export default registerAs(
  'redis',
  (): RedisConfig => ({
    host: EnvUtils.getEnvVariable('REDIS_HOST'),
    port: EnvUtils.getEnvVariable('REDIS_PORT', {
      defaultValue: 6379,
      type: 'number',
    }),
    username: EnvUtils.getEnvVariable('REDIS_USERNAME', {
      defaultValue: 'default',
    }),
    password: EnvUtils.getEnvVariable('REDIS_PASSWORD'),
  }),
);
