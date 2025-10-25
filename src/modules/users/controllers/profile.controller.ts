import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProfileDto } from '../mappers/dto/profile/profile.dto';
import { User } from '../../../common/decorators/user.decorator';
import { User as UserEntity } from '../../users/entities/user.entity';
import { UsersMapper } from '../mappers/users.mapper';
import { JwtAuthGuard } from '../../../common/auth/guards/jwt-auth.guard';

@ApiTags('Profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/v1/users/me')
export class ProfileController {
  constructor(private readonly usersMapper: UsersMapper) {}

  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieves the profile information of the authenticated user',
  })
  @ApiOkResponse({
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
}
