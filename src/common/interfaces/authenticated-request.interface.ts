import { User } from '../../modules/users/entities/user.entity';

export interface AuthenticatedRequest extends Request {
  user: User;
}
