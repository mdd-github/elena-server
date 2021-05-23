import { Body, Controller, Post } from '@nestjs/common';
import { IApplicationResponse } from '../common/application-response.interface';
import { InviteService } from './invite.service';
import { RemoveDto } from './dto/remove.dto';

@Controller('invite')
export class InviteController {
  constructor(private inviteService: InviteService) {}

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

  @Post('remove')
  async remove(@Body() data: RemoveDto): Promise<IApplicationResponse> {
    await this.inviteService.remove(data.invite);
    return {
      success: true,
      payload: {},
    };
  }
}