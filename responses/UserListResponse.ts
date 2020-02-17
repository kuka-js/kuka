import BaseResponse from "./BaseResponse"

export default class UserListResponse extends BaseResponse {
  statusCode: number
  ok: number
  message: string
  users: object[]

  constructor(
    statusCode: number,
    ok: number,
    message: string,
    users: object[]
  ) {
    super(statusCode, ok, message)
    this.users = users
  }

  response() {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify(
        {
          ok: this.ok,
          data: {
            message: this.message,
            users: this.users
          }
        },
        null,
        2
      )
    }
  }
}
