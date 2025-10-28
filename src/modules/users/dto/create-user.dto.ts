import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Squish } from '../../../common/transformers/squish.transformer';
import { Trim } from '../../../common/transformers/trim.transformer';
import { CorrectEmailTypos } from '../../../common/transformers/correct-email-typos.transformer';
import { NormalizeEmail } from '../../../common/transformers/normalize-email.transformer';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user.',
    example: 'John Doe',
    type: String,
    required: true,
    nullable: false,
    minLength: 2,
    maxLength: 255,
  })
  @Length(2, 255)
  @IsString()
  @IsNotEmpty()
  @Squish()
  readonly name: string;

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

  @ApiProperty({
    description: 'The password of the user.',
    example: '123456',
    type: String,
    required: true,
    nullable: false,
    minLength: 6,
  })
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
