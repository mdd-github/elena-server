export class GetInfoSuccessResultDto {
  id: number;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  banned: boolean;
}

export class GetInfoFailureResultDto {
  code: number;
  message: string;
}

export type GetInfoResultDto =
  | GetInfoFailureResultDto
  | GetInfoSuccessResultDto;
