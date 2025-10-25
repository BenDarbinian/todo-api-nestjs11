import { Module } from '@nestjs/common';
import { Argon2Strategy } from './argon2.strategy';
import { HashService } from './hash.service';
import { HashStrategy } from './hash.strategy';

@Module({
  providers: [
    {
      provide: HashStrategy,
      useClass: Argon2Strategy,
    },
    HashService,
  ],
  exports: [HashService],
})
export class HashModule {}
