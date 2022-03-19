export const USER_ALREADY_EXIST_ERROR = 'UserAlreadyExist';
export class UserAlreadyExistError extends Error {
  constructor(message = 'User already exist') {
    super(message);
    this.name = USER_ALREADY_EXIST_ERROR;
  }
}
