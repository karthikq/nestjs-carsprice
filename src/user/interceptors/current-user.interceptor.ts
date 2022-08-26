import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { UserService } from '../user.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UserService) {}

  async intercept(context: ExecutionContext, handler: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    console.log(userId, 'userId');

    if (userId) {
      const user = await this.usersService.findOne(userId);
      request.currentUser = user;
    }

    return handler.handle();
  }
}
