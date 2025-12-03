import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SubtaskDto } from './subtask.dto';

export class TaskDto {
  @ApiProperty({
    description: 'Unique identifier of the task',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Indicates if the task has subtasks',
    example: false,
  })
  @Expose()
  hasSubtasks: boolean;

  @ApiProperty({
    description: 'The title of the task',
    example: 'Buy groceries',
  })
  @Expose()
  title: string;

  @ApiProperty({
    type: 'string',
    description: 'The description of the task',
    example: 'Milk, eggs, bread, and fruits',
    nullable: true,
  })
  @Expose()
  description: string | null;

  @ApiProperty({
    description: 'The date when the task was completed',
    example: '2023-04-05T12:00:00.000Z',
  })
  @Expose()
  completedAt: Date | null;

  @ApiProperty({
    type: [SubtaskDto],
    description: 'Subtasks of the task',
  })
  @Type(() => SubtaskDto)
  @Expose()
  subtasks: SubtaskDto[];

  @ApiProperty({
    description: 'The date and time when the task was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the task was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}
