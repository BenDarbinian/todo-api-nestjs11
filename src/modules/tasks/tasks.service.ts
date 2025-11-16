import { Injectable } from '@nestjs/common';
import {
  DeleteResult,
  FindManyOptions,
  FindOptionsWhere,
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

  async create(data: CreateTaskInput): Promise<Task> {
    const task = new Task();

    task.title = data.title;
    task.description = data.description;
    task.completed = data.completed;
    task.user = data.user;

    return this.taskRepository.save(task);
  }

  async findAndCount(data: GetTasksInput): Promise<[Task[], number]> {
    const options: FindManyOptions<Task> = {
      take: data.limit,
      skip: data.skip,
    };

    if (data.userId !== undefined) {
      options.where = {
        userId: data.userId,
      };
    }

    return this.taskRepository.findAndCount(options);
  }

  async update(task: Task, data: UpdateTaskInput): Promise<Task> {
    task.title = data.title;
    task.description = data.description;
    task.completed = data.completed;

    return this.taskRepository.save(task);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.taskRepository.delete(id);
  }

  async findOneBy(
    conditions: FindOptionsWhere<Task> | FindOptionsWhere<Task>[] | undefined,
  ): Promise<Task | null> {
    return this.taskRepository.findOne({
      where: conditions,
    });
  }

  async findOneById(
    id: number,
    filters?: FindOptionsWhere<Task> | FindOptionsWhere<Task>[],
  ): Promise<Task | null> {
    return this.findOneBy({
      id,
      ...filters,
    });
  }
}
