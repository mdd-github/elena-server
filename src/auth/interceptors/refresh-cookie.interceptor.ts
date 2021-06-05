import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { map } from 'rxjs/operators';
import { IApplicationResponse } from '../../common/application-response.interface';

@Injectable()
export class RefreshCookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res: Response = context.switchToHttp().getResponse();
    const req: Request = context.switchToHttp().getRequest();
    req.body.refresh = req.cookies['refresh'] || '';

    return next.handle().pipe(
      map((result: IApplicationResponse) => {
        if (result.payload?.refresh != null) {
          const refresh = result.payload.refresh;
          delete result.payload.refresh;

          res.cookie('refresh', refresh, {
            httpOnly: true,
            path: '/api/auth',
            domain: 'matrix.titovasvetlana.ru',
            sameSite: 'none',
            secure: true,
          });
          res.send(result);
        } else {
          return result;
        }
      }),
    );
  }
}
