import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JsonWebTokenService } from '../../json-web-token/json-web-token.service';
import { UserRoles } from '../../user/user.entity';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly jwtService: JsonWebTokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const token = req.headers['authorization']?.split(' ')[1];
    if (token != null) {
      try {
        const decodedToken: any = this.jwtService.verify(token);
        if (decodedToken != null && decodedToken.role === UserRoles.Admin) {
          return true;
        }
      } catch (e){
        return false;
      }
    }
    return false;
  }
}
