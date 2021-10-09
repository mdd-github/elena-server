export enum GenerateErrors {
  AlreadyExist,
  WrongDate,
}

export class GenerateDto {
  value: string;
  limit: number;
  expiresAt: Date;
  isGroup: boolean;
}

export class GenerateSuccessResultDto {
  result: string;
}

export class GenerateFailureResultDto {
  code: number;
  message: string;
}

export type GenerateResultDto =
  | GenerateSuccessResultDto
  | GenerateFailureResultDto;
