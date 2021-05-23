import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JsonWebTokenService {
  private secret: string;

  constructor(private readonly configService: ConfigService) {
    this.secret = configService.get('APP_JWT_SECRET');
  }

  sign(payload: any): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: '1h',
    });
  }

  verify(token: string) {
    return jwt.verify(token, this.secret);
  }
}
