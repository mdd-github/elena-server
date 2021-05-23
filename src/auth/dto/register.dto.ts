export interface RegisterDto {
  email: string;
  password: string;
  invite: string;

  firstName: string;
  lastName: string;
}

export class RegisterSuccessResultDto {
  id: number;
  role: string;
}

export class RegisterFailureResultDto {
  code: number;
  message: string;
}

export type RegisterResultDto =
  | RegisterSuccessResultDto
  | RegisterFailureResultDto;
