import { IsBoolean, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Sometimes } from '../../../common/validators/sometimes.validator';
import { Nullable } from '../../../common/validators/nullable.validator';

export class UpdateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    minLength: 1,
    maxLength: 255,
    required: false,
    example: 'Buy groceries',
  })
  @Length(1, 255)
  @IsString()
  @Sometimes()
  readonly title?: string;

  @ApiProperty({
    type: 'string',
    description: 'The description of the task',
    required: false,
    nullable: true,
    minLength: 1,
    maxLength: 512,
    example: 'Milk, eggs, bread, and fruits',
  })
  @Length(1, 512)
  @IsString()
  @Nullable()
  @Sometimes()
  readonly description: string | null;

  @ApiProperty({
    description: 'Indicates if the task is completed',
    required: false,
    example: true,
  })
  @IsBoolean()
  @Sometimes()
  readonly completed?: boolean;
}
