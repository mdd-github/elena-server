export class RemoveSuccessResultDto {}

export class RemoveFailureResultDto {
  code: number;
  message: string;
}

export type RemoveResultDto = RemoveFailureResultDto | RemoveSuccessResultDto;
