import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { IApplicationResponse } from '../common/application-response.interface';
import { UserService } from './user.service';
import { UserRoles } from './user.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetInfoSuccessResultDto } from './dto/get-info-result.dto';
import { GetAllSuccessResultDto } from './dto/get-all-result.dto';
import { AdminRoleGuard } from '../auth/guards/role.guard';
import { RemoveSuccessResultDto } from './dto/remove-result.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('remove/:id')
  @UseGuards(AdminRoleGuard)
  async remove(
    @Param('id') id: number,
    @Body() body: any,
  ): Promise<IApplicationResponse> {
    if (body.userId !== id) {
      await this.userService.removeById(id);

      return {
        success: true,
        payload: {},
      };
    } else {
      return {
        success: false,
        payload: {
          code: 0,
          message: "You can't remove yourself",
        },
      };
    }
  }

  @Get('all')
  @UseGuards(AdminRoleGuard)
  async getAll(): Promise<IApplicationResponse> {
    const result = await this.userService.getAll();

    if (result instanceof GetAllSuccessResultDto) {
      return {
        success: true,
        payload: result,
      };
    } else {
      return {
        success: false,
        payload: result,
      };
    }
  }

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
