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
  HttpStatus,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { TasksService } from '../tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { GetTasksDto } from '../dto/get-tasks.dto';
import { TasksPaginatedResponseDto } from '../dto/tasks-paginated-response.dto';
import { Task } from '../entities/task.entity';
import { TaskNotFoundException } from '../exceptions/task-not-found.exception';
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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TaskResource } from '../resources/task.resource';
import { TaskListResource } from '../resources/task-list.resource';
import { JwtAuthGuard } from '../../../common/auth/guards/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { User as UserEntity } from '../../users/entities/user.entity';
import { IsNull } from 'typeorm';

@ApiTags('Profile Tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/v1/users/me/tasks')
export class ProfileTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description:
      'Creates a new task with the provided details. The task will be marked as not completed by default.',
  })
  @ApiCreatedResponse({
    description: 'The task has been successfully created.',
    type: TaskResource,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiBody({ type: CreateTaskDto })
  async create(
    @User() user: UserEntity,
    @Body() dto: CreateTaskDto,
  ): Promise<TaskResource> {
    const task: Task = this.tasksService.create({
      title: dto.title,
      description: dto.description,
      date: dto.date ?? new Date().toISOString().slice(0, 10),
      user,
    });

    if (dto.subtasks.length > 0) {
      task.subtasks = dto.subtasks.map((dto) => {
        const subtask = this.tasksService.create({
          title: dto.title,
          user,
        });

        subtask.parent = task;

        return subtask;
      });
    }

    const createdTask = await this.tasksService.save(task);

    return new TaskResource(createdTask);
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
    @User() user: UserEntity,
    @Query() dto: GetTasksDto,
  ): Promise<TasksPaginatedResponseDto> {
    const [[tasks, total], completed] = await Promise.all([
      this.tasksService.findAndCount({
        limit: dto.limit,
        page: dto.page,
        skip: dto.skip,
        date: dto.date,
        completed: dto.completed,
        userId: user.id,
        isParent: true,
        relations: ['subtasks'],
      }),
      this.tasksService.count({
        date: dto.date,
        completed: true,
        userId: user.id,
        isParent: true,
      }),
    ]);

    return {
      data: TaskListResource.collection(tasks),
      total,
      completed,
      page: dto.page,
      limit: dto.limit,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a task by ID',
    description: 'Retrieves the details of a specific task by its ID.',
  })
  @ApiOkResponse({
    description: 'Task retrieved successfully.',
    type: TaskResource,
  })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  async findOne(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TaskResource> {
    const task: Task | null = await this.tasksService.findOneById(
      id,
      {
        userId: user.id,
        parentId: IsNull(),
      },
      ['subtasks'],
    );

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    return new TaskResource(task);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a task by ID',
    description: 'Updates the details of a specific task by its ID.',
  })
  @ApiOkResponse({
    description: 'Task updated successfully.',
    type: TaskResource,
  })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
  async update(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResource> {
    const task: Task | null = await this.tasksService.findOneById(
      id,
      {
        userId: user.id,
        parentId: IsNull(),
      },
      ['subtasks'],
    );

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    this.tasksService.update(task, updateTaskDto);

    const updatedTask = await this.tasksService.save(task);

    return new TaskResource(updatedTask);
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
  async remove(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const task: Task | null = await this.tasksService.findOneById(id, {
      userId: user.id,
      parentId: IsNull(),
    });

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    await this.tasksService.delete(id);
  }
}
