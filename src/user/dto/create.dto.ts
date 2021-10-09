export interface CreateDto {
  email: string;
  password: string;
  invite: string;

  firstName: string;
  lastName: string;

  isTrial: boolean;
  trialExpiresAt: Date;
}
