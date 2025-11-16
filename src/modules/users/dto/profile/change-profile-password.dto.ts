import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeProfilePasswordDto {
  @ApiProperty({
    description: 'Current password for verification.',
    example: '123456',
    type: String,
    required: true,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;

  @ApiProperty({
    description: 'New password of the user.',
    example: '234567',
    type: String,
    required: true,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    description: 'New password confirmation.',
    example: '234567',
    type: String,
    required: true,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  readonly confirmPassword: string;
}
