export default class UserExistsException extends Error {
  constructor(message: string) {
    super(message)
  }
}
