import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubtaskDto {
  @ApiProperty({
    description: 'The title of the subtask',
    minLength: 1,
    maxLength: 255,
    example: 'Buy oranges',
  })
  @Length(1, 255)
  @IsString()
  @IsNotEmpty()
  readonly title: string;
}
