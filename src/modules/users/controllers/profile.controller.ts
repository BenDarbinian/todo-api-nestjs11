import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProfileDto } from '../mappers/dto/profile/profile.dto';
import { User } from '../../../common/decorators/user.decorator';
import { User as UserEntity } from '../../users/entities/user.entity';
import { UsersMapper } from '../mappers/users.mapper';
import { JwtAuthGuard } from '../../../common/auth/guards/jwt-auth.guard';
import { UpdateProfileNameDto } from '../dto/profile/update-profile-name.dto';
import { UsersService } from '../users.service';
import { UpdateProfileEmailDto } from '../dto/profile/update-profile-email.dto';
import { ChangeProfilePasswordDto } from '../dto/profile/change-profile-password.dto';

@ApiTags('Profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/v1/users/me')
export class ProfileController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersMapper: UsersMapper,
  ) {}

  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieves the profile information of the authenticated user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProfileDto,
    description: 'User profile information',
  })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have permission' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Get()
  public getProfile(@User() user: UserEntity): ProfileDto {
    return this.usersMapper.toDto(user, ProfileDto);
  }

  @ApiOperation({
    summary: 'Change profile name',
    description: 'Changes the name of the authenticated user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Name successfully changed',
  })
  @ApiBadRequestResponse({ description: 'Bad request - invalid data provided' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have permission' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Patch('name')
  @HttpCode(HttpStatus.OK)
  public async updateFullName(
    @User() user: UserEntity,
    @Body() dto: UpdateProfileNameDto,
  ): Promise<ProfileDto> {
    this.usersService.updateName(user, dto.name);
    const savedUser = await this.usersService.save(user);

    return this.usersMapper.toDto(savedUser, ProfileDto);
  }

  @ApiOperation({
    summary: 'Change profile email',
    description: 'Changes the email of the authenticated user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email successfully changed',
  })
  @ApiBadRequestResponse({ description: 'Bad request - invalid data provided' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have permission' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Patch('email')
  @HttpCode(HttpStatus.OK)
  public async updateEmail(
    @User() user: UserEntity,
    @Body() dto: UpdateProfileEmailDto,
  ): Promise<ProfileDto> {
    await this.usersService.updateEmail(user, dto.email);
    const savedUser = await this.usersService.save(user);

    return this.usersMapper.toDto(savedUser, ProfileDto);
  }

  @ApiOperation({
    summary: 'Change profile password',
    description:
      'Changes the password of the authenticated user after validating the current password',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Password successfully changed',
  })
  @ApiBadRequestResponse({ description: 'Bad request - invalid data provided' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have permission' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Patch('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async changePassword(
    @User() user: UserEntity,
    @Body() dto: ChangeProfilePasswordDto,
  ): Promise<void> {
    await this.usersService.validatePassword(user, dto);

    await this.usersService.changePassword(user, dto.newPassword);
    await this.usersService.save(user);
  }
}
