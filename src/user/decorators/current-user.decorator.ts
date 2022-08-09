import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CreateUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
