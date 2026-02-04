import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { ProfileTasksController } from './controllers/profile-tasks.controller';
import { ProfileSubtasksController } from './controllers/profile-subtasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [ProfileTasksController, ProfileSubtasksController],
  providers: [TasksService],
})
export class TasksModule {}
