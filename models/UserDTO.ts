export default class UserDTO {
  private _username!: string
  private _passwordHash!: string

  constructor(username: string, passwordHash: string) {
    this._username = username
    this._passwordHash = passwordHash
  }

  public getUsername(): string {
    return this._username
  }

  public setUsername(value: string) {
    this._username = value
  }

  public getPasswordHash(): string {
    return this._passwordHash
  }

  public setPasswordHash(value: string) {
    this._passwordHash = value
  }
}
