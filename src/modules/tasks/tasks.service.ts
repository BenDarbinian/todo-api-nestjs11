import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DeleteResult, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new Task();

    task.title = createTaskDto.title;
    task.description = createTaskDto.description;
    task.completed = createTaskDto.completed;

    return this.taskRepository.save(task);
  }

  async findAndCount(take: number, skip: number): Promise<[Task[], number]> {
    return this.taskRepository.findAndCount({
      take,
      skip,
    });
  }

  async update(task: Task, updateTaskDto: UpdateTaskDto): Promise<Task> {
    task.title = updateTaskDto.title;
    task.description = updateTaskDto.description;
    task.completed = updateTaskDto.completed;

    return this.taskRepository.save(task);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.taskRepository.delete(id);
  }

  private async findOneBy<K extends keyof Task>(
    field: K,
    value: Task[K],
  ): Promise<Task | null> {
    return this.taskRepository.findOne({
      where: { [field]: value },
    });
  }

  async findOneById(id: number): Promise<Task | null> {
    return this.findOneBy('id', id);
  }
}
