import { IsNotEmpty, Matches } from 'class-validator';

export enum RegisterErrors {
  EmailRequired,
  PasswordRequired,
  InviteRequired,
  FirstNameRequired,
  LastNameRequired,
  IncorrectEmail,
  WeakPassword,
  UserAlreadyExist,
  IncorrectInvite,
}

export class RegisterDto {
  @IsNotEmpty({
    message: RegisterErrors.EmailRequired + '|Email is required',
  })
  @Matches(/.@./, {
    message: RegisterErrors.IncorrectEmail + '|Incorrect email address',
  })
  email: string;

  @IsNotEmpty({
    message: RegisterErrors.PasswordRequired + '|Password is required',
  })
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-z0-9]{6,}/, {
    message: RegisterErrors.WeakPassword + '|Weak password',
  })
  password: string;

  @IsNotEmpty({
    message: RegisterErrors.InviteRequired + '|Invite is required',
  })
  invite: string;

  @IsNotEmpty({
    message: RegisterErrors.FirstNameRequired + '|First name is required',
  })
  firstName: string;

  @IsNotEmpty({
    message: RegisterErrors.LastNameRequired + '|LastName is required',
  })
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
