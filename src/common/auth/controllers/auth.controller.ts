import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
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
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Sessions')
@Controller('api/v1/sessions')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticate user with email and password to obtain access token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AuthResponseDto,
    description:
      'Successfully authenticated, returns access token and metadata',
  })
  @ApiBadRequestResponse({
    description: 'Bad request - invalid email or password format',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials - incorrect email or password',
  })
  @ApiForbiddenResponse({
    description: 'Email is not verified',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Post()
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh token',
    description: 'Generate new access token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AuthResponseDto,
    description: 'New access token',
  })
  @ApiBadRequestResponse({ description: 'Bad request - invalid data provided' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Get('new-token')
  @UseGuards(JwtAuthGuard)
  async refresh(@Req() req: Request): Promise<AuthResponseDto> {
    const token: string | undefined = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    return this.authService.refresh(token);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout user',
    description:
      'Revokes the current session by invalidating the provided JWT token',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successfully logged out',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated - Missing or invalid token',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Delete()
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request): Promise<void> {
    const token: string | undefined = req.headers.authorization?.split(' ')[1];

    if (token) {
      await this.authService.revokeToken(token);
    }
  }
}
