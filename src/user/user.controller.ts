import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { IApplicationResponse } from '../common/application-response.interface';
import { UserService } from './user.service';
import { UserRoles } from './user.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetInfoSuccessResultDto } from './dto/get-info-result.dto';
import { GetAllSuccessResultDto } from './dto/get-all-result.dto';
import { AdminRoleGuard } from '../auth/guards/role.guard';
import {
  ChangePasswordDto,
  ChangePasswordSucceedResultDto,
} from './dto/change-password.dto';
import { ValidationInterceptor } from '../auth/interceptors/validation.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import * as csv from 'csv-parser';
import { Readable } from 'stream';
import {
  ChangeExpirationDateDto,
  ChangeExpirationDateSuccessDto,
} from './dto/change-expiration-date.dto';
import {
  ResetPasswordDto,
  ResetPasswordSucceedResultDto,
} from './dto/reset-password.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('set-role/:id/:role')
  @UseGuards(AdminRoleGuard)
  async setRole(
    @Param('id') id: number,
    @Param('role') role: string,
    @Body() body: any,
  ): Promise<IApplicationResponse> {
    if (body.userId != id) {
      await this.userService.setRole(id, role);

      return {
        success: true,
        payload: {},
      };
    } else {
      return {
        success: false,
        payload: {
          code: 0,
          message: "You can't change role",
        },
      };
    }
  }

  @Post('remove/:id')
  @UseGuards(AdminRoleGuard)
  async remove(
    @Param('id') id: number,
    @Body() body: any,
  ): Promise<IApplicationResponse> {
    if (body.userId != id) {
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

  @Post('ban/:id')
  @UseGuards(AdminRoleGuard)
  async ban(
    @Param('id') id: number,
    @Body() body: any,
  ): Promise<IApplicationResponse> {
    if (body.userId != id) {
      await this.userService.banById(id);

      return {
        success: true,
        payload: {},
      };
    } else {
      return {
        success: false,
        payload: {
          code: 0,
          message: "You can't ban yourself",
        },
      };
    }
  }

  @Post('unban/:id')
  @UseGuards(AdminRoleGuard)
  async unban(
    @Param('id') id: number,
    @Body() body: any,
  ): Promise<IApplicationResponse> {
    if (body.userId != id) {
      await this.userService.unbanById(id);

      return {
        success: true,
        payload: {},
      };
    } else {
      return {
        success: false,
        payload: {
          code: 0,
          message: "You can't unban yourself",
        },
      };
    }
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  @UseInterceptors(ValidationInterceptor)
  async changePassword(
    @Body() body: ChangePasswordDto,
  ): Promise<IApplicationResponse> {
    const result = await this.userService.changePassword(body);

    return result instanceof ChangePasswordSucceedResultDto
      ? {
          success: true,
          payload: result,
        }
      : {
          success: false,
          payload: result,
        };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: ResetPasswordDto,
  ): Promise<IApplicationResponse> {
    const result = await this.userService.resetPassword(body);

    return result instanceof ResetPasswordSucceedResultDto
      ? {
          success: true,
          payload: result,
        }
      : {
          success: false,
          payload: result,
        };
  }

  @Post('change-expiration')
  @UseGuards(AdminRoleGuard)
  @UseInterceptors(ValidationInterceptor)
  async changeExpirationDate(
    @Body() body: ChangeExpirationDateDto,
  ): Promise<IApplicationResponse> {
    console.log(body);
    const result = await this.userService.changeExpirationDate(body);

    return result instanceof ChangeExpirationDateSuccessDto
      ? {
          success: true,
          payload: result,
        }
      : {
          success: false,
          payload: result,
        };
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

  @Put('csv')
  @UseGuards(AdminRoleGuard)
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file: Express.Multer.File): Promise<void> {
    const data = file.buffer.toString('utf-8', 0, file.buffer.length);
    console.log('Test');
    console.log(file);
    console.log(data);

    const s = new Readable();

    s.pipe(csv()).on('data', async (user) => {
      console.log(user);

      try {
        const date = new Date();
        const partsOfDate = user.trial_before.split('/');
        if (partsOfDate.length == 3) {
          date.setDate(partsOfDate[0]);
          date.setMonth(partsOfDate[1] - 1);
          date.setFullYear(partsOfDate[2]);
        }

        await this.userService.createOrUpdate({
          email: user.email,
          password: user.password,
          firstName: user.first_name,
          lastName: user.last_name,
          isTrial: user.is_trial === '1',
          trialExpiresAt: date,
          role: user.role,
        });
      } catch (e) {
        console.log(e);
      }
    });
    s._read = () => {};
    s.push(data);
  }
}
