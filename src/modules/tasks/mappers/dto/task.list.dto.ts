import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TaskListDto {
  @ApiProperty({
    description: 'Unique identifier of the task',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The number of subtasks',
    example: 0,
  })
  @Expose()
  subtasksCount: number;

  @ApiProperty({
    description: 'The title of the task',
    example: 'Buy groceries',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Indicates if the task is completed',
    example: false,
  })
  @Expose()
  completed: boolean;
}
