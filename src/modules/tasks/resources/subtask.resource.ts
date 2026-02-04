import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';

export class SubtaskResource {
  @ApiProperty({
    description: 'Unique identifier of the subtask',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The title of the subtask',
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
    this.title = task.title;
    this.completedAt = task.completedAt;
  }

  static collection(tasks?: Task[]): SubtaskResource[] {
    return tasks?.map((task) => new SubtaskResource(task)) ?? [];
  }
}
