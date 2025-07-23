import { BasePaginatedResponseDto } from '../../../common/dto/base-paginated-response.dto';
import { Todo } from '../entities/todo.entity';

export class TodoPaginatedResponseDto extends BasePaginatedResponseDto<Todo> {}
