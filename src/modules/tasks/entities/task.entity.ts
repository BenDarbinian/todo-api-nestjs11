import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, (task) => task.subtasks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: Task | null;

  @Column({ type: 'int', nullable: true })
  parentId: number | null;

  @OneToMany(() => Task, (task) => task.parent, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  subtasks?: Task[];

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  description: string | null;

  @Column({ type: 'datetime', precision: 6, nullable: true })
  completedAt: Date | null;

  @ManyToOne(() => User, (user) => user.tasks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'date', nullable: true, default: () => 'CURRENT_DATE' })
  date: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get subtasksCount(): number {
    if (this.subtasks === undefined) {
      throw new Error('Subtasks are not initialized');
    }

    return this.subtasks.length;
  }

  updateCompletionStatus(): void {
    if (this.subtasks === undefined) {
      throw new Error('Subtasks are not initialized');
    }

    const allCompleted = this.subtasks.every(
      (subtask) => !!subtask.completedAt,
    );

    if (allCompleted) {
      this.completedAt = new Date();
    } else {
      this.completedAt = null;
    }
  }
}
