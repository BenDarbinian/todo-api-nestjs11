import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ChildTaskDto } from './child-task.dto';

export class TaskDto {
  @ApiProperty({
    description: 'Unique identifier of the task',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Indicates if the task has children tasks',
    example: false,
  })
  @Expose()
  hasChildren: boolean;

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
    description: 'Indicates if the task is completed',
    example: false,
  })
  @Expose()
  completed: boolean;

  @ApiProperty({
    type: [ChildTaskDto],
    description: 'The children tasks of the task',
  })
  @Type(() => ChildTaskDto)
  @Expose()
  children: ChildTaskDto[];

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
