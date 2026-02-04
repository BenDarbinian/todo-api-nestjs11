import { User } from '../../users/entities/user.entity';

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  date?: string | null;
  completed?: boolean;
  user: User;
}
