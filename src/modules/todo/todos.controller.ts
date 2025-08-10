import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  Put,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { GetTodosDto } from './dto/get-todos.dto';
import { TodoPaginatedResponseDto } from './dto/todo-paginated-response.dto';
import { Todo } from './entities/todo.entity';
import { TodoNotFoundException } from './exceptions/todo-not-found.exception';
import { DeleteResult } from 'typeorm';

@Controller('api/v1/todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  async findAll(
    @Query() getTodosDto: GetTodosDto,
  ): Promise<TodoPaginatedResponseDto> {
    const [todos, total] = await this.todosService.findAndCount(
      getTodosDto.limit,
      getTodosDto.skip,
    );

    return {
      data: todos,
      total,
      page: getTodosDto.page,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
    const todo: Todo | null = await this.todosService.findOneById(id);

    if (!todo) {
      throw new TodoNotFoundException(id);
    }

    return todo;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    const todo: Todo | null = await this.todosService.findOneById(id);

    if (!todo) {
      throw new TodoNotFoundException(id);
    }

    return this.todosService.update(todo, updateTodoDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const deleted: DeleteResult = await this.todosService.delete(id);

    if (deleted.affected === 0) {
      throw new TodoNotFoundException(id);
    }
  }
}
