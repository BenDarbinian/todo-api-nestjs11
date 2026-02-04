import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';

export class TaskListResource {
  @ApiProperty({
    description: 'Unique identifier of the task',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The number of subtasks',
    example: 0,
  })
  subtasksCount: number;

  @ApiProperty({
    description: 'The title of the task',
    example: 'Buy groceries',
  })
  title: string;

  @ApiProperty({
    description: 'The date when the task was completed',
    example: '2023-04-05T12:00:00.000Z',
  })
  completedAt: Date | null;

  constructor(task: Task) {
    this.id = task.id;
    this.subtasksCount = task.subtasks ? task.subtasks.length : 0;
    this.title = task.title;
    this.completedAt = task.completedAt;
  }

  static collection(tasks?: Task[]): TaskListResource[] {
    return tasks?.map((task) => new TaskListResource(task)) ?? [];
  }
}
