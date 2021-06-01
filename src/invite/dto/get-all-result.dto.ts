interface GetAllInvite {
  id: number;
  value: string;
  expiresAt: Date;
}

export class GetAllSuccessResultDto {
  count: number;
  invites: GetAllInvite[];
}

export class GetAllFailureResultDto {
  code: number;
  message: string;
}

export type GetAllResultDto = GetAllFailureResultDto | GetAllSuccessResultDto;
