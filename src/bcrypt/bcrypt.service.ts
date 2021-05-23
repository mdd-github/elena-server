import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BcryptService {
  private rounds: number;

  constructor(configService: ConfigService) {
    this.rounds = +configService.get('APP_BCRYPT_ROUNDS');
  }

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.rounds);
  }

  async compare(password, hash): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
