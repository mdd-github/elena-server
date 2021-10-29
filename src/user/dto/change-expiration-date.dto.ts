import { IsNotEmpty } from 'class-validator';
import { ChangePasswordFailedResultDto } from './change-password.dto';

export enum ChangeExpirationDateErrors {
  NewDateIsRequired,
  UserNotFound,
}

export class ChangeExpirationDateDto {
  @IsNotEmpty({
    message:
      ChangeExpirationDateErrors.NewDateIsRequired +
      '|Old password is required',
  })
  updateUserId: number;

  newDate: Date;
}

export class ChangeExpirationDateSuccessDto {}
export class ChangeExpirationDateFailedDto {
  code: number;
  message: string;
}

export type ChangeExpirationDateResultDto =
  | ChangeExpirationDateSuccessDto
  | ChangePasswordFailedResultDto;
