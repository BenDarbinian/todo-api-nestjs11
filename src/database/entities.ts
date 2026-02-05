import { Task } from '../modules/tasks/entities/task.entity';
import { EmailVerificationToken } from '../modules/email-verification/entities/email-verification-token.entity';
import { User } from '../modules/users/entities/user.entity';

export const entities = [Task, User, EmailVerificationToken];
