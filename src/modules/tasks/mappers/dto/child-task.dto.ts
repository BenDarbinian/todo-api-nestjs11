import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ChildTaskDto {
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
    description: 'Indicates if the subtask is completed',
    example: false,
  })
  @Expose()
  completed: boolean;
}
