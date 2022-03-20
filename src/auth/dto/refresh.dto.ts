export class RefreshDto {
  fingerprint: string;
  refresh: string;
}

export class RefreshSuccessResultDto {
  id: number;
  role: string;
  token: string;
  refresh: string;
  isTrial: boolean;
  trialBefore: Date;
  emailConfirmed: boolean;
}

export class RefreshFailureResultDto {}

export type RefreshResultDto =
  | RefreshSuccessResultDto
  | RefreshFailureResultDto;
