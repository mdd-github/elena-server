import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
  RegisterDto,
  RegisterFailureResultDto,
  RegisterResultDto,
  RegisterSuccessResultDto,
} from './dto/register.dto';
import { USER_ALREADY_EXIST_ERROR } from '../user/errors/user-already-exist.error';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { InviteService } from '../invite/invite.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly inviteService: InviteService,
  ) {}

  async register(data: RegisterDto): Promise<RegisterResultDto> {
    if ((await this.inviteService.check(data.invite)) === false) {
      const result = new RegisterFailureResultDto();
      result.code = 1;
      result.message = 'Incorrect invite code';
      return result;
    }

    await this.inviteService.remove(data.invite);

    try {
      const passwordHash = await this.bcryptService.hash(data.password);
      const createdUser = await this.userService.create({
        ...data,
        password: passwordHash,
      });

      const result = new RegisterSuccessResultDto();
      result.id = createdUser.id;
      result.role = createdUser.role;
      return result;
    } catch (e) {
      const result = new RegisterFailureResultDto();
      switch (e.name) {
        case USER_ALREADY_EXIST_ERROR:
          result.code = 2;
          result.message = e.message;
          return result;
        default:
          throw e;
      }
    }
  }
}
