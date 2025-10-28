import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

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
  readonly email: string;
}
