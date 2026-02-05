import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('email_verification_tokens')
export class EmailVerificationToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 64, nullable: false, unique: true })
  tokenHash: string;

  @Column({ type: 'datetime', precision: 6, nullable: false })
  expiresAt: Date;

  @Column({ type: 'datetime', precision: 6, nullable: true })
  usedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
