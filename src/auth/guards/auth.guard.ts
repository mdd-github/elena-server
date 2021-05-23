import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JsonWebTokenService } from '../../json-web-token/json-web-token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JsonWebTokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const token = req.headers['authorization']?.split(' ')[1];
    if (token != null) {
      const decodedToken: any = this.jwtService.verify(token);
      console.log(decodedToken);
      if (decodedToken != null) {
        req.body.userId = decodedToken.id;
        req.body.userRole = decodedToken.role;

        return true;
      }
    }

    return false;
  }
}
