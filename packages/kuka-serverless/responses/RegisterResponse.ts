import BaseResponse from "./BaseResponse"
import { headers } from "./headers"

export default class RegisterResponse extends BaseResponse {
  statusCode: number
  ok: number
  message: string
  userId?: string

  constructor(
    statusCode: number,
    ok: number,
    message: string,
    userId?: string
  ) {
    super(statusCode, ok, message)
    this.userId = userId
  }

  response() {
    return {
      statusCode: this.statusCode,
      headers,
      body: JSON.stringify(
        {
          ok: this.ok,
          data: {
            message: this.message,
            userId: this.userId,
          },
        },
        null,
        2
      ),
    }
  }
}
