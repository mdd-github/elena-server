export const INCORRECT_INVITE_ERROR = 'IncorrectInvite';
export class IncorrectInviteError extends Error {
  constructor(message = 'Incorrect invite') {
    super(message);
    this.name = INCORRECT_INVITE_ERROR;
  }
}
