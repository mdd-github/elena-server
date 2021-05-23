import { Injectable } from '@nestjs/common';
import { UserEntity, UserRoles } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAlreadyExistError } from './errors/user-already-exist.error';
import { CreateDto } from './dto/create.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async getUserByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });
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
