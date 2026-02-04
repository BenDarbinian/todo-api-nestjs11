import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CorrectEmailTypos } from '../../transformers/correct-email-typos.transformer';
import { NormalizeEmail } from '../../transformers/normalize-email.transformer';
import { Trim } from '../../transformers/trim.transformer';

export class LoginDto {
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
  readonly email: string;

  @ApiProperty({
    description: 'The password of the user.',
    example: '123456',
    type: String,
    required: true,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
