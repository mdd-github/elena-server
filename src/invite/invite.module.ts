import { forwardRef, Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteEntity } from './invite.entity';
import { AuthModule } from '../auth/auth.module';
import { JsonWebTokenModule } from "../json-web-token/json-web-token.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([InviteEntity]),
    forwardRef(() => AuthModule),
    JsonWebTokenModule,
  ],
  providers: [InviteService],
  controllers: [InviteController],
  exports: [InviteService],
})
export class InviteModule {}
