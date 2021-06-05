import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { IApplicationResponse } from '../common/application-response.interface';
import { InviteService } from './invite.service';
import { RemoveDto } from './dto/remove.dto';
import { AdminRoleGuard } from '../auth/guards/role.guard';
import { GetAllSuccessResultDto } from './dto/get-all-result.dto';

@Controller('api/invite')
@UseGuards(AdminRoleGuard)
export class InviteController {
  constructor(private inviteService: InviteService) {}

  @Get('all')
  @UseGuards(AdminRoleGuard)
  async getAll(): Promise<IApplicationResponse> {
    const result = await this.inviteService.getAll();

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

  @Post('create')
  async create(): Promise<IApplicationResponse> {
    const invite = await this.inviteService.generate();
    return {
      success: true,
      payload: {
        value: invite,
      },
    };
  }

  @Post('remove/:invite')
  async remove(@Param('invite') invite: string): Promise<IApplicationResponse> {
    await this.inviteService.remove(invite);
    return {
      success: true,
      payload: {},
    };
  }
}
