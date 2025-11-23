import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { TasksService } from '../tasks.service';
import { Task } from '../entities/task.entity';
import { TaskNotFoundException } from '../exceptions/task-not-found.exception';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TaskMapper } from '../mappers/task.mapper';
import { TaskDto } from '../mappers/dto/task.dto';
import { JwtAuthGuard } from '../../../common/auth/guards/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';
import { User as UserEntity } from '../../users/entities/user.entity';
import { IsNull } from 'typeorm';
import { CreateSubtaskDto } from '../dto/create-subtask.dto';
import { UpdateSubtaskDto } from '../dto/update-subtask.dto';
import { SubtaskNotFoundException } from '../exceptions/subtask-not-found.exception';

@ApiTags('Profile Subtasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/v1/users/me/tasks/:id/subtasks')
export class ProfileSubtasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly taskMapper: TaskMapper,
  ) {}

  @Post()
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
  async create(
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
  @Patch(':subtaskId')
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
  async update(
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
  @Delete(':subtaskId')
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
  async remove(
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
