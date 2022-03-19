export interface CreateDto {
  email: string;
  password: string;
  invite: string;
  inviteId: number;

  firstName: string;
  lastName: string;

  isTrial: boolean;
  trialExpiresAt: Date;
}

export interface Create2Dto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isTrial: boolean;
  trialExpiresAt: Date;
  role: string;
}
