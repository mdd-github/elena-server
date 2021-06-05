import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { AuthModule } from '../auth/auth.module';
import { JsonWebTokenModule } from '../json-web-token/json-web-token.module';
import { SessionModule } from '../session/session.module';
import { BcryptModule } from '../bcrypt/bcrypt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthModule),
    JsonWebTokenModule,
    SessionModule,
    BcryptModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
