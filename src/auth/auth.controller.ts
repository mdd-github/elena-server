import { Body, Controller, Post } from '@nestjs/common';
import { IApplicationResponse } from '../common/application-response.interface';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterDto): Promise<IApplicationResponse> {
    const result = await this.authService.register(data);

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

  @Post('login')
  async login(@Body() data: LoginDto): Promise<IApplicationResponse> {
    const result = await this.authService.login(data);
    return result.constructor.name == 'LoginSuccessResultDto'
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
