import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRoles {
  Admin = 'admin',
  Employee = 'employee',
}

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    name: 'password_hash',
  })
  passwordHash: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
    nullable: true,
  })
  lastName: string;

  @Column({
    default: 'employee',
  })
  role: string;

  @Column()
  banned: boolean;

  @Column({
    name: 'trial_expires_at',
    default: () => 'NOW()',
  })
  trialExpiresAt: Date;

  @Column({
    name: 'is_trial',
    default: false,
  })
  isTrial: boolean;
}
