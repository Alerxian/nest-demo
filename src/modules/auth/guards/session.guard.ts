import { RequestWithSession } from '@/types/request';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithSession>();
    if (!request.session || !request.session.user) {
      throw new UnauthorizedException({
        message: '未授权的访问',
        code: 401,
      });
    }

    return true;
  }
}
