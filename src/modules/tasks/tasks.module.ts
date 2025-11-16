import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskMapper } from './mappers/task.mapper';
import { ProfileTasksController } from './controllers/profile-tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [ProfileTasksController],
  providers: [TasksService, TaskMapper],
})
export class TasksModule {}
