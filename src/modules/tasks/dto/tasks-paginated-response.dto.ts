import { BasePaginatedResponseDto } from '../../../common/dto/base-paginated-response.dto';
import { TaskListDto } from '../mappers/dto/task.list.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TasksPaginatedResponseDto extends BasePaginatedResponseDto<TaskListDto> {
  @ApiProperty({
    isArray: true,
    type: TaskListDto,
  })
  @Expose()
  @Type(() => TaskListDto)
  declare data: TaskListDto[];
}
