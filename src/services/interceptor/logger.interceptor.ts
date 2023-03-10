import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Logger } from '../helper/colorize';
import { gregorianToPersian } from '../helper/functions';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { body, path, uuid } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap((data) =>
        Logger.info({
          request: { body, path, uuid, time: gregorianToPersian(now, true) },
          response: data,
        }),
      ),
    );
  }
}
