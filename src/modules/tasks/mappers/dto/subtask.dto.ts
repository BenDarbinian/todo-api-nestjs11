import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SubtaskDto {
  @ApiProperty({
    description: 'Unique identifier of the subtask',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The title of the subtask',
    example: 'Buy groceries',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'The date when the task was completed',
    example: '2023-04-05T12:00:00.000Z',
  })
  @Expose()
  completedAt: Date | null;
}
