import { Injectable } from '@nestjs/common';
import { HashStrategy } from './hash.strategy';

@Injectable()
export class HashService {
  constructor(private readonly strategy: HashStrategy) {}

  async hash(value: string): Promise<string> {
    return this.strategy.hash(value);
  }

  async compare(value: string, encrypted: string): Promise<boolean> {
    return this.strategy.compare(value, encrypted);
  }
}
