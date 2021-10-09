import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as uuid from 'uuid';
import { Repository } from 'typeorm';
import { InviteEntity } from './invite.entity';
import { GetAllFailureResultDto, GetAllResultDto, GetAllSuccessResultDto } from "./dto/get-all-result.dto";

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(InviteEntity)
    private invitesRepository: Repository<InviteEntity>,
  ) {}

  async getAll(): Promise<GetAllResultDto> {
    const invites = await this.invitesRepository.find();

    if (invites == null) {
      const result = new GetAllFailureResultDto();
      result.code = 0;
      result.message = 'Unknown error';
      return result;
    }

    const result = new GetAllSuccessResultDto();
    result.count = invites.length;
    result.invites = invites;
    return result;
  }

  async generate(): Promise<string> {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);
    const value = uuid.v4().split('-')[0];

    const newInvite = new InviteEntity();
    newInvite.expiresAt = expiresAt;
    newInvite.value = value;
    newInvite.isGroup = false;
    newInvite.limit = -1;
    await this.invitesRepository.save(newInvite);

    return value;
  }

  async remove(invite: string): Promise<void> {
    const foundInvite = await this.invitesRepository.findOne({
      where: { value: invite },
    });

    if (foundInvite != null) {
      await this.invitesRepository.remove(foundInvite);
    }
  }

  async check(invite: string): Promise<boolean> {
    const foundInvite = await this.invitesRepository.findOne({
      where: { value: invite },
    });

    return foundInvite != null && foundInvite.expiresAt > new Date();
  }
}
