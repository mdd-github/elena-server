import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { InviteModule } from '../invite/invite.module';
import { JsonWebTokenModule } from '../json-web-token/json-web-token.module';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(),
    UserModule,
    BcryptModule,
    InviteModule,
    JsonWebTokenModule,
    SessionModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
