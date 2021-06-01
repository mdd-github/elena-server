import { IsNotEmpty } from 'class-validator';

export enum LoginErrors {
  EmailRequired,
  PasswordRequired,
  FingerprintRequired,
  IncorrectLoginData,
  UserBanned,
}

export class LoginDto {
  @IsNotEmpty({
    message: LoginErrors.EmailRequired + '|Email is required',
  })
  email: string;

  @IsNotEmpty({
    message: LoginErrors.PasswordRequired + '|Password is required',
  })
  password: string;

  @IsNotEmpty({
    message: LoginErrors.FingerprintRequired + '|Fingerprint is required',
  })
  fingerprint: string;
}

export class LoginSuccessResultDto {
  id: number;
  role: string;
  token: string;
  refresh: string;
}

export class LoginFailureResultDto {
  code: number;
  message: string;
}

export type LoginResultDto = LoginSuccessResultDto | LoginFailureResultDto;
