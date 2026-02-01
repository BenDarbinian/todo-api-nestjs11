import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSubtaskDto } from './create-subtask.dto';
import { Type } from 'class-transformer';
import { IsDateOnly } from '../../../common/validators/is-date-only.validator';

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

  @ApiProperty({
    description: 'The date of the task',
    required: true,
    example: '2025-08-31',
  })
  @IsDateOnly()
  @IsNotEmpty()
  readonly date: string;

  @ApiProperty({
    type: [CreateSubtaskDto],
    description: 'The subtasks of the task',
    required: true,
    nullable: true,
  })
  @ValidateNested()
  @Type(() => CreateSubtaskDto)
  @IsArray()
  @IsOptional()
  readonly subtasks: CreateSubtaskDto[] = [];
}
