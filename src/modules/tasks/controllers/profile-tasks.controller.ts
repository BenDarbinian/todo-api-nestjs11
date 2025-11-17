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
import { TaskMapper } from '../mappers/task.mapper';
import { TaskDto } from '../mappers/dto/task.dto';
import { TaskListDto } from '../mappers/dto/task.list.dto';
import { JwtAuthGuard } from '../../../common/auth/guards/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { User as UserEntity } from '../../users/entities/user.entity';
import { IsNull } from 'typeorm';
import { CreateSubtaskDto } from '../dto/create-subtask.dto';
import { UpdateSubtaskDto } from '../dto/update-subtask.dto';
import { SubtaskNotFoundException } from '../exceptions/subtask-not-found.exception';

@ApiTags('Profile Tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/v1/users/me/tasks')
export class ProfileTasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly taskMapper: TaskMapper,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description:
      'Creates a new task with the provided details. The task will be marked as not completed by default.',
  })
  @ApiCreatedResponse({
    description: 'The task has been successfully created.',
    type: TaskDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiBody({ type: CreateTaskDto })
  async create(
    @User() user: UserEntity,
    @Body() dto: CreateTaskDto,
  ): Promise<TaskDto> {
    const task: Task = this.tasksService.create({
      title: dto.title,
      description: dto.description,
      user,
    });

    const createdTask = await this.tasksService.save(task);

    return this.taskMapper.toDto(createdTask, TaskDto);
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
    const [tasks, total] = await this.tasksService.findAndCount({
      limit: dto.limit,
      page: dto.page,
      skip: dto.skip,
      userId: user.id,
      isParent: true,
      relations: ['children'],
    });

    return {
      data: this.taskMapper.toDto(tasks, TaskListDto),
      total,
      page: dto.page,
      limit: dto.limit,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a task by ID',
    description: 'Retrieves the details of a specific task by its ID.',
  })
  @ApiOkResponse({ description: 'Task retrieved successfully.', type: TaskDto })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  async findOne(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TaskDto> {
    const task: Task | null = await this.tasksService.findOneById(
      id,
      {
        userId: user.id,
        parentId: IsNull(),
      },
      ['children'],
    );

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    return this.taskMapper.toDto(task, TaskDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a task by ID',
    description: 'Updates the details of a specific task by its ID.',
  })
  @ApiOkResponse({ description: 'Task updated successfully.', type: TaskDto })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
  async update(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDto> {
    const task: Task | null = await this.tasksService.findOneById(id, {
      userId: user.id,
      parentId: IsNull(),
    });

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    this.tasksService.update(task, updateTaskDto);

    const updatedTask = await this.tasksService.save(task);

    return this.taskMapper.toDto(updatedTask, TaskDto);
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

  @Post(':id/subtasks')
  @ApiOperation({
    summary: 'Create a subtask for a task',
    description: 'Creates a new subtask for the specified task ID.',
  })
  @ApiCreatedResponse({
    description: 'The subtask has been successfully created.',
    type: TaskDto,
  })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiBody({ type: CreateSubtaskDto })
  async createSubtask(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() createSubtaskDto: CreateSubtaskDto,
  ): Promise<TaskDto> {
    const task: Task | null = await this.tasksService.findOneById(
      id,
      {
        userId: user.id,
        parentId: IsNull(),
      },
      ['children'],
    );

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    const subtask: Task = this.tasksService.create({
      title: createSubtaskDto.title,
      user,
    });

    if (task.children === undefined) {
      throw new Error('Children are not initialized');
    }

    task.children.push(subtask);

    const updatedTask = await this.tasksService.save(task);

    return this.taskMapper.toDto(updatedTask, TaskDto);
  }
  @Patch(':id/subtasks/:subtaskId')
  @ApiOperation({
    summary: 'Update a subtask by ID',
    description: 'Updates the details of a specific subtask by its ID.',
  })
  @ApiOkResponse({
    description: 'Subtask updated successfully.',
    type: TaskDto,
  })
  @ApiNotFoundResponse({ description: 'Task or subtask not found.' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiParam({ name: 'subtaskId', type: Number, description: 'Subtask ID' })
  @ApiBody({ type: UpdateSubtaskDto })
  async updateSubtask(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Param('subtaskId', ParseIntPipe) subtaskId: number,
    @Body() updateSubtaskDto: UpdateSubtaskDto,
  ): Promise<TaskDto> {
    const task: Task | null = await this.tasksService.findOneById(
      id,
      {
        userId: user.id,
        parentId: IsNull(),
      },
      ['children'],
    );

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    if (task.children === undefined) {
      throw new Error('Children are not initialized');
    }

    const subtask: Task | undefined = task.children.find(
      (subtask) => subtask.id === subtaskId,
    );

    if (!subtask) {
      throw new SubtaskNotFoundException(subtaskId);
    }

    this.tasksService.update(subtask, updateSubtaskDto);

    const updatedTask = await this.tasksService.save(task);

    return this.taskMapper.toDto(updatedTask, TaskDto);
  }
  @Delete(':id/subtasks/:subtaskId')
  @ApiOperation({
    summary: 'Delete a subtask by ID',
    description: 'Deletes a specific subtask by its ID from a parent task.',
  })
  @ApiOkResponse({
    description: 'Subtask deleted successfully.',
    type: TaskDto,
  })
  @ApiNotFoundResponse({ description: 'Task or subtask not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiParam({ name: 'subtaskId', type: Number, description: 'Subtask ID' })
  async removeSubtask(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Param('subtaskId', ParseIntPipe) subtaskId: number,
  ): Promise<TaskDto> {
    const task: Task | null = await this.tasksService.findOneById(
      id,
      {
        userId: user.id,
        parentId: IsNull(),
      },
      ['children'],
    );

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    if (task.children === undefined) {
      throw new Error('Children are not initialized');
    }

    task.children = task.children.filter((subtask) => subtask.id !== subtaskId);

    const updatedTask = await this.tasksService.save(task);

    return this.taskMapper.toDto(updatedTask, TaskDto);
  }
}
