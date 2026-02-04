import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DeleteResult,
  FindManyOptions,
  FindOptionsWhere,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskInput } from './interfaces/create-task.input.interface';
import { UpdateTaskInput } from './interfaces/update-task.input.interface';
import { GetTasksInput } from './interfaces/get-tasks.input.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  create(data: CreateTaskInput): Task {
    const task = new Task();

    task.title = data.title;
    task.description = data.description ?? null;
    task.completedAt = data.completed ? new Date() : null;
    task.user = data.user;

    return task;
  }

  async findAndCount(data: GetTasksInput): Promise<[Task[], number]> {
    const relations: string[] = data.relations ?? [];

    const where: FindOptionsWhere<Task> = {};

    if (data.userId !== undefined) {
      where.userId = data.userId;
    }

    if (data.isParent !== undefined) {
      where.parentId = data.isParent ? IsNull() : Not(IsNull());
    }

    if (data.parentId !== undefined) {
      where.parentId = data.parentId;
    }

    const options: FindManyOptions<Task> = {
      take: data.limit,
      skip: data.skip,
      relations,
      where,
    };

    return this.taskRepository.findAndCount(options);
  }

  update(task: Task, data: UpdateTaskInput) {
    if (data.title !== undefined) {
      task.title = data.title;
    }

    if (data.description !== undefined) {
      task.description = data.description;
    }

    if (data.completed !== undefined) {
      if (!task.parentId && task.subtasksCount) {
        throw new BadRequestException(
          'Task will be completed when all subtasks are finished',
        );
      }

      task.completedAt = data.completed ? new Date() : null;
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.taskRepository.delete(id);
  }

  async findOneBy(
    conditions: FindOptionsWhere<Task> | FindOptionsWhere<Task>[],
    relations?: string[],
  ): Promise<Task | null> {
    return this.taskRepository.findOne({
      where: conditions,
      relations: relations?.length ? { subtasks: true } : undefined,
    });
  }

  async findOneById(
    id: number,
    filters?: FindOptionsWhere<Task> | FindOptionsWhere<Task>[],
    relations?: string[],
  ): Promise<Task | null> {
    return this.findOneBy({ id, ...filters }, relations);
  }

  async save(task: Task): Promise<Task> {
    return this.taskRepository.save(task);
  }
}
