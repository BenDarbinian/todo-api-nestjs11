import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { CorrectEmailTypos } from '../../transformers/correct-email-typos.transformer';
import { NormalizeEmail } from '../../transformers/normalize-email.transformer';
import { Trim } from '../../transformers/trim.transformer';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'User email address to send password recovery instructions to',
    example: 'user@example.com',
  })
  @MaxLength(255)
  @IsEmail()
  @IsNotEmpty()
  @NormalizeEmail()
  @CorrectEmailTypos()
  @Trim()
  readonly email: string;
}
