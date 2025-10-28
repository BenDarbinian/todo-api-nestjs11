import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { Trim } from '../../../../common/transformers/trim.transformer';
import { CorrectEmailTypos } from '../../../../common/transformers/correct-email-typos.transformer';
import { NormalizeEmail } from '../../../../common/transformers/normalize-email.transformer';

export class UpdateProfileEmailDto {
  @ApiProperty({
    description: 'The email of the user.',
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
}
