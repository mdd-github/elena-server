interface GetAllUser {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
}

export class GetAllSuccessResultDto {
  count: number;
  users: GetAllUser[];
}

export class GetAllFailureResultDto {
  code: number;
  message: string;
}

export type GetAllResultDto = GetAllFailureResultDto | GetAllSuccessResultDto;
