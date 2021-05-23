export const SESSION_EXPIRED_ERROR = 'SessionExpired';
export class SessionExpiredError extends Error {
  constructor(message = 'Session expired') {
    super(message);
    this.name = SESSION_EXPIRED_ERROR;
  }
}