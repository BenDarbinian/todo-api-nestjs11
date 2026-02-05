import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class PasswordRecoveryDto {
  @ApiProperty({
    description: 'New password for the user account',
    example: 'newStrongPassword',
  })
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Password recovery token received via email',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  token: string;
}
