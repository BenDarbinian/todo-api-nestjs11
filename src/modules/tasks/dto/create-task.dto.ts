import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    minLength: 1,
    maxLength: 255,
    example: 'Buy groceries',
  })
  @Length(1, 255)
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    type: 'string',
    description: 'The description of the task',
    required: true,
    nullable: true,
    minLength: 1,
    maxLength: 512,
    example: 'Milk, eggs, bread, and fruits',
    default: null,
  })
  @Length(1, 512)
  @IsString()
  @IsOptional()
  readonly description: string | null = null;
}
