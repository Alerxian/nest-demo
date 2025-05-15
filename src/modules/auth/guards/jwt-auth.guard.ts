import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    Logger.debug(`JWT Guard - User: ${JSON.stringify(user)}`);
    Logger.debug(`JWT Guard - Error: ${JSON.stringify(err)}`);
    Logger.debug(`JWT Guard - Info: ${JSON.stringify(info)}`);

    if (err || !user) {
      throw new UnauthorizedException({
        message: '未授权访问',
        error: err?.message || 'token 无效或已过期',
      });
    }

    return user;
  }
}
