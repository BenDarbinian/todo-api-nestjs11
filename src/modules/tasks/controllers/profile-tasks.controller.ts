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
}
