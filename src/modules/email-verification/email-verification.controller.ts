import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EmailVerificationService } from './email-verification.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { UsersService } from '../users/users.service';

@ApiTags('Email Verification')
@Controller('api/v1/users')
export class EmailVerificationController {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @ApiOperation({
    summary: 'Verify email',
    description: 'Verifies user email by token.',
  })
  @ApiNoContentResponse({ description: 'Email successfully verified.' })
  @ApiBadRequestResponse({ description: 'Invalid or expired token.' })
  @Get('verify-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<void> {
    await this.emailVerificationService.verifyToken(dto.token);
  }

  @ApiOperation({
    summary: 'Resend verification email',
    description:
      'Resends email verification link. Always returns 204 to avoid email enumeration.',
  })
  @ApiNoContentResponse({
    description: 'Verification email re-sent if user exists.',
  })
  @Post('resend-verification')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resend(@Body() dto: ResendVerificationDto): Promise<void> {
    const user = await this.usersService.findOneByEmail(dto.email);

    if (!user) {
      return;
    }

    await this.emailVerificationService.requestVerification(user);
  }
}
