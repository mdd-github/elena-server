import { Body, Controller, Post } from '@nestjs/common';
import { IApplicationResponse } from '../common/application-response.interface';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';

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
}
