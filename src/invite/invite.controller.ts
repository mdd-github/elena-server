import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { IApplicationResponse } from '../common/application-response.interface';
import { InviteService } from './invite.service';
import { AdminRoleGuard } from '../auth/guards/role.guard';
import { GetAllSuccessResultDto } from './dto/get-all-result.dto';
import { GenerateDto } from './dto/generate.dto';

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

  @Post('remove-expired')
  @UseGuards(AdminRoleGuard)
  async removeExpired(): Promise<IApplicationResponse> {
    await this.inviteService.removeExpired();

    return {
      success: true,
      payload: null,
    };
  }

  /*@Post('create')
  async create(): Promise<IApplicationResponse> {
    const invite = await this.inviteService.generate();
    return {
      success: true,
      payload: {
        value: invite,
      },
    };
  }*/

  @Post('generate')
  async generate(
    @Body() generateDto: GenerateDto,
  ): Promise<IApplicationResponse> {
    const result = await this.inviteService.generate2(generateDto);

    return result.constructor.name == 'GenerateSuccessResultDto'
      ? {
          success: true,
          payload: result,
        }
      : {
          success: false,
          payload: result,
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
