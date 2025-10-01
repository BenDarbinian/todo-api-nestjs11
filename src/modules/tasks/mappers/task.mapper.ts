import { Injectable } from '@nestjs/common';
import { BaseMapper } from '../../../common/mappers/base.mapper';
import { Task } from '../entities/task.entity';

@Injectable()
export class TaskMapper extends BaseMapper<Task> {}
