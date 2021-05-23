export const INCORRECT_SESSION_ERROR = 'IncorrectSession';
export class IncorrectSessionError extends Error {
  constructor(message = 'Incorrect session') {
    super(message);
    this.name = INCORRECT_SESSION_ERROR;
  }
}