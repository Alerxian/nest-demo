import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface ApiResponse<T = any> {
  code: HttpStatus | number;
  data: T;
  message: string;
}

export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // 如果返回的数据已经是标准格式，直接返回
        if (data && typeof data === 'object' && 'code' in data) {
          return data as unknown as ApiResponse<T>;
        }

        // 否则转换为标准格式
        return {
          code: 200,
          data,
          message: '操作成功',
        };
      }),
    );
  }
}
