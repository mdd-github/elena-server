import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
  RegisterDto, RegisterErrors,
  RegisterFailureResultDto,
  RegisterResultDto,
  RegisterSuccessResultDto
} from "./dto/register.dto";
import { USER_ALREADY_EXIST_ERROR } from '../user/errors/user-already-exist.error';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { InviteService } from '../invite/invite.service';
import {
  LoginDto, LoginErrors,
  LoginFailureResultDto,
  LoginResultDto,
  LoginSuccessResultDto
} from "./dto/login.dto";
import { UserEntity } from '../user/user.entity';
import { JsonWebTokenService } from '../json-web-token/json-web-token.service';
import { SessionService } from '../session/session.service';
import {
  RefreshDto,
  RefreshFailureResultDto,
  RefreshResultDto,
  RefreshSuccessResultDto,
} from './dto/refresh.dto';
import { INCORRECT_SESSION_ERROR } from '../session/errors/incorrect-session.error';
import { SESSION_EXPIRED_ERROR } from '../session/errors/session-expired.error';

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
      result.code = RegisterErrors.IncorrectInvite;
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
          result.code = RegisterErrors.UserAlreadyExist;
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
      incorrectDataResult.code = LoginErrors.IncorrectLoginData;
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
    result.refresh = session.id;
    return result;
  }

  async refresh(data: RefreshDto): Promise<RefreshResultDto> {
    try {
      const session = await this.sessionService.refresh({
        session: data.refresh,
        fingerprint: data.fingerprint,
      });

      const token = this.signUser(session.user);

      const result = new RefreshSuccessResultDto();
      result.id = session.user.id;
      result.role = session.user.role;
      result.refresh = session.id;
      result.token = token;
      return result;
    } catch (e) {
      switch (e.name) {
        case INCORRECT_SESSION_ERROR:
        case SESSION_EXPIRED_ERROR:
          return new RefreshFailureResultDto();
        default:
          throw e;
      }
    }
  }

  signUser(user: UserEntity): string {
    return this.jwtService.sign({
      id: user.id,
      role: user.role,
    });
  }
}
