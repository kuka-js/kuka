import BaseResponse from "./BaseResponse"

export default class HiddenResponse extends BaseResponse {
  statusCode: number
  ok: number
  message: string

  constructor(statusCode: number, ok: number, message: string) {
    super(statusCode, ok, message)
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
