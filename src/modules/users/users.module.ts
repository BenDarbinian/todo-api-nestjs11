import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashModule } from '../../common/hash/hash.module';
import { UsersMapper } from './mappers/users.mapper';
import { ProfileController } from './controllers/profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HashModule],
  controllers: [UsersController, ProfileController],
  providers: [UsersService, UsersMapper],
  exports: [UsersService],
})
export class UsersModule {}
