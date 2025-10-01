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
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { TasksPaginatedResponseDto } from './dto/tasks-paginated-response.dto';
import { Task } from './entities/task.entity';
import { TaskNotFoundException } from './exceptions/task-not-found.exception';
import { DeleteResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('api/v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description:
      'Creates a new task with the provided details. The task will be marked as not completedby default.',
  })
  @ApiCreatedResponse({
    description: 'The task has been successfully created.',
    type: Task,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiBody({ type: CreateTaskDto })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tasks with pagination',
    description: 'Retrieves a paginated list of tasks.',
  })
  @ApiOkResponse({
    description: 'List of tasks retrieved successfully.',
    type: TasksPaginatedResponseDto,
  })
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
  @ApiOperation({
    summary: 'Get a task by ID',
    description: 'Retrieves the details of a specific task by its ID.',
  })
  @ApiOkResponse({ description: 'Task retrieved successfully.', type: Task })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    const task: Task | null = await this.tasksService.findOneById(id);

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    return task;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a task by ID',
    description: 'Updates the details of a specific task by its ID.',
  })
  @ApiOkResponse({ description: 'Task updated successfully.', type: Task })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
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
  @ApiOperation({
    summary: 'Delete a task by ID',
    description: 'Deletes aspecific task by its ID.',
  })
  @ApiNoContentResponse({ description: 'Task deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const deleted: DeleteResult = await this.tasksService.delete(id);

    if (deleted.affected === 0) {
      throw new TaskNotFoundException(id);
    }
  }
}
