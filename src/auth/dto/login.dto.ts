export class LoginDto {
  email: string;
  password: string;

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
