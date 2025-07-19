import { InternalServerErrorException } from '@nestjs/common';

export class ConfigNotInitializedException extends InternalServerErrorException {
  constructor(configName: string) {
    super(`Config "${configName}" is not initialized`);
  }
}
