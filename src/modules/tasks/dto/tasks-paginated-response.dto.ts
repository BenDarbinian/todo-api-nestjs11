import { BasePaginatedResponseDto } from '../../../common/dto/base-paginated-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { TaskListResource } from '../resources/task-list.resource';

export class TasksPaginatedResponseDto extends BasePaginatedResponseDto<TaskListResource> {
  @ApiProperty({
    isArray: true,
    type: TaskListResource,
  })
  declare data: TaskListResource[];

  @ApiProperty({
    description: 'Total number of completed tasks',
    example: 25,
  })
  completed: number;
}
