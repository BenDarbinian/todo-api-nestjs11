import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { HashStrategy } from './hash.strategy';

@Injectable()
export class Argon2Strategy extends HashStrategy {
  async hash(value: string): Promise<string> {
    return argon2.hash(value, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
      hashLength: 32,
    });
  }

  async compare(value: string, encrypted: string): Promise<boolean> {
    return argon2.verify(encrypted, value);
  }
}
