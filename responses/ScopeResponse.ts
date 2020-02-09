import BaseResponse from "./BaseResponse"

export default class ScopeResponse extends BaseResponse {
  statusCode: number
  ok: number
  message: string
  scopes: string[]

  constructor(
    statusCode: number,
    ok: number,
    message: string,
    scopes: string[]
  ) {
    super(statusCode, ok, message)
    this.scopes = scopes
  }

  response() {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify(
        {
          ok: this.ok,
          data: {
            message: this.message,
            scopes: this.scopes
          }
        },
        null,
        2
      )
    }
  }
}
