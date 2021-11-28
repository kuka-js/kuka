import BaseResponse from "./BaseResponse"
import { headers } from "./headers"

export default class ResetResponse extends BaseResponse {
  statusCode: number
  ok: number
  message: string
  resetId?: string

  constructor(
    statusCode: number,
    ok: number,
    message: string,
    resetId?: string
  ) {
    super(statusCode, ok, message)
    this.resetId = resetId
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
            resetId: this.resetId
          }
        },
        null,
        2
      )
    }
  }
}
