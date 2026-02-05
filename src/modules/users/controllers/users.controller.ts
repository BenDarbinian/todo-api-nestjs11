import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProfileResource } from '../resources/profile.resource';
import { User } from '../entities/user.entity';
import { EmailVerificationService } from '../../email-verification/email-verification.service';

@ApiTags('Users')
@Controller('api/v1/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @ApiOperation({
    summary: 'Create a new user',
    description: 'Registers a new user in the system',
  })
  @ApiCreatedResponse({
    type: ProfileResource,
    description: 'User successfully created',
  })
  @ApiBadRequestResponse({ description: 'Bad request - invalid data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user: User = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });

    const savedUser: User = await this.usersService.save(user);

    await this.emailVerificationService.requestVerification(savedUser);

    return new ProfileResource(savedUser);
  }
}
