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
import {
  LoginDto,
  LoginFailureResultDto,
  LoginResultDto,
  LoginSuccessResultDto,
} from './dto/login.dto';
import { UserEntity } from '../user/user.entity';
import { JsonWebTokenService } from '../json-web-token/json-web-token.service';
import { SessionService } from '../session/session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly inviteService: InviteService,
    private readonly jwtService: JsonWebTokenService,
    private readonly sessionService: SessionService,
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

  async login(data: LoginDto): Promise<LoginResultDto> {
    const foundUser = await this.userService.getUserByEmail(data.email);
    const verifyResult =
      foundUser != null &&
      (await this.bcryptService.compare(data.password, foundUser.passwordHash));

    if (verifyResult === false) {
      const incorrectDataResult = new LoginFailureResultDto();
      incorrectDataResult.code = 1;
      incorrectDataResult.message = 'Incorrect login data';
      return incorrectDataResult;
    }

    const token = this.signUser(foundUser);
    const session = await this.sessionService.create({
      fingerprint: data.fingerprint,
      user: foundUser,
    });

    const result = new LoginSuccessResultDto();
    result.id = foundUser.id;
    result.role = foundUser.role;
    result.token = token;
    result.refresh = session;
    return result;
  }

  signUser(user: UserEntity): string {
    return this.jwtService.sign({
      id: user.id,
      role: user.role,
    });
  }
}
