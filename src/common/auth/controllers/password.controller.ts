import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { PasswordRecoveryDto } from '../dto/password-recovery.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';

@ApiTags('Password')
@Controller('api/v1/password')
export class PasswordController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Initiate password recovery',
    description:
      'Sends a password recovery email to the user with a reset token',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Password recovery email sent successfully',
  })
  @ApiBadRequestResponse({
    description: 'Bad request - invalid email format',
  })
  @ApiNotFoundResponse({
    description: 'User with provided email not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Post('forgot')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    await this.authService.forgotPassword(dto);
  }

  @ApiOperation({
    summary: 'Reset password',
    description: 'Sets a new password for the user using the recovery token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password successfully reset, returns new access token',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request - invalid token or password format',
  })
  @ApiNotFoundResponse({
    description: 'Invalid or expired token',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Post('reset')
  async recoverPassword(
    @Body() dto: PasswordRecoveryDto,
  ): Promise<AuthResponseDto> {
    return this.authService.recoverPassword(dto);
  }
}
