import { Injectable } from '@nestjs/common';
import { SessionEntity } from './session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { RefreshDto } from './dto/refresh.dto';
import { UserEntity } from '../user/user.entity';
import { IncorrectSessionError } from "./errors/incorrect-session.error";
import { SessionExpiredError } from "./errors/session-expired.error";

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionsRepository: Repository<SessionEntity>,
  ) {}

  async cleanSessionOfUser(user: UserEntity, fingerprint = ''): Promise<void> {
    const sessionsOfUser = await this.sessionsRepository.find({
      where: { user: user },
    });

    if (sessionsOfUser.length >= 5) {
      await this.remove(sessionsOfUser[0].id);
      sessionsOfUser.splice(0, 1);
    }

    for (const session of sessionsOfUser) {
      if (
        session.fingerprint === fingerprint ||
        session.expiresAt <= new Date()
      ) {
        await this.remove(session.id);
      }
    }
  }

  async create(data: CreateDto): Promise<SessionEntity> {
    await this.cleanSessionOfUser(data.user, data.fingerprint);

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const newSession = new SessionEntity();
    newSession.fingerprint = data.fingerprint;
    newSession.expiresAt = expiresAt;
    newSession.user = data.user;

    return await this.sessionsRepository.save(newSession);
  }

  async remove(session: string): Promise<void> {
    await this.sessionsRepository.delete(session);
  }

  async refresh(data: RefreshDto): Promise<SessionEntity> {
    const session = await this.sessionsRepository.findOne(data.session, {
      relations: ['user'],
    });

    if (session == null) {
      throw new IncorrectSessionError();
    }
    await this.cleanSessionOfUser(session.user, session.fingerprint);

    if (session.expiresAt < new Date()) {
      throw new SessionExpiredError();
    }

    if (session.fingerprint != data.fingerprint) {
      throw new IncorrectSessionError();
    }

    return await this.create({
      fingerprint: data.fingerprint,
      user: session.user,
    });
  }
}
