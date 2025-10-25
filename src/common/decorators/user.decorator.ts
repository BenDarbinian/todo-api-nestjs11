import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request: AuthenticatedRequest = ctx
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
