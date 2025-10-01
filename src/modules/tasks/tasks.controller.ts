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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { TasksPaginatedResponseDto } from './dto/tasks-paginated-response.dto';
import { Task } from './entities/task.entity';
import { TaskNotFoundException } from './exceptions/task-not-found.exception';
import { DeleteResult } from 'typeorm';

@Controller('api/v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  async findAll(
    @Query() getTasksDto: GetTasksDto,
  ): Promise<TasksPaginatedResponseDto> {
    const [tasks, total] = await this.tasksService.findAndCount(
      getTasksDto.limit,
      getTasksDto.skip,
    );

    return {
      data: tasks,
      total,
      page: getTasksDto.page,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    const task: Task | null = await this.tasksService.findOneById(id);

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    return task;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task: Task | null = await this.tasksService.findOneById(id);

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    return this.tasksService.update(task, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const deleted: DeleteResult = await this.tasksService.delete(id);

    if (deleted.affected === 0) {
      throw new TaskNotFoundException(id);
    }
  }
}
