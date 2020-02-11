import BaseResponse from "./BaseResponse"

export default class RegisterResponse extends BaseResponse {
  statusCode: number
  ok: number
  message: string
  userId?: number

  constructor(
    statusCode: number,
    ok: number,
    message: string,
    userId?: number
  ) {
    super(statusCode, ok, message)
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
            userId: this.userId
          }
        },
        null,
        2
      )
    }
  }
}
