import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { NormalizeEmail } from '../../../common/transformers/normalize-email.transformer';
import { CorrectEmailTypos } from '../../../common/transformers/correct-email-typos.transformer';
import { Trim } from '../../../common/transformers/trim.transformer';

export class ResendVerificationDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    type: String,
    required: true,
    nullable: false,
    maxLength: 255,
  })
  @MaxLength(255)
  @IsEmail()
  @IsNotEmpty()
  @NormalizeEmail()
  @CorrectEmailTypos()
  @Trim()
  email: string;
}
