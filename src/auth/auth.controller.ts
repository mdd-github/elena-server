import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { IApplicationResponse } from '../common/application-response.interface';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RefreshCookieInterceptor } from './interceptors/refresh-cookie.interceptor';
import { ValidationInterceptor } from './interceptors/validation.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(ValidationInterceptor)
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
  @UseInterceptors(ValidationInterceptor, RefreshCookieInterceptor)
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

  @Post('refresh')
  @UseInterceptors(ValidationInterceptor, RefreshCookieInterceptor)
  async refresh(@Body() data: RefreshDto): Promise<IApplicationResponse> {
    const result = await this.authService.refresh(data);
    return result.constructor.name == 'RefreshSuccessResultDto'
      ? {
          success: true,
          payload: result,
        }
      : {
          success: false,
          payload: result,
        };
  }

  @Post('logout')
  @UseInterceptors(RefreshCookieInterceptor)
  async logout(@Body() data: any): Promise<IApplicationResponse> {
    await this.authService.logout(data);

    return {
      success: true,
      payload: null,
    };
  }
}
