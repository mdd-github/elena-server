import { IsNotEmpty, Matches } from 'class-validator';

export enum ChangePasswordErrors {
  OldPasswordRequired,
  NewPasswordRequired,
  WeakPassword,
  IncorrectPassword,
}

export class ChangePasswordDto {
  @IsNotEmpty({
    message:
      ChangePasswordErrors.OldPasswordRequired + '|Old password is required',
  })
  oldPassword: string;

  @IsNotEmpty({
    message:
      ChangePasswordErrors.NewPasswordRequired + '|New password is required',
  })
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-z0-9]{6,}/, {
    message: ChangePasswordErrors.WeakPassword + '|Weak password',
  })
  newPassword: string;

  userId: number;
}

export class ChangePasswordSucceedResultDto {}

export class ChangePasswordFailedResultDto {
  code: number;
  message: string;
}

export type ChangePasswordResultDto =
  | ChangePasswordSucceedResultDto
  | ChangePasswordFailedResultDto;
