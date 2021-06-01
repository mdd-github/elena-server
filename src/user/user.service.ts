import { Injectable } from '@nestjs/common';
import { UserEntity, UserRoles } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAlreadyExistError } from './errors/user-already-exist.error';
import { CreateDto } from './dto/create.dto';
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
  RemoveFailureResultDto,
  RemoveResultDto,
} from './dto/remove-result.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async removeById(id: number): Promise<void> {
    await this.usersRepository.delete(id);
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

    return await this.usersRepository.save(newUser);
  }
}
