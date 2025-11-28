import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const duration = Date.now() - startedAt;
          this.logger.log(
            `${method} ${originalUrl} ${statusCode} - ${duration}ms - UA:${userAgent} IP:${ip}`,
          );
        },
        error: (error: unknown) => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const duration = Date.now() - startedAt;
          this.logger.error(
            `${method} ${originalUrl} ${statusCode} - ${duration}ms - Error: ${
              (error as Error)?.message ?? error
            }`,
          );
        },
      }),
    );
  }
}

