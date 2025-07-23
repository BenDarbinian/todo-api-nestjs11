import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { GetTodosDto } from './dto/get-todos.dto';
import { DeleteResult, Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoPaginatedResponseDto } from './dto/todo-paginated-response.dto';
import { TodoNotFoundException } from './exceptions/todo-not-found.exception';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = new Todo();

    todo.title = createTodoDto.title;
    todo.description = createTodoDto.description;
    todo.completed = createTodoDto.completed;

    return this.todoRepository.save(todo);
  }

  async findAll(getTodosDto: GetTodosDto): Promise<TodoPaginatedResponseDto> {
    const [todos, total] = await this.todoRepository.findAndCount({
      take: getTodosDto.limit,
      skip: getTodosDto.skip,
    });

    return {
      data: todos,
      total,
      page: getTodosDto.page,
    };
  }

  async findOne(id: number): Promise<Todo> {
    const todo: Todo | null = await this.findOneById(id);

    if (!todo) {
      throw new TodoNotFoundException(id);
    }

    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const todo: Todo | null = await this.findOneById(id);

    if (!todo) {
      throw new TodoNotFoundException(id);
    }

    todo.title = updateTodoDto.title ?? todo.title;
    todo.description = updateTodoDto.description ?? todo.description;
    todo.completed = updateTodoDto.completed ?? todo.completed;

    return this.todoRepository.save(todo);
  }

  async remove(id: number): Promise<void> {
    const deleted: DeleteResult = await this.todoRepository.delete(id);

    if (deleted.affected === 0) {
      throw new TodoNotFoundException(id);
    }
  }

  private async findOneBy<K extends keyof Todo>(
    field: K,
    value: Todo[K],
  ): Promise<Todo | null> {
    return this.todoRepository.findOne({
      where: { [field]: value },
    });
  }

  private async findOneById(id: number): Promise<Todo | null> {
    return this.findOneBy('id', id);
  }
}
