import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';
import { SubtaskResource } from './subtask.resource';

export class TaskResource {
  @ApiProperty({
    description: 'Unique identifier of the task',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Indicates if the task has subtasks',
    example: false,
  })
  hasSubtasks: boolean;

  @ApiProperty({
    description: 'The title of the task',
    example: 'Buy groceries',
  })
  title: string;

  @ApiProperty({
    type: 'string',
    description: 'The description of the task',
    example: 'Milk, eggs, bread, and fruits',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'The date when the task was completed',
    example: '2023-04-05T12:00:00.000Z',
  })
  completedAt: Date | null;

  @ApiProperty({
    type: 'string',
    description: 'The date of the task',
    example: '2025-08-31',
    nullable: true,
  })
  date: string | null;

  @ApiProperty({
    type: [SubtaskResource],
    description: 'Subtasks of the task',
  })
  subtasks: SubtaskResource[];

  @ApiProperty({
    description: 'The date and time when the task was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the task was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  constructor(task: Task) {
    this.id = task.id;
    this.hasSubtasks = (task.subtasks?.length ?? 0) > 0;
    this.title = task.title;
    this.description = task.description;
    this.completedAt = task.completedAt;
    this.date = task.date;
    this.subtasks = SubtaskResource.collection(task.subtasks);
    this.createdAt = task.createdAt;
    this.updatedAt = task.updatedAt;
  }

  static collection(tasks?: Task[]): TaskResource[] {
    return tasks?.map((task) => new TaskResource(task)) ?? [];
  }
}
