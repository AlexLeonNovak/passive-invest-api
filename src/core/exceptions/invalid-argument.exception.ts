export class InvalidArgumentException extends Error {
  constructor(message = 'Invalid argument') {
    super(message);
  }
}
