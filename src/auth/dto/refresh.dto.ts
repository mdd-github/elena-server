export class RefreshDto {
  fingerprint: string;
  refresh: string;
}

export class RefreshSuccessResultDto {
  id: number;
  role: string;
  token: string;
  refresh: string;
}

export class RefreshFailureResultDto {
  code: number;
  message: string;
}

export type RefreshResultDto =
  | RefreshSuccessResultDto
  | RefreshFailureResultDto;
