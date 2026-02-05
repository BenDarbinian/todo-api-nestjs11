import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'Email verification token',
    example: 'a0f1d3e6c5b24fd6a2d0b7d03a9d4c6a',
  })
  @MinLength(16)
  @IsString()
  @IsNotEmpty()
  token: string;
}
