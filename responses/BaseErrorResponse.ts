import BaseResponse from "./BaseResponse"

export default class BaseErrorResponse extends BaseResponse {
  statusCode: number
  ok: number
  message: string

  constructor(message: string) {
    super(500, 0, message)
  }

  response() {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify(
        {
          ok: this.ok,
          data: {
            message: this.message
          }
        },
        null,
        2
      )
    }
  }
}
