import { registerAs } from '@nestjs/config';
import { EnvUtils } from '../common/utils/env.utils';

export interface JwtConfig {
  secret: string;
}

export default registerAs('jwt', (): JwtConfig => {
  return {
    secret: EnvUtils.getEnvVariable('JWT_SECRET'),
  };
});
