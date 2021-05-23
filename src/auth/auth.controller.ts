import { Body, Controller, Post } from '@nestjs/common';
import { IApplicationResponse } from '../common/application-response.interface';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { BcryptService } from '../bcrypt/bcrypt.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly bcryptService: BcryptService,
  ) {}

  @Post('register')
  async register(@Body() data: RegisterDto): Promise<IApplicationResponse> {
    const passwordHash = await this.bcryptService.hash(data.password);

    const result = await this.authService.register({
      ...data,
      password: passwordHash,
    });

    return result.constructor.name == 'RegisterSuccessResultDto'
      ? {
          success: true,
          payload: result,
        }
      : {
          success: false,
          payload: result,
        };
  }
}
