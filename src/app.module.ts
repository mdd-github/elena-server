import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { InviteModule } from './invite/invite.module';
import { JsonWebTokenModule } from './json-web-token/json-web-token.module';
import { SessionModule } from './session/session.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('TYPEORM_HOST'),
        port: configService.get<number>('TYPEORM_PORT'),
        username: configService.get<string>('TYPEORM_USERNAME'),
        password: configService.get<string>('TYPEORM_PASSWORD'),
        database: configService.get<string>('TYPEORM_DATABASE'),
        entities: [configService.get<string>('TYPEORM_ENTITIES')],
        synchronize: false,
      }),
    }),
    AuthModule,
    InviteModule,
    UserModule,
    BcryptModule,
    JsonWebTokenModule,
    SessionModule,
    EmailModule,
  ],
})
export class AppModule {}
