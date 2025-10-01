import { BasePaginatedResponseDto } from '../../../common/dto/base-paginated-response.dto';
import { Task } from '../entities/task.entity';

export class TasksPaginatedResponseDto extends BasePaginatedResponseDto<Task> {}
