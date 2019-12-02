import BaseResponse from "./BaseResponse"

export default class LoginResponse extends BaseResponse {
  statusCode: number
  ok: number
  message: string
  token?: string

  constructor(statusCode: number, ok: number, message: string, token?: string) {
    super(statusCode, ok, message)
    this.token = token
  }

  response() {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify(
        {
          ok: this.ok,
          data: {
            message: this.message,
            token: this.token
          }
        },
        null,
        2
      )
    }
  }
}
