import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateProfileNameDto {
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
  readonly name: string;
}
