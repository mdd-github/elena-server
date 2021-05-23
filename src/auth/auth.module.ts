import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { InviteModule } from '../invite/invite.module';
import { JsonWebTokenModule } from '../json-web-token/json-web-token.module';
import { SessionModule } from '../session/session.module';
import { RefreshCookieInterceptor } from './interceptors/refresh-cookie.interceptor';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature(),
    UserModule,
    BcryptModule,
    InviteModule,
    JsonWebTokenModule,
    SessionModule,
  ],
  providers: [AuthService, RefreshCookieInterceptor, AuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
