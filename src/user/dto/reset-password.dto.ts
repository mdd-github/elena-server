export class ResetPasswordDto {
  email: string;
}

export class ResetPasswordSucceedResultDto {}

export class ResetPasswordFailedResultDto {
  code: number;
  message: string;
}

export type ResetPasswordResultDto =
  | ResetPasswordSucceedResultDto
  | ResetPasswordFailedResultDto;
