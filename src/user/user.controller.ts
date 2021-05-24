import { Body, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { IApplicationResponse } from '../common/application-response.interface';
import { UserService } from './user.service';
import { UserRoles } from './user.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetInfoSuccessResultDto } from './dto/get-info-result.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  async getOne(
    @Param('id') id: number,
    @Body() body: any,
  ): Promise<IApplicationResponse> {
    const result = await this.userService.getUserInfo(id);

    if (result instanceof GetInfoSuccessResultDto) {
      if (body.userRole !== UserRoles.Admin && body.userId != id) {
        delete result.email;
        delete result.banned;
      }
    }

    return result instanceof GetInfoSuccessResultDto
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
