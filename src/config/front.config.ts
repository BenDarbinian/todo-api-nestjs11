import { registerAs } from '@nestjs/config';
import { EnvUtils } from '../common/utils/env.utils';

export interface FrontConfig {
  publicUrl: string;
}

export default registerAs(
  'front',
  (): FrontConfig => ({
    publicUrl: EnvUtils.getEnvVariable('FRONT_PUBLIC_URL', {
      defaultValue: 'http://localhost:8080',
    }),
  }),
);
