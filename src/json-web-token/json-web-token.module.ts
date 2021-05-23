import { Module } from '@nestjs/common';
import { JsonWebTokenService } from './json-web-token.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [JsonWebTokenService],
  exports: [JsonWebTokenService],
})
export class JsonWebTokenModule {}
