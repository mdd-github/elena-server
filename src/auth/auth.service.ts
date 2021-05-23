import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
  RegisterDto,
  RegisterFailureResultDto,
  RegisterResultDto,
  RegisterSuccessResultDto,
} from './dto/register.dto';
import { USER_ALREADY_EXIST_ERROR } from '../user/errors/user-already-exist.error';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(data: RegisterDto): Promise<RegisterResultDto> {
    try {
      const createdUser = await this.userService.create(data);

      const result = new RegisterSuccessResultDto();
      result.id = createdUser.id;
      result.role = createdUser.role;
      return result;
    } catch (e) {
      const result = new RegisterFailureResultDto();
      switch (e.name) {
        case USER_ALREADY_EXIST_ERROR:
          result.code = 1;
          result.message = e.message;
          return result;
        default:
          throw e;
      }
    }
  }
}
