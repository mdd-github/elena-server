import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err.response.message != null) {
          const code = +err.response.message[0].split('|')[0];
          const message = err.response.message[0].split('|')[1];

          return of({
            success: false,
            payload: {
              code: code,
              message: message,
            },
          });
        } else {
          throw err;
        }
      }),
    );
  }
}
