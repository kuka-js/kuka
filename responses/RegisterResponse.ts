import BaseResponse from "./BaseResponse"

export default class RegisterResponse extends BaseResponse {
  statusCode: number
  ok: number
  message: string
  userId?: number
  token?: string

  constructor(
    statusCode: number,
    ok: number,
    message: string,
    userId?: number,
    token?: string
  ) {
    super(statusCode, ok, message)
    this.token = token
    this.userId = userId
  }

  response() {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify(
        {
          ok: this.ok,
          data: {
            message: this.message,
            userId: this.userId,
            token: this.token
          }
        },
        null,
        2
      )
    }
  }
}
