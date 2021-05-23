import { UserEntity } from '../../user/user.entity';

export class CreateDto {
  user: UserEntity;
  fingerprint: string;
}
