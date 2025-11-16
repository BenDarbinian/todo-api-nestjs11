import { Injectable } from '@nestjs/common';
import { BaseMapper } from '../../../common/mappers/base.mapper';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersMapper extends BaseMapper<User> {}
