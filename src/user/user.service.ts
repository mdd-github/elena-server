import { Injectable } from '@nestjs/common';
import { UserEntity, UserRoles } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAlreadyExistError } from './errors/user-already-exist.error';
import { Create2Dto, CreateDto } from './dto/create.dto';
import {
  GetInfoFailureResultDto,
  GetInfoResultDto,
  GetInfoSuccessResultDto,
} from './dto/get-info-result.dto';
import {
  GetAllFailureResultDto,
  GetAllResultDto,
  GetAllSuccessResultDto,
} from './dto/get-all-result.dto';
import {
  ChangePasswordDto,
  ChangePasswordErrors,
  ChangePasswordFailedResultDto,
  ChangePasswordResultDto,
  ChangePasswordSucceedResultDto,
} from './dto/change-password.dto';
import { SessionService } from '../session/session.service';
import { BcryptService } from '../bcrypt/bcrypt.service';
import {
  ChangeExpirationDateDto,
  ChangeExpirationDateErrors,
  ChangeExpirationDateFailedDto,
  ChangeExpirationDateSuccessDto,
} from './dto/change-expiration-date.dto';
import {
  ResetPasswordDto,
  ResetPasswordFailedResultDto,
  ResetPasswordResultDto,
  ResetPasswordSucceedResultDto,
} from './dto/reset-password.dto';
import * as uuid from 'uuid';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly sessionService: SessionService,
    private readonly bcryptService: BcryptService,
    private readonly configService: ConfigService,
  ) {}

  async removeById(id: number): Promise<void> {
    const user = await this.getUserById(id);

    if (user) {
      await this.sessionService.removeSessionOfUser(user);
      await this.usersRepository.delete(id);
    }
  }

  async banById(id: number): Promise<void> {
    const user = await this.getUserById(id);

    // TODO return error if not found
    if (user != null) {
      user.banned = true;
      await this.usersRepository.save(user);
    }
  }

  async unbanById(id: number): Promise<void> {
    const user = await this.getUserById(id);

    // TODO return error if not found
    if (user != null) {
      user.banned = false;
      await this.usersRepository.save(user);
    }
  }

  async changePassword(
    body: ChangePasswordDto,
  ): Promise<ChangePasswordResultDto> {
    const user = await this.getUserById(body.userId);

    if (user == null) {
      const failed = new ChangePasswordFailedResultDto();
      failed.code = 100;
      failed.message = 'User not found';
      return failed;
    }

    if (
      !(await this.bcryptService.compare(body.oldPassword, user.passwordHash))
    ) {
      const failed = new ChangePasswordFailedResultDto();
      failed.code = ChangePasswordErrors.IncorrectPassword;
      failed.message = 'Incorrect password';
      return failed;
    }

    await this.sessionService.removeSessionOfUser(user);

    user.passwordHash = await this.bcryptService.hash(body.newPassword);
    await this.usersRepository.save(user);

    return new ChangePasswordSucceedResultDto();
  }

  async resetPassword(body: ResetPasswordDto): Promise<ResetPasswordResultDto> {
    const user = await this.getUserByEmail(body.email);

    if (user == null) {
      const failed = new ResetPasswordFailedResultDto();
      failed.code = 100;
      failed.message = 'User not found';
      return failed;
    }

    const newPassword = uuid.v4().replace(/-/g, '');

    await this.sessionService.removeSessionOfUser(user);
    user.passwordHash = await this.bcryptService.hash(newPassword);
    await this.usersRepository.save(user);
    await this.sendPasswordToEmail(body.email, newPassword);

    return new ResetPasswordSucceedResultDto();
  }

  async sendPasswordToEmail(email, password): Promise<void> {
    const from = this.configService.get('APP_MAIL_USER');

    const transporter = nodemailer.createTransport({
      host: this.configService.get('APP_MAIL_SMTP_HOST'),
      port: +this.configService.get<number>('APP_MAIL_SMTP_PORT'),
      secure: this.configService.get<boolean>('APP_MAIL_SMTP_IS_SECURE'),
      auth: {
        user: from,
        pass: this.configService.get('APP_MAIL_PASSWORD'),
      },
    });

    const info = await transporter.sendMail({
      from: from,
      to: email,
      subject: 'Сброс пароля',
      html: `
<h2>Пароль успешно сброшен</h2>
<p>Здравствуйте,<br/> ваш пароль успешно сброшен.<br/> Новый пароль: <b>${password}</b></p>
`,
    });
  }

  async setRole(id: number, role: string): Promise<void> {
    const user = await this.getUserById(id);

    // TODO return error if not found
    if (user != null) {
      user.role = role;
      await this.usersRepository.save(user);
    }
  }

  async getAll(): Promise<GetAllResultDto> {
    const users = await this.usersRepository.find();

    if (users == null) {
      const result = new GetAllFailureResultDto();
      result.code = 0;
      result.message = 'Unknown error';
      return result;
    }

    const result = new GetAllSuccessResultDto();
    result.count = users.length;
    result.users = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      email: user.email,
      banned: user.banned,
      isTrial: user.isTrial,
      trialExpiredAt: user.trialExpiresAt,
    }));
    return result;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async getUserById(id: number): Promise<UserEntity> {
    return this.usersRepository.findOne(id);
  }

  async getUserInfo(id: number): Promise<GetInfoResultDto> {
    const notFoundResult = new GetInfoFailureResultDto();
    notFoundResult.code = 1;
    notFoundResult.message = 'User not found';
    if (id == null) {
      return notFoundResult;
    }

    const foundUser = await this.getUserById(id);
    if (foundUser == null) {
      return notFoundResult;
    }

    const result = new GetInfoSuccessResultDto();
    result.id = foundUser.id;
    result.banned = foundUser.banned;
    result.email = foundUser.email;
    result.firstName = foundUser.firstName;
    result.lastName = foundUser.lastName;
    result.role = foundUser.role;
    result.isTrial = foundUser.isTrial;
    result.trialBefore = foundUser.trialExpiresAt;
    return result;
  }

  async create(data: CreateDto): Promise<UserEntity> {
    const foundUser = await this.getUserByEmail(data.email);

    if (!!foundUser) {
      throw new UserAlreadyExistError();
    }

    const newUser = new UserEntity();
    newUser.email = data.email.toLowerCase();
    newUser.firstName = data.firstName;
    newUser.lastName = data.lastName;
    newUser.passwordHash = data.password;
    newUser.role = UserRoles.Employee;
    newUser.banned = false;
    newUser.trialExpiresAt = data.trialExpiresAt;
    newUser.isTrial = data.isTrial;

    return await this.usersRepository.save(newUser);
  }

  async createOrUpdate(data: Create2Dto): Promise<UserEntity> {
    let foundUser = await this.getUserByEmail(data.email);

    if (!foundUser) {
      foundUser = new UserEntity();
    }

    foundUser.email = data.email.toLowerCase();
    foundUser.firstName = data.firstName;
    foundUser.lastName = data.lastName;
    foundUser.passwordHash = await this.bcryptService.hash(data.password);
    foundUser.role = data.role;
    foundUser.banned = false;
    foundUser.trialExpiresAt = data.trialExpiresAt;
    foundUser.isTrial = data.isTrial;

    return await this.usersRepository.save(foundUser);
  }

  async changeExpirationDate(data: ChangeExpirationDateDto) {
    console.log(data.updateUserId);
    const foundUser = await this.getUserById(data.updateUserId);

    if (foundUser == null) {
      const failed = new ChangeExpirationDateFailedDto();
      failed.code = ChangeExpirationDateErrors.UserNotFound;
      failed.message = 'User not found';
      return failed;
    }

    foundUser.trialExpiresAt = data.newDate;
    await this.usersRepository.save(foundUser);

    return new ChangeExpirationDateSuccessDto();
  }
}
