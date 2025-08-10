import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { DeleteResult, Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';

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

  async findAndCount(take: number, skip: number): Promise<[Todo[], number]> {
    return this.todoRepository.findAndCount({
      take,
      skip,
    });
  }

  async update(todo: Todo, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    todo.title = updateTodoDto.title;
    todo.description = updateTodoDto.description;
    todo.completed = updateTodoDto.completed;

    return this.todoRepository.save(todo);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.todoRepository.delete(id);
  }

  private async findOneBy<K extends keyof Todo>(
    field: K,
    value: Todo[K],
  ): Promise<Todo | null> {
    return this.todoRepository.findOne({
      where: { [field]: value },
    });
  }

  async findOneById(id: number): Promise<Todo | null> {
    return this.findOneBy('id', id);
  }
}
